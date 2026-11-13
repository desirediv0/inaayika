import { prisma } from "../config/db.js";
import sendEmail from "./sendEmail.js";
import { getStoreConfig } from "./storeConfig.js";

const esc = (v) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const money = (n) => `₹${Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
const siteUrl = () => (process.env.FRONTEND_URL || process.env.CLIENT_URL || "https://inaayika.com").replace(/\/$/, "");

// A sale that started more than this long ago is considered stale (e.g. server was down): skip the blast
const MAX_LATE_HOURS = 12;
const SEND_DELAY_MS = 300;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const buildEmail = ({ name, sale, items }) => {
  const { storeName, storeEmail } = getStoreConfig();
  const rows = items
    .map(
      (i) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #eee">
          <a href="${siteUrl()}/products/${esc(i.slug)}" style="color:#003E29;text-decoration:none;font-weight:bold">${esc(i.name)}</a>
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #eee;text-align:right">
          ${i.regular > i.price ? `<s style="color:#9ca3af">${money(i.regular)}</s> ` : ""}<b style="color:#003E29">${money(i.price)}</b>
        </td>
      </tr>`
    )
    .join("");
  return `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:24px;color:#1f2937">
      <h2 style="margin:0 0 8px;color:#003E29">${esc(sale.name)} is live!</h2>
      <p>Hi ${esc(name || "there")}, ${sale.discountPercentage}% off on ${items.length === 1 ? "a piece" : "pieces"} you saved in your wishlist:</p>
      <table style="width:100%;border-collapse:collapse">${rows}</table>
      <p style="margin:20px 0">
        <a href="${siteUrl()}/wishlist" style="background:#003E29;color:#fff;padding:12px 22px;text-decoration:none;border-radius:6px">View my wishlist</a>
      </p>
      <p style="color:#6b7280;font-size:12px">Sale ends ${new Date(sale.endTime).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" })}. You are receiving this because these items are in your ${esc(storeName || "Inaayika")} wishlist. Questions? ${esc(storeEmail || "")}</p>
    </div>`;
};

/** Emails each customer the wishlisted items of one flash sale. Returns how many emails were sent. */
export async function sendSaleAlertsForSale(sale) {
  const saleProductIds = sale.products.map((p) => p.productId);
  if (!saleProductIds.length) return 0;

  const wishlist = await prisma.wishlistItem.findMany({
    where: { productId: { in: saleProductIds }, user: { isActive: true } },
    include: {
      user: { select: { id: true, name: true, email: true } },
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          variants: { select: { price: true, salePrice: true }, orderBy: { price: "asc" }, take: 1 },
        },
      },
    },
  });

  const byUser = new Map();
  for (const w of wishlist) {
    if (!w.user?.email) continue;
    const variant = w.product.variants[0];
    const regular = Number(variant?.salePrice || variant?.price || 0);
    const price = Math.round(regular * (1 - sale.discountPercentage / 100) * 100) / 100;
    if (!byUser.has(w.user.id)) byUser.set(w.user.id, { user: w.user, items: [] });
    byUser.get(w.user.id).items.push({ name: w.product.name, slug: w.product.slug, regular, price });
  }

  let sent = 0;
  for (const { user, items } of byUser.values()) {
    try {
      await sendEmail({
        email: user.email,
        subject: `${sale.name}: your wishlist items are on sale`,
        html: buildEmail({ name: user.name, sale, items }),
      });
      sent++;
    } catch (error) {
      console.error("Sale alert email failed for a customer:", error.message);
    }
    await sleep(SEND_DELAY_MS);
  }
  return sent;
}

/** Looks for sales that have just started and have not been announced yet. Safe to run on every instance. */
export async function runSaleAlertCheck() {
  const now = new Date();
  const due = await prisma.flashSale.findMany({
    where: { isActive: true, saleAlertSentAt: null, startTime: { lte: now }, endTime: { gt: now } },
    include: { products: true },
  });

  for (const sale of due) {
    // Atomic claim: if several server instances run this, only one wins and sends
    const claim = await prisma.flashSale.updateMany({
      where: { id: sale.id, saleAlertSentAt: null },
      data: { saleAlertSentAt: new Date() },
    });
    if (claim.count === 0) continue;

    const hoursLate = (now.getTime() - new Date(sale.startTime).getTime()) / 36e5;
    if (hoursLate > MAX_LATE_HOURS) {
      console.log(`Sale "${sale.name}" started ${Math.round(hoursLate)}h ago; skipping alerts.`);
      continue;
    }
    const sent = await sendSaleAlertsForSale(sale);
    console.log(`Sale "${sale.name}" live: sent ${sent} wishlist alert emails.`);
  }
}

export function startSaleAlertScheduler(intervalMs = 60 * 1000) {
  const tick = () =>
    runSaleAlertCheck().catch((error) => console.error("Sale alert check failed:", error.message));
  setTimeout(tick, 15 * 1000); // first check shortly after boot
  return setInterval(tick, intervalMs);
}
