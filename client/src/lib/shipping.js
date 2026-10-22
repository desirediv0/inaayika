export const MINIMUM_ORDER_VALUE = 350;
export const DELHI_SHIPPING_CHARGE = 70;
export const OTHER_STATE_SHIPPING_CHARGE = 95;

export function getShippingChargeForPostalCode(postalCode) {
    return /^110\d{3}$/.test(String(postalCode || "").trim())
        ? DELHI_SHIPPING_CHARGE
        : OTHER_STATE_SHIPPING_CHARGE;
}

export function getShippingTotal(postalCode, subtotal, freeShippingThreshold = 0) {
    if (freeShippingThreshold > 0 && Number(subtotal) >= Number(freeShippingThreshold)) {
        return 0;
    }
    return getShippingChargeForPostalCode(postalCode);
}
