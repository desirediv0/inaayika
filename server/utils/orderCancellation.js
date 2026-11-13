import { prisma } from "../config/db.js";
import { ApiError } from "./ApiError.js";
import { notifyOrderCancelled } from "./orderNotifications.js";

export const BUYER_CANCELLABLE = ["PENDING", "PROCESSING", "PAID"];
export const SELLER_CANCELLABLE = ["PENDING", "PROCESSING", "PAID", "SHIPPED"];

// Customers can cancel on their own within this many hours of placing the order (store owner: any time)
export const BUYER_CANCEL_WINDOW_HOURS = Number(process.env.ORDER_CANCEL_WINDOW_HOURS) || 24;

const round2 = (n) => Math.round(Number(n) * 100) / 100;

/**
 * Cancels an order, restocks the items and refunds prepaid (Razorpay) orders to the
 * original payment method. Cash on Delivery orders have no money to refund.
 *  - actorType BUYER  : order must belong to actorId, within the cancel window, only before shipping
 *  - actorType SELLER : store owner / admin, allowed up to SHIPPED
 */
export async function cancelOrderWithRefund({ orderId, actorId, actorType = "BUYER", reason }) {
  if (!reason || !String(reason).trim()) {
    throw new ApiError(400, "Cancellation reason is required");
  }

  const isBuyer = actorType === "BUYER";
  const order = await prisma.order.findFirst({
    where: { id: orderId, ...(isBuyer ? { userId: actorId } : {}) },
    include: { items: { include: { variant: true } }, razorpayPayment: true },
  });
  if (!order) throw new ApiError(404, "Order not found");

  const allowed = isBuyer ? BUYER_CANCELLABLE : SELLER_CANCELLABLE;
  if (!allowed.includes(order.status)) {
    throw new ApiError(
      400,
      isBuyer && order.status === "SHIPPED"
        ? "This order has already shipped and can no longer be cancelled"
        : "This order cannot be cancelled"
    );
  }

  if (isBuyer) {
    const hoursSincePlaced = (Date.now() - new Date(order.createdAt).getTime()) / 36e5;
    if (hoursSincePlaced > BUYER_CANCEL_WINDOW_HOURS) {
      throw new ApiError(
        400,
        `Orders can be cancelled within ${BUYER_CANCEL_WINDOW_HOURS} hours of placing them. Please contact us on WhatsApp for help.`
      );
    }
  }

  const payment = order.razorpayPayment;
  const isPrepaid =
    order.paymentMethod !== "CASH" &&
    !!payment?.razorpayPaymentId &&
    ["CAPTURED", "AUTHORIZED"].includes(payment.status);
  const refundAmount = isPrepaid ? round2(order.total) : 0;

  await prisma.$transaction(async (tx) => {
    // Atomic guard: only one request can move the order into CANCELLED (no double refund)
    const claimed = await tx.order.updateMany({
      where: { id: order.id, status: { in: allowed } },
      data: {
        status: "CANCELLED",
        cancelReason: String(reason).trim(),
        cancelledAt: new Date(),
        cancelledBy: actorId,
        cancelledByRole: actorType,
        refundMethod: isPrepaid ? "ORIGINAL" : null,
        refundStatus: isPrepaid ? "PENDING" : "NOT_REQUIRED",
        refundAmount: isPrepaid ? refundAmount : null,
      },
    });
    if (claimed.count === 0) {
      throw new ApiError(409, "This order was already updated. Please refresh.");
    }

    for (const item of order.items) {
      await tx.productVariant.update({
        where: { id: item.variantId },
        data: { quantity: { increment: item.quantity } },
      });
      await tx.inventoryLog.create({
        data: {
          variantId: item.variantId,
          quantityChange: item.quantity,
          reason: "cancellation",
          referenceId: order.id,
          previousQuantity: item.variant.quantity,
          newQuantity: item.variant.quantity + item.quantity,
          createdBy: actorId,
        },
      });
    }
  });

  let refundStatus = isPrepaid ? "PENDING" : "NOT_REQUIRED";

  // Razorpay refund to the original payment method (outside the DB transaction)
  if (isPrepaid) {
    try {
      const { razorpay } = await import("../app.js");
      if (!razorpay) throw new Error("Razorpay not initialized");
      const refund = await razorpay.payments.refund(payment.razorpayPaymentId, {
        amount: Math.round(refundAmount * 100),
        notes: { reason: `Order ${order.orderNumber} cancelled by ${actorType.toLowerCase()}` },
      });
      await prisma.$transaction([
        prisma.razorpayRefund.create({
          data: {
            razorpayPaymentId: payment.razorpayPaymentId,
            amount: refundAmount,
            razorpayRefundId: refund.id,
            status: "PROCESSED",
            reason: String(reason).trim(),
            notes: refund.notes || {},
          },
        }),
        prisma.razorpayPayment.update({
          where: { orderId: order.id },
          data: { status: "REFUNDED" },
        }),
        prisma.order.update({
          where: { id: order.id },
          data: { refundStatus: "PROCESSED", refundedAt: new Date() },
        }),
      ]);
      refundStatus = "PROCESSED";
    } catch (error) {
      console.error("Razorpay refund failed for order", order.orderNumber, error);
      await prisma.order.update({
        where: { id: order.id },
        data: { refundStatus: "FAILED" },
      });
      refundStatus = "FAILED";
    }
  }

  // Cancel the courier booking without blocking the response
  if (order.shiprocketOrderId) {
    try {
      const { cancelShiprocketOrder, getShiprocketSettings } = await import("./shiprocket.js");
      const settings = await getShiprocketSettings();
      if (settings.isEnabled) {
        await cancelShiprocketOrder(order.shiprocketOrderId);
        await prisma.order.update({
          where: { id: order.id },
          data: { shiprocketStatus: "CANCELLED" },
        });
      }
    } catch (error) {
      console.error("Failed to cancel Shiprocket order:", error.message);
    }
  }

  const refund = {
    required: isPrepaid,
    method: isPrepaid ? "ORIGINAL" : null,
    amount: refundAmount,
    status: refundStatus,
  };

  // Tell the customer (and the store) what happened; runs in the background
  notifyOrderCancelled({
    orderId: order.id,
    actorType,
    reason: String(reason).trim(),
    refund,
  });

  return { orderId: order.id, orderNumber: order.orderNumber, status: "CANCELLED", refund };
}

export function refundMessage(refund) {
  if (!refund?.required) return "Order cancelled successfully. No payment was collected, so nothing to refund.";
  if (refund.status === "PROCESSED")
    return `Order cancelled. ₹${refund.amount} will be refunded to your original payment method in 3-5 business days.`;
  return "Order cancelled, but the refund could not be started automatically. Our team will process it shortly.";
}
