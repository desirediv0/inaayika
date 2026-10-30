import { prisma } from "../config/db.js";
import sendEmail from "./sendEmail.js";
import { getStoreConfig } from "./storeConfig.js";

const esc = (v) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const money = (n) => `₹${parseFloat(n || 0).toFixed(2)}`;

// Who gets the "new order" alert: ORDER_NOTIFY_EMAIL (comma separated), else the store email
const getRecipients = () => {
  const configured = process.env.ORDER_NOTIFY_EMAIL || "";
  const list = configured
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
  if (list.length) return list;
  const { storeEmail } = getStoreConfig();
  return storeEmail ? [storeEmail] : [];
};

/**
 * Tells the shop owner that a new order arrived. Never throws: a failing mail server must not
 * break order creation or the customer's confirmation.
 */
export const notifyStoreOfNewOrder = async (orderId) => {
  try {
    const recipients = getRecipients();
    if (!recipients.length) {
      console.warn("New-order alert skipped: no ORDER_NOTIFY_EMAIL / STORE_EMAIL configured");
      return;
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: { select: { name: true, email: true, phone: true } },
        shippingAddress: true,
        items: {
          include: {
            product: { select: { name: true } },
            variant: { select: { sku: true } },
          },
        },
      },
    });
    if (!order) return;

    const addr = order.shippingAddress;
    const isCod = order.paymentMethod === "CASH";
    const phone = addr?.phone || order.user?.phone || "-";
    const adminUrl = `${process.env.ADMIN_URL || "https://admin.inaayika.com"}/orders`;

    const rows = order.items
      .map(
        (i) => `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #eee">${esc(i.product?.name)}<br><small style="color:#888">${esc(i.variant?.sku || "")}</small></td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${i.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${money(i.subtotal)}</td>
        </tr>`
      )
      .join("");

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#222">
        <h2 style="color:#003E29;margin-bottom:4px">New order received 🎉</h2>
        <p style="margin-top:0;color:#555">Order <b>#${esc(order.orderNumber)}</b> &middot; ${isCod ? "<b>Cash on Delivery</b> (collect payment)" : "<b>Paid online</b>"}</p>

        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <tr style="background:#f7f3eb"><th style="padding:8px;text-align:left">Item</th><th style="padding:8px">Qty</th><th style="padding:8px;text-align:right">Amount</th></tr>
          ${rows}
        </table>

        <p style="margin:4px 0">Subtotal: ${money(order.subTotal)}</p>
        ${parseFloat(order.discount) > 0 ? `<p style="margin:4px 0">Discount${order.couponCode ? ` (${esc(order.couponCode)})` : ""}: -${money(order.discount)}</p>` : ""}
        <p style="margin:4px 0">Shipping: ${money(order.shippingCost)}</p>
        ${parseFloat(order.codCharge) > 0 ? `<p style="margin:4px 0">COD charge: ${money(order.codCharge)}</p>` : ""}
        <p style="margin:8px 0;font-size:18px"><b>Total: ${money(order.total)}</b></p>

        <h3 style="margin-bottom:4px">Customer</h3>
        <p style="margin:2px 0">${esc(order.user?.name || addr?.name || "Customer")}</p>
        <p style="margin:2px 0">${esc(order.user?.email || "")}</p>
        <p style="margin:2px 0">Phone: ${esc(phone)}</p>

        <h3 style="margin-bottom:4px">Ship to</h3>
        <p style="margin:2px 0">${esc(addr?.street || "")}, ${esc(addr?.city || "")}, ${esc(addr?.state || "")} - ${esc(addr?.postalCode || "")}</p>

        <p style="margin-top:20px"><a href="${esc(adminUrl)}" style="background:#003E29;color:#fff;padding:10px 18px;text-decoration:none">Open orders in admin</a></p>
      </div>`;

    for (const email of recipients) {
      try {
        await sendEmail({
          email,
          subject: `New order #${order.orderNumber} - ${money(order.total)} (${isCod ? "COD" : "Paid"})`,
          html,
        });
      } catch (err) {
        console.error(`New-order alert to ${email} failed:`, err?.message || err);
      }
    }
  } catch (err) {
    console.error("New-order alert error:", err?.message || err);
  }
};
