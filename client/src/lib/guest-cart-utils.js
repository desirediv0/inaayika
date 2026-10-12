// Guest Cart Utilities
// This file handles cart functionality for non-logged-in users

const GUEST_CART_KEY = "inaayika_guest_cart";

// Get guest cart from localStorage
export const getGuestCart = () => {
    if (typeof window === "undefined") {
        return { items: [], subtotal: 0, itemCount: 0, totalQuantity: 0 };
    }

    try {
        const cartData = localStorage.getItem(GUEST_CART_KEY);
        const cart = cartData
            ? JSON.parse(cartData)
            : { items: [], subtotal: 0, itemCount: 0, totalQuantity: 0 };
        return cart;
    } catch (error) {
        console.error("Error reading guest cart:", error);
        return { items: [], subtotal: 0, itemCount: 0, totalQuantity: 0 };
    }
};

// Save guest cart to localStorage
export const saveGuestCart = (cart) => {
    if (typeof window === "undefined") return;

    try {
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
    } catch (error) {
        console.error("Error saving guest cart:", error);
    }
};

// Pick the unit price for a quantity (slab > sale price > regular price)
const getGuestUnitPrice = (item, quantity) => {
    const slabs = Array.isArray(item.pricingSlabs) ? item.pricingSlabs : [];
    const slab = slabs.find(
        (s) => quantity >= s.minQty && (s.maxQty == null || quantity <= s.maxQty)
    );
    return slab ? parseFloat(slab.price) : parseFloat(item.basePrice ?? item.price);
};

// Apply quantity (with slab pricing) to a guest cart item
const applyGuestQuantity = (item, quantity) => {
    item.quantity = quantity;
    item.price = getGuestUnitPrice(item, quantity);
    item.subtotal = (item.price * quantity).toFixed(2);
};

