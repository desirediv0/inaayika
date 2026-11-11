/**
 * Create the missing order for a payment that Razorpay captured but the site never confirmed.
 *   node scripts/recoverPayment.js pay_XXXXXXXX [userId] [shippingAddressId]
 * Finds the customer from Razorpay's email/phone unless a userId is given. Safe to re-run.
 */
import { recoverPaidOrder } from "../controllers/payment.controller.js";

const [paymentId, userId, shippingAddressId] = process.argv.slice(2);
if (!paymentId) {
  console.log("Usage: node scripts/recoverPayment.js <razorpay_payment_id> [userId] [shippingAddressId]");
  process.exit(1);
}
try {
  const r = await recoverPaidOrder(paymentId, { userId, shippingAddressId });
  console.log(r.alreadyExists ? "Order already exists:" : "Order created:", r.order);
} catch (e) {
  console.error("Failed:", e.message);
  process.exitCode = 1;
}
process.exit();
