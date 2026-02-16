/**
 * Cart Module
 * Manages shopping cart state using localStorage
 */

const CART_STORAGE_KEY = 'sidehustle_cart';
const CART_VERSION_KEY = 'sidehustle_cart_version';
const CART_VERSION = 3;

// Migrate old cart data if version mismatch
(function migrateCart() {
    try {
        const version = parseInt(localStorage.getItem(CART_VERSION_KEY), 10);
        if (version !== CART_VERSION) {
            localStorage.removeItem(CART_STORAGE_KEY);
            localStorage.setItem(CART_VERSION_KEY, CART_VERSION.toString());
        }
    } catch (e) {
        // Ignore storage errors
    }
})();

// Cart event types
export const CART_EVENTS = {
    UPDATED: 'cart:updated',
    ITEM_ADDED: 'cart:item-added',
    ITEM_REMOVED: 'cart:item-removed',
    CLEARED: 'cart:cleared'
};

/**
 * Generate a unique cart item ID
 * @param {string} productId - The product/gallery item ID
 * @param {string} optionId - The selected purchase option ID
 * @param {string} subOption - The selected sub-option ID (or empty string)
 * @param {string} frameColor - The selected frame color ID (or empty string)
 * @returns {string} Unique cart item ID
 */
function generateCartItemId(productId, optionId, subOption, frameColor) {
    return `${productId}_${optionId}_${subOption || 'none'}_${frameColor || 'none'}`;
}

/**
 * Get the cart from localStorage
 * @returns {Array} Array of cart items
 */
export function getCart() {
    try {
        const cartData = localStorage.getItem(CART_STORAGE_KEY);
        return cartData ? JSON.parse(cartData) : [];
    } catch (error) {
        console.error('Error reading cart from localStorage:', error);
        return [];
    }
}

/**
 * Save the cart to localStorage
 * @param {Array} cart - The cart array to save
 */
function saveCart(cart) {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        dispatchCartEvent(CART_EVENTS.UPDATED, { cart });
    } catch (error) {
        console.error('Error saving cart to localStorage:', error);
    }
}

/**
 * Dispatch a custom cart event
 * @param {string} eventType - The event type from CART_EVENTS
 * @param {Object} detail - Event detail data
 */
function dispatchCartEvent(eventType, detail = {}) {
    const event = new CustomEvent(eventType, {
        detail: {
            ...detail,
            cartCount: getCartCount(),
            cartTotal: getCartTotal()
        }
    });
    window.dispatchEvent(event);
}

/**
 * Add an item to the cart
 * @param {Object} item - The item to add
 * @param {string} item.productId - The product/gallery item ID
 * @param {string} item.slug - The product slug (for image paths)
 * @param {string} item.title - The product title
 * @param {string} item.type - Product type (art/photography)
 * @param {string} item.optionId - Selected purchase option ID
 * @param {string} item.optionLabel - Human-readable option label
 * @param {string} [item.subOption] - Selected sub-option ID
 * @param {string} [item.subOptionLabel] - Human-readable sub-option label
 * @param {string} [item.sizeNote] - Size note (e.g., "13×19")
 * @param {string} [item.frameColor] - Selected frame color ID
 * @param {string} [item.frameColorLabel] - Human-readable frame color label
 * @param {number} item.price - Price in cents
 * @param {number} [item.quantity=1] - Quantity to add
 * @returns {Object} The added/updated cart item
 */
export function addItem(item) {
    const cart = getCart();
    const cartItemId = generateCartItemId(item.productId, item.optionId, item.subOption, item.frameColor);

    // Check if item already exists in cart
    const existingIndex = cart.findIndex(cartItem => cartItem.id === cartItemId);

    if (existingIndex !== -1) {
        // Update quantity of existing item
        cart[existingIndex].quantity += (item.quantity || 1);
        saveCart(cart);
        dispatchCartEvent(CART_EVENTS.ITEM_ADDED, { item: cart[existingIndex] });
        return cart[existingIndex];
    }

    // Add new item
    const newItem = {
        id: cartItemId,
        productId: item.productId,
        slug: item.slug,
        title: item.title,
        type: item.type,
        optionId: item.optionId,
        optionLabel: item.optionLabel,
        subOption: item.subOption || '',
        subOptionLabel: item.subOptionLabel || '',
        sizeNote: item.sizeNote || '',
        frameColor: item.frameColor || '',
        frameColorLabel: item.frameColorLabel || '',
        price: item.price,
        quantity: item.quantity || 1,
        addedAt: new Date().toISOString()
    };

    cart.push(newItem);
    saveCart(cart);
    dispatchCartEvent(CART_EVENTS.ITEM_ADDED, { item: newItem });
    return newItem;
}