// Add item to guest cart
export const addToGuestCart = async (productVariantId, quantity = 1) => {
    try {
        // Fetch product variant details from backend
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === "development" ? "http://localhost:4004/api" : "https://api.inaayika.com/api")}/public/products/variants/${productVariantId}`,
            {
                credentials: "include",
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error("Failed to fetch product variant");
        }

        const variantData = await response.json();
        const variant = variantData.data.variant;

        const currentCart = getGuestCart();

        // Check if item already exists in cart
        const existingItemIndex = currentCart.items.findIndex(
            (item) => item.productVariantId === productVariantId
        );

        if (existingItemIndex !== -1) {
            // Update existing item quantity
            const existingItem = currentCart.items[existingItemIndex];
            const nextQty = existingItem.quantity + quantity;
            if (existingItem.stock != null && nextQty > existingItem.stock) {
                throw new Error(`Only ${existingItem.stock} units available`);
            }
            applyGuestQuantity(existingItem, nextQty);
        } else {
            const moq = variant.moq || 1;
            const stock = variant.stock ?? variant.quantity;
            if (quantity < moq) {
                throw new Error(`Minimum order quantity is ${moq} units`);
            }
            if (stock != null && quantity > stock) {
                throw new Error(`Only ${stock} units available`);
            }

            // Add new item
            const newItem = {
                id: `guest_${Date.now()}_${Math.random()}`,
                productVariantId: productVariantId,
                productId: variant.productId,
                productName: variant.product.name,
                productSlug: variant.product.slug,
                variantName: `${variant.flavor?.name || ""} ${variant.weight?.display || ""
                    }`.trim(),
                basePrice: variant.salePrice || variant.price,
                price: variant.salePrice || variant.price,
                quantity: quantity,
                subtotal: ((variant.salePrice || variant.price) * quantity).toFixed(2),
                moq,
                stock,
                pricingSlabs: variant.pricingSlabs || [],
                image: variant.images?.[0]?.url || variant.product.image,
                sku: variant.sku,
                flavor: variant.flavor,
                weight: variant.weight,
            };

            applyGuestQuantity(newItem, quantity);
            currentCart.items.push(newItem);
        }

        // Recalculate cart totals
        currentCart.subtotal = currentCart.items
            .reduce((sum, item) => sum + parseFloat(item.subtotal), 0)
            .toFixed(2);
        currentCart.itemCount = currentCart.items.length;
        currentCart.totalQuantity = currentCart.items.reduce(
            (sum, item) => sum + item.quantity,
            0
        );

        saveGuestCart(currentCart);
        return currentCart;
    } catch (error) {
        console.error("Error adding to guest cart:", error);
        throw error;
    }
};

// Update guest cart item quantity
export const updateGuestCartItem = (cartItemId, quantity) => {
    const currentCart = getGuestCart();
    const itemIndex = currentCart.items.findIndex(
        (item) => item.id === cartItemId
    );

    if (itemIndex === -1) throw new Error("Item not found in cart");

    if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        currentCart.items.splice(itemIndex, 1);
    } else {
        const item = currentCart.items[itemIndex];
        if (quantity < (item.moq || 1)) {
            throw new Error(`Minimum order quantity is ${item.moq} units`);
        }
        if (item.stock != null && quantity > item.stock) {
            throw new Error(`Only ${item.stock} units available`);
        }
        applyGuestQuantity(item, quantity);
    }

    // Recalculate cart totals
    currentCart.subtotal = currentCart.items
        .reduce((sum, item) => sum + parseFloat(item.subtotal), 0)
        .toFixed(2);
    currentCart.itemCount = currentCart.items.length;
    currentCart.totalQuantity = currentCart.items.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    saveGuestCart(currentCart);
    return currentCart;
};

// Remove item from guest cart
export const removeFromGuestCart = (cartItemId) => {
    const currentCart = getGuestCart();
    const itemIndex = currentCart.items.findIndex(
        (item) => item.id === cartItemId
    );

    if (itemIndex === -1) throw new Error("Item not found in cart");

    currentCart.items.splice(itemIndex, 1);

    // Recalculate cart totals
    currentCart.subtotal = currentCart.items
        .reduce((sum, item) => sum + parseFloat(item.subtotal), 0)
        .toFixed(2);
    currentCart.itemCount = currentCart.items.length;
    currentCart.totalQuantity = currentCart.items.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    saveGuestCart(currentCart);
    return currentCart;
};

// Clear guest cart
export const clearGuestCart = () => {
    const emptyCart = { items: [], subtotal: 0, itemCount: 0, totalQuantity: 0 };
    saveGuestCart(emptyCart);
    return emptyCart;
};

// Merge guest cart with user cart after login
export const mergeGuestCartWithUserCart = async () => {
    const guestCart = getGuestCart();

    if (guestCart.items.length === 0) {
        return { success: true, message: "No guest cart items to merge" };
    }

    try {
        // Store guest cart items before clearing
        const guestItemsToMerge = [...guestCart.items];

        // Clear guest cart first to prevent any race conditions
        clearGuestCart();

        // Process all items in parallel for faster merging
        const mergePromises = guestItemsToMerge.map(async (guestItem) => {
            try {
                // Validate quantity before sending
                const quantity = Math.max(1, parseInt(guestItem.quantity) || 1);

                const addResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === "development" ? "http://localhost:4004/api" : "https://api.inaayika.com/api")}/cart/add`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                        body: JSON.stringify({
                            productVariantId: guestItem.productVariantId,
                            quantity: quantity,
                        }),
                        // Add timeout to prevent hanging requests
                        signal: AbortSignal.timeout(10000), // 10 second timeout
                    }
                );

                if (addResponse.ok) {
                    return { success: true, item: guestItem };
                } else {
                    console.warn(
                        `Failed to merge item ${guestItem.productVariantId}: ${addResponse.statusText}`
                    );
                    return {
                        success: false,
                        item: guestItem,
                        error: addResponse.statusText,
                    };
                }
            } catch (error) {
                console.error(
                    `Error merging item ${guestItem.productVariantId}:`,
                    error
                );
                return { success: false, item: guestItem, error: error.message };
            }
        });

        // Wait for all merge operations to complete
        const results = await Promise.all(mergePromises);

        // Count successful and failed merges
        const mergedCount = results.filter((result) => result.success).length;
        const skippedCount = results.filter((result) => !result.success).length;

        let message = `Successfully merged ${mergedCount} items from guest cart`;
        if (skippedCount > 0) {
            message += `. ${skippedCount} items could not be merged.`;
        }

        if (mergedCount > 0) {
            message += " Your existing cart items have been preserved.";
        }

        return {
            success: true,
            message,
            mergedItems: mergedCount,
            skippedItems: skippedCount,
        };
    } catch (error) {
        console.error("Error merging guest cart:", error);

        return {
            success: false,
            message: "Failed to merge cart items. Please try again.",
        };
    }
};

// Check if guest cart has items
export const hasGuestCartItems = () => {
    const cart = getGuestCart();
    return cart.items.length > 0;
};

// Get guest cart item count for navbar display
export const getGuestCartItemCount = () => {
    const cart = getGuestCart();
    return cart.totalQuantity || 0;
};
