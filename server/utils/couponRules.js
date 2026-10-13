import { prisma } from "../config/db.js";
import { ApiError } from "./ApiError.js";

/* ─────────────────────────────────────────
   First-order coupon rules
   A "first order" coupon is one-time per customer. A customer is recognised by ANY of:
     - the same account (userId)
     - the same mobile number (account phone or shipping-address phone)
     - the same delivery address (street + PIN code)
   If a non-cancelled order already exists for that identity, the coupon is refused.
───────────────────────────────────────── */

// No dedicated DB flag exists, so detect by wording/code (e.g. WELCOME5, "first time buyers")
const FIRST_ORDER_PATTERN =
  /first[\s-]*(time|order|purchase)|new[\s-]*(user|customer|buyer)/i;

export const isFirstOrderCoupon = (coupon) =>
  FIRST_ORDER_PATTERN.test(coupon?.description || "") ||
  /^WELCOME/i.test(coupon?.code || "");

// Last 10 digits so "+91 98765-43210", "098765 43210" and "9876543210" all match
export const normalizePhone = (phone) => {
  const digits = String(phone || "").replace(/\D/g, "");
  return digits.length >= 10 ? digits.slice(-10) : "";
};

// Returns the prior order that proves this customer already ordered, or null
export const findPriorOrderForCustomer = async ({ userId, phones = [], address }) => {
  const phone10s = [...new Set(phones.map(normalizePhone).filter(Boolean))];

  const identity = [];
  if (userId) identity.push({ userId });
  for (const p of phone10s) {
    identity.push({ user: { phone: { endsWith: p } } });
    identity.push({ shippingAddress: { phone: { endsWith: p } } });
  }
  if (address?.street && address?.postalCode) {
    identity.push({
      shippingAddress: {
        postalCode: String(address.postalCode).trim(),
        street: { equals: String(address.street).trim(), mode: "insensitive" },
      },
    });
  }
  if (!identity.length) return null;

  return prisma.order.findFirst({
    where: {
      status: { notIn: ["CANCELLED"] },
      OR: identity,
    },
    select: { id: true, userId: true },
  });
};

// Gathers phones/address for a logged-in user (+ optional shipping address) and checks for prior orders.
// Guests (no userId) and brand-new identities are first-time customers.
export const isFirstTimeCustomer = async ({ userId, shippingAddress } = {}) => {
  if (!userId) return true;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { phone: true },
  });
  const prior = await findPriorOrderForCustomer({
    userId,
    phones: [user?.phone, shippingAddress?.phone],
    address: shippingAddress,
  });
  return !prior;
};

export const getFirstOrderIneligibleMessage = () =>
  "This coupon is valid only on your first order. An order already exists with this account, mobile number or address.";

// Date window + usage limit; returns an error message or null
export const getCouponAvailabilityError = (coupon) => {
  const now = new Date();
  if (coupon.startDate && new Date(coupon.startDate) > now) {
    return "This coupon is not active yet";
  }
  if (coupon.endDate && new Date(coupon.endDate) < now) {
    return "This coupon has expired";
  }
  if (coupon.maxUses && (coupon.usedCount || 0) >= coupon.maxUses) {
    return "Coupon usage limit exceeded";
  }
  return null;
};

export const calculateCouponDiscount = (coupon, applicableSubtotal) => {
  let discount;
  if (coupon.discountType === "PERCENTAGE") {
    const pct = Math.min(parseFloat(coupon.discountValue), 90);
    discount = (applicableSubtotal * pct) / 100;
  } else {
    discount = parseFloat(coupon.discountValue);
  }
  // Never more than 90% of the applicable amount
  discount = Math.min(discount, applicableSubtotal * 0.9);
  return Math.max(0, Math.round(discount * 100) / 100);
};

// Brand/category come from the DB so a tampered or guest payload can't change eligibility
export const resolveCouponItems = async (items = []) => {
  const ids = [...new Set(items.map((i) => i.productId).filter(Boolean))];
  if (!ids.length) return items;
  const products = await prisma.product.findMany({
    where: { id: { in: ids } },
    select: {
      id: true,
      brandId: true,
      categories: { select: { categoryId: true } },
    },
  });
  const byId = new Map(products.map((p) => [p.id, p]));
  return items.map((item) => {
    const p = byId.get(item.productId);
    return p
      ? {
          ...item,
          brandId: p.brandId,
          categoryIds: p.categories.map((c) => c.categoryId),
        }
      : item;
  });
};

// Subtotal of the items a coupon applies to (whole cart when the coupon has no targets)
export const getApplicableSubtotal = (coupon, items) => {
  const total = items.reduce(
    (sum, i) => sum + parseFloat(i.price) * (i.quantity || 1),
    0
  );
  const hasTargets =
    coupon.categories?.length || coupon.products?.length || coupon.brands?.length;
  if (!hasTargets) return { applicableSubtotal: total, matchedItems: 0, total };

  const categorySet = new Set(coupon.categories.map((c) => c.categoryId));
  const productSet = new Set(coupon.products.map((p) => p.productId));
  const brandSet = new Set(coupon.brands.map((b) => b.brandId));

  let matchedItems = 0;
  let matched = 0;
  for (const item of items) {
    const hit =
      productSet.has(item.productId) ||
      (item.brandId && brandSet.has(item.brandId)) ||
      (item.categoryIds || []).some((c) => categorySet.has(c));
    if (hit) {
      matchedItems++;
      matched += parseFloat(item.price) * (item.quantity || 1);
    }
  }
  return { applicableSubtotal: matched, matchedItems, total };
};

/**
 * Full server-side coupon validation used when an order/payment is created.
 * items: [{ productId, price, quantity }]  (price = unit price actually charged)
 * Returns { coupon, discount } or throws ApiError(400).
 */
export const validateCouponForOrder = async ({
  code,
  couponId,
  userId,
  shippingAddress,
  items,
}) => {
  const coupon = await prisma.coupon.findFirst({
    where: {
      isActive: true,
      ...(couponId
        ? { id: couponId }
        : { code: { equals: String(code).trim(), mode: "insensitive" } }),
    },
    include: { categories: true, products: true, brands: true },
  });

  if (!coupon) throw new ApiError(400, "Invalid coupon code");

  const availabilityError = getCouponAvailabilityError(coupon);
  if (availabilityError) throw new ApiError(400, availabilityError);

  if (isFirstOrderCoupon(coupon)) {
    const firstTime = await isFirstTimeCustomer({ userId, shippingAddress });
    if (!firstTime) throw new ApiError(400, getFirstOrderIneligibleMessage());
  }

  const resolved = await resolveCouponItems(items);
  const { applicableSubtotal, matchedItems } = getApplicableSubtotal(coupon, resolved);

  const hasTargets =
    coupon.categories.length || coupon.products.length || coupon.brands.length;
  if (hasTargets && matchedItems === 0) {
    throw new ApiError(400, "This coupon does not apply to the products in your cart");
  }

  if (coupon.minOrderAmount && applicableSubtotal < parseFloat(coupon.minOrderAmount)) {
    throw new ApiError(400, `Minimum order amount of ₹${coupon.minOrderAmount} required`);
  }

  return { coupon, discount: calculateCouponDiscount(coupon, applicableSubtotal) };
};