/**
 * Add item with default options (Digital File, Square)
 * Used for quick "Add to Cart" from product cards
 * @param {Object} galleryItem - The gallery item from gallery-data.js
 * @param {Array} purchaseOptions - Available purchase options
 * @returns {Object} The added cart item
 */
export function addItemWithDefaults(galleryItem, purchaseOptions) {
    const defaultOption = purchaseOptions[0];
    const defaultSub = defaultOption.subOptions?.[0];

    return addItem({
        productId: galleryItem.id,
        slug: galleryItem.slug,
        title: galleryItem.title,
        type: galleryItem.type,
        optionId: defaultOption.id,
        optionLabel: defaultOption.label,
        subOption: defaultSub?.id || '',
        subOptionLabel: defaultSub?.label || '',
        sizeNote: defaultSub?.sizeNote || defaultOption.sizeNote || '',
        price: defaultOption.price,
        quantity: 1
    });
}

/**
 * Remove an item from the cart
 * @param {string} cartItemId - The cart item ID to remove
 * @returns {boolean} True if item was removed
 */
export function removeItem(cartItemId) {
    const cart = getCart();
    const index = cart.findIndex(item => item.id === cartItemId);

    if (index !== -1) {
        const removedItem = cart.splice(index, 1)[0];
        saveCart(cart);
        dispatchCartEvent(CART_EVENTS.ITEM_REMOVED, { item: removedItem });
        return true;
    }

    return false;
}

/**
 * Update the quantity of a cart item
 * @param {string} cartItemId - The cart item ID
 * @param {number} quantity - New quantity (must be > 0)
 * @returns {Object|null} The updated cart item or null if not found
 */
export function updateQuantity(cartItemId, quantity) {
    if (quantity < 1) {
        removeItem(cartItemId);
        return null;
    }

    const cart = getCart();
    const item = cart.find(item => item.id === cartItemId);

    if (item) {
        item.quantity = quantity;
        saveCart(cart);
        return item;
    }

    return null;
}

/**
 * Get the total price of all items in the cart (in cents)
 * @returns {number} Total price in cents
 */
export function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => {
        return total + item.price * item.quantity;
    }, 0);
}

/**
 * Get the total number of items in the cart
 * @returns {number} Total item count (sum of all quantities)
 */
export function getCartCount() {
    const cart = getCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
}

/**
 * Get the number of unique items in the cart
 * @returns {number} Number of unique items
 */
export function getUniqueItemCount() {
    return getCart().length;
}

/**
 * Clear all items from the cart
 */
export function clearCart() {
    localStorage.removeItem(CART_STORAGE_KEY);
    dispatchCartEvent(CART_EVENTS.CLEARED);
    dispatchCartEvent(CART_EVENTS.UPDATED, { cart: [] });
}

/**
 * Check if an item is in the cart
 * @param {string} productId - The product ID to check
 * @returns {boolean} True if any variant of the product is in the cart
 */
export function isInCart(productId) {
    const cart = getCart();
    return cart.some(item => item.productId === productId);
}

/**
 * Get all cart items for a specific product
 * @param {string} productId - The product ID
 * @returns {Array} Array of cart items for this product
 */
export function getItemsByProduct(productId) {
    const cart = getCart();
    return cart.filter(item => item.productId === productId);
}

/**
 * Format a price from cents to dollars
 * @param {number} cents - Price in cents
 * @returns {string} Formatted price string (e.g., "$45.00")
 */
export function formatPrice(cents) {
    return '$' + (cents / 100).toFixed(2);
}

/**
 * Get item subtotal (price * quantity)
 * @param {Object} item - Cart item
 * @returns {number} Subtotal in cents
 */
export function getItemSubtotal(item) {
    return item.price * item.quantity;
}
