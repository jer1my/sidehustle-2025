/**
 * Cart Page Module
 * Handles rendering and interaction for the shopping cart page
 */

import {
    getCart,
    removeItem,
    updateQuantity,
    getCartTotal,
    getCartCount,
    formatPrice,
    getItemSubtotal,
    CART_EVENTS
} from './cart.js';
import { getMainImagePath, getMainImagePathForTheme, getThumbImagePathForTheme, getItemBySlug } from '../gallery/gallery-data.js';

const IMAGE_CONFIG_BASE = 'assets/images/gallery';

function getCurrentTheme() {
    return document.body.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

/**
 * Get the best image path for a cart item based on its selected options.
 * Matches the same logic as the product detail carousel selection.
 */
function getCartItemImagePath(item, theme) {
    const galleryItem = getItemBySlug(item.slug);
    if (!galleryItem) return getThumbImagePathForTheme(item.slug, theme);

    const slides = galleryItem.images.slides;
    const thumbSlides = galleryItem.images.thumbSlides;
    const thumbSlidesLight = galleryItem.images.thumbSlidesLight;
    const slidesLight = galleryItem.images.slidesLight;
    let matchIdx = -1;

    if (item.optionId === 'framed-square' || item.optionId === 'framed-rect') {
        const shapeKeyword = item.optionId === 'framed-square' ? 'square'
            : (item.subOption === 'landscape' ? 'landscape' : 'portrait');
        matchIdx = slides.findIndex(f => f.includes('frame') && f.includes(shapeKeyword));
    } else if (item.subOption && item.subOption !== 'none') {
        const isDigital = item.optionId === 'digital';
        const isPrint = item.optionId === 'print';
        matchIdx = slides.findIndex(f => {
            if (!f.includes(item.subOption)) return false;
            if (f.includes('frame')) return false;
            if (isDigital && f.includes('print')) return false;
            if (isPrint && !f.includes('print')) return false;
            return true;
        });
    }

    if (matchIdx >= 0) {
        // Prefer thumbnail, fall back to full slide
        if (theme === 'light') {
            const lightThumb = thumbSlidesLight[matchIdx];
            if (lightThumb) return `${IMAGE_CONFIG_BASE}/${item.slug}/${lightThumb}`;
        }
        const darkThumb = thumbSlides[matchIdx];
        if (darkThumb) return `${IMAGE_CONFIG_BASE}/${item.slug}/${darkThumb}`;

        // Fallback to full-size slide
        const lightFile = slidesLight[matchIdx];
        const file = (theme === 'light' && lightFile) ? lightFile : slides[matchIdx];
        return `${IMAGE_CONFIG_BASE}/${item.slug}/${file}`;
    }

    return getThumbImagePathForTheme(item.slug, theme);
}

// Update cart item images when theme changes
window.addEventListener('themechange', (e) => {
    document.querySelectorAll('.cart-item__image[data-cart-item-id]').forEach(el => {
        const cartItemId = el.dataset.cartItemId;
        const cart = getCart();
        const cartItem = cart.find(i => i.id === cartItemId);
        if (cartItem) {
            const newPath = getCartItemImagePath(cartItem, e.detail.theme);
            el.style.backgroundImage = `url('${newPath}')`;
        }
    });
});

// DOM Elements
let cartItemsContainer = null;
let cartSummaryContainer = null;
let cartEmptyContainer = null;
let cartContentContainer = null;
let paypalContainer = null;

/**
 * Initialize the cart page
 */
export function init() {
    cartItemsContainer = document.getElementById('cart-items');
    cartSummaryContainer = document.getElementById('cart-summary');
    cartEmptyContainer = document.getElementById('cart-empty');
    cartContentContainer = document.getElementById('cart-content');
    paypalContainer = document.getElementById('paypal-button-container');

    if (!cartItemsContainer) {
        console.error('Cart items container not found');
        return;
    }

    // Listen for cart updates
    window.addEventListener(CART_EVENTS.UPDATED, renderCart);

    // Initial render
    renderCart();
}

/**
 * Render the cart contents
 */
export function renderCart() {
    const cart = getCart();

    if (cart.length === 0) {
        showEmptyState();
        return;
    }

    showCartContent();
    renderCartItems(cart);
    renderCartSummary();
}

/**
 * Show empty cart state
 */
function showEmptyState() {
    if (cartEmptyContainer) {
        cartEmptyContainer.style.display = 'block';
    }
    if (cartContentContainer) {
        cartContentContainer.style.display = 'none';
    }
}

/**
 * Show cart content
 */
function showCartContent() {
    if (cartEmptyContainer) {
        cartEmptyContainer.style.display = 'none';
    }
    if (cartContentContainer) {
        cartContentContainer.style.display = 'block';
    }
}

/**
 * Render cart items list
 * @param {Array} cart - Array of cart items
 */
function renderCartItems(cart) {
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = cart.map(item => createCartItemHTML(item)).join('');

    // Attach event listeners
    cartItemsContainer.querySelectorAll('.cart-item__quantity-btn').forEach(btn => {
        btn.addEventListener('click', handleQuantityChange);
    });

    cartItemsContainer.querySelectorAll('.cart-item__remove').forEach(btn => {
        btn.addEventListener('click', handleRemoveItem);
    });
}

/**
 * Create HTML for a single cart item
 * @param {Object} item - Cart item
 * @returns {string} HTML string
 */
function getCartItemAspectClass(item) {
    if (item.optionId === 'framed-square' || item.subOption === 'square') return 'cart-item__image--square';
    if (item.subOption === 'landscape') return 'cart-item__image--landscape';
    return ''; // Default 3:4 portrait
}

function createCartItemHTML(item) {
    const imagePath = getCartItemImagePath(item, getCurrentTheme());
    const subtotal = getItemSubtotal(item);
    const aspectClass = getCartItemAspectClass(item);

    // Build option description line
    let optionDesc = item.optionLabel;
    if (item.subOptionLabel) {
        optionDesc += ` · ${item.subOptionLabel}`;
    }
    if (item.sizeNote) {
        optionDesc += ` (${item.sizeNote})`;
    }
    if (item.frameColorLabel) {
        optionDesc += ` · ${item.frameColorLabel}`;
    }

    return `
        <li class="cart-item" data-cart-item-id="${item.id}">
            <div class="cart-item__image ${aspectClass}" data-cart-item-id="${item.id}" style="background-image: url('${imagePath}');" aria-hidden="true"></div>
            <div class="cart-item__details">
                <h3 class="cart-item__title">${item.title}</h3>
                <p class="cart-item__options">
                    ${optionDesc}
                </p>
                <p class="cart-item__price">
                    ${formatPrice(item.price)} each
                </p>
            </div>
            <div class="cart-item__actions">
                <div class="cart-item__quantity">
                    <button class="cart-item__quantity-btn" data-action="decrease" data-item-id="${item.id}" aria-label="Decrease quantity">−</button>
                    <span class="cart-item__quantity-value">${item.quantity}</span>
                    <button class="cart-item__quantity-btn" data-action="increase" data-item-id="${item.id}" aria-label="Increase quantity">+</button>
                </div>
                <button class="cart-item__remove" data-item-id="${item.id}">Remove</button>
                <span class="cart-item__subtotal">${formatPrice(subtotal)}</span>
            </div>
        </li>
    `;
}

/**
 * Render cart summary
 */
/**
 * Build a mailto link with cart details pre-filled
 */
function buildOrderMailto() {
    const cart = getCart();
    const total = getCartTotal();

    const lines = cart.map(item => {
        let desc = `• ${item.title} — ${item.optionLabel}`;
        if (item.subOptionLabel) desc += `, ${item.subOptionLabel}`;
        if (item.sizeNote) desc += ` (${item.sizeNote})`;
        if (item.frameColorLabel) desc += `, ${item.frameColorLabel}`;
        desc += ` × ${item.quantity} — ${formatPrice(item.price * item.quantity)}`;
        return desc;
    });

    const subject = encodeURIComponent(`Side Hustle Order — ${cart.length} item${cart.length > 1 ? 's' : ''}`);
    const body = encodeURIComponent(
        `Hi! I'd like to place an order for the following:\n\n` +
        lines.join('\n') +
        `\n\nSubtotal: ${formatPrice(total)}\n\n` +
        `Please let me know how to arrange payment. Thanks!`
    );

    return `mailto:sidehustle.purchases@gmail.com?subject=${subject}&body=${body}`;
}

function renderCartSummary() {
    if (!cartSummaryContainer) return;

    const cart = getCart();
    const itemCount = getCartCount();
    const total = getCartTotal();
    const mailto = buildOrderMailto();

    cartSummaryContainer.innerHTML = `
        <div class="cart-summary__row">
            <span class="cart-summary__label">Items (${itemCount})</span>
            <span class="cart-summary__value">${formatPrice(total)}</span>
        </div>
        <div class="cart-summary__row">
            <span class="cart-summary__label">Shipping &amp; Tax</span>
            <span class="cart-summary__value cart-summary__value--accent"><strong>Calculated at checkout</strong></span>
        </div>
        <div class="cart-summary__row cart-summary__row--total">
            <span class="cart-summary__label">Subtotal</span>
            <span class="cart-summary__value">${formatPrice(total)}</span>
        </div>

        <div class="cart-payment-notice">
            <p class="cart-payment-notice__heading">Online payments coming soon</p>
            <p class="cart-payment-notice__text">We're still getting payment processing set up on the site.</p>
            <p class="cart-payment-notice__text">Click below to email us — your order details will be included automatically. We can arrange payment through PayPal, Venmo, or Zelle.</p>
            <a href="${mailto}" class="btn-accent button cart-payment-notice__btn">Email Your Order</a>
        </div>
    `;
}

/**
 * Handle quantity change button click
 * @param {Event} e - Click event
 */
function handleQuantityChange(e) {
    const btn = e.currentTarget;
    const itemId = btn.dataset.itemId;
    const action = btn.dataset.action;

    const cart = getCart();
    const item = cart.find(i => i.id === itemId);

    if (!item) return;

    const newQuantity = action === 'increase' ? item.quantity + 1 : item.quantity - 1;

    if (newQuantity < 1) {
        removeItem(itemId);
    } else {
        updateQuantity(itemId, newQuantity);
    }
}

/**
 * Handle remove item button click
 * @param {Event} e - Click event
 */
function handleRemoveItem(e) {
    const itemId = e.currentTarget.dataset.itemId;
    removeItem(itemId);
}

/**
 * Get cart data for PayPal order
 * @returns {Object} Order data for PayPal
 */
export function getPayPalOrderData() {
    const cart = getCart();
    const total = getCartTotal();

    return {
        purchase_units: [{
            amount: {
                currency_code: 'USD',
                value: (total / 100).toFixed(2),
                breakdown: {
                    item_total: {
                        currency_code: 'USD',
                        value: (total / 100).toFixed(2)
                    }
                }
            },
            items: cart.map(item => {
                let desc = item.optionLabel;
                if (item.subOptionLabel) desc += ` - ${item.subOptionLabel}`;
                if (item.sizeNote) desc += ` (${item.sizeNote})`;
                if (item.frameColorLabel) desc += ` - ${item.frameColorLabel}`;
                return {
                    name: item.title,
                    description: desc,
                    unit_amount: {
                        currency_code: 'USD',
                        value: (item.price / 100).toFixed(2)
                    },
                    quantity: item.quantity.toString()
                };
            })
        }]
    };
}

// Initialize when DOM is ready
if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
}
