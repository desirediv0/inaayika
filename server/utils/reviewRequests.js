import { prisma } from "../config/db.js";
import sendEmail from "./sendEmail.js";
import { getStoreConfig } from "./storeConfig.js";
import { getFileUrl } from "./deleteFromS3.js";

const esc = (v) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const siteUrl = () =>
  (process.env.FRONTEND_URL || process.env.CLIENT_URL || getStoreConfig().websiteUrl || "https://inaayika.com").replace(/\/$/, "");

// Days to wait after delivery before asking for a review (gives time for returns/damage claims)
const DELAY_DAYS = Number(process.env.REVIEW_REQUEST_DELAY_DAYS) || 3;
// Never email about orders delivered longer ago than this
const MAX_AGE_DAYS = 45;
const BATCH = 40;
const SEND_DELAY_MS = 300;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const absoluteImage = (key) => {
  if (!key) return null;
  return /^https?:\/\//i.test(key) ? key : getFileUrl(key);
};

const buildEmail = ({ name, orderNumber, products }) => {
  const { storeName, storeEmail, storePhone } = getStoreConfig();
  const cards = products
    .map((p) => {
      const link = `${siteUrl()}/products/${encodeURIComponent(p.slug)}?review=true`;
      return `
      <tr>
        <td style="padding:14px 0;border-bottom:1px solid #eee;width:96px;vertical-align:top">
          <a href="${link}">${
            p.image
              ? `<img src="${esc(p.image)}" alt="${esc(p.name)}" width="88" height="88" style="display:block;width:88px;height:88px;object-fit:cover;border-radius:8px;border:1px solid #E5E7EB" />`
              : `<div style="width:88px;height:88px;border-radius:8px;background:#F7F3EB"></div>`
          }</a>
        </td>
        <td style="padding:14px 0 14px 14px;border-bottom:1px solid #eee;vertical-align:middle">
          <div style="font-weight:bold;color:#002216;margin-bottom:8px">${esc(p.name)}</div>
          <a href="${link}" style="display:inline-block;background:#003E29;color:#ffffff;text-decoration:none;padding:9px 18px;border-radius:6px;font-size:13px;font-weight:bold">Write a review</a>
        </td>
      </tr>`;
    })
    .join("");

  return `
  <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:24px;color:#1f2937">
    <h2 style="margin:0 0 8px;color:#003E29">How did you like your order?</h2>
    <p>Hi ${esc(name || "there")}, your order <b>#${esc(orderNumber)}</b> was delivered. Your honest review helps other shoppers and a small handcrafted brand like ours grow.</p>
    <table style="width:100%;border-collapse:collapse">${cards}</table>
    <p style="margin-top:20px;font-size:13px;color:#6b7280">If you are not logged in, you will be asked to sign in first and then taken straight to the review box. It takes less than a minute.</p>
    <p style="font-size:12px;color:#9ca3af">Something wrong with your order? Please write to ${esc(storeEmail || "")}${storePhone ? ` or call/WhatsApp ${esc(storePhone)}` : ""} instead. ${esc(storeName || "Inaayika")}</p>
  </div>`;
};

/** Sends the review request for one delivered order (already claimed). Returns true if an email went out. */
async function sendReviewRequest(orderId) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: { select: { id: true, name: true, email: true } },
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              images: { select: { url: true, isPrimary: true } },
            },
          },
        },
      },
    },
  });
  if (!order?.user?.email) return false;

  const productIds = [...new Set(order.items.map((i) => i.productId))];
  const alreadyReviewed = await prisma.review.findMany({
    where: { userId: order.userId, productId: { in: productIds } },
    select: { productId: true },
  });
  const reviewed = new Set(alreadyReviewed.map((r) => r.productId));

  const seen = new Set();
  const products = [];
  for (const item of order.items) {
    const p = item.product;
    if (!p || reviewed.has(p.id) || seen.has(p.id)) continue;
    seen.add(p.id);
    const img = p.images?.find((i) => i.isPrimary) || p.images?.[0];
    products.push({ name: p.name, slug: p.slug, image: absoluteImage(img?.url) });
  }
  if (!products.length) return false; // everything already reviewed

  await sendEmail({
    email: order.user.email,
    subject: `How was your order #${order.orderNumber}? Share a quick review`,
    html: buildEmail({ name: order.user.name, orderNumber: order.orderNumber, products }),
  });
  return true;
}

/** Finds delivered orders with no return/cancel that are due a review request. Safe to run on every instance. */
export async function runReviewRequestCheck() {
  const now = Date.now();
  const cutoff = new Date(now - DELAY_DAYS * 864e5);
  const oldest = new Date(now - MAX_AGE_DAYS * 864e5);

  const candidates = await prisma.order.findMany({
    where: {
      status: "DELIVERED",
      reviewRequestSentAt: null,
      updatedAt: { gte: oldest },
      // no return requested (a rejected return does not count)
      returnRequests: { none: { status: { not: "REJECTED" } } },
    },
    select: { id: true, updatedAt: true, tracking: { select: { deliveredAt: true } } },
    take: BATCH * 3,
  });

  const due = candidates
    .filter((o) => new Date(o.tracking?.deliveredAt || o.updatedAt) <= cutoff)
    .slice(0, BATCH);

  for (const o of due) {
    // Atomic claim: if several server instances run this, only one wins and sends
    const claim = await prisma.order.updateMany({
      where: { id: o.id, reviewRequestSentAt: null, status: "DELIVERED" },
      data: { reviewRequestSentAt: new Date() },
    });
    if (claim.count === 0) continue;
    try {
      const sent = await sendReviewRequest(o.id);
      if (sent) console.log(`Review request sent for order ${o.id}`);
    } catch (error) {
      console.error("Review request email failed:", error.message);
    }
    await sleep(SEND_DELAY_MS);
  }
}

export function startReviewRequestScheduler(intervalMs = 60 * 60 * 1000) {
  const tick = () =>
    runReviewRequestCheck().catch((error) => console.error("Review request check failed:", error.message));
  setTimeout(tick, 30 * 1000);
  return setInterval(tick, intervalMs);
}
