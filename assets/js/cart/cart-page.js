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
import { getMainImagePath } from '../gallery/gallery-data.js';

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
function createCartItemHTML(item) {
    const imagePath = getMainImagePath(item.slug);
    const subtotal = getItemSubtotal(item);

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
            <div class="cart-item__image" style="background-image: url('${imagePath}');" aria-hidden="true"></div>
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
function renderCartSummary() {
    if (!cartSummaryContainer) return;

    const cart = getCart();
    const itemCount = getCartCount();
    const total = getCartTotal();

    cartSummaryContainer.innerHTML = `
        <div class="cart-summary__row">
            <span class="cart-summary__label">Items (${itemCount})</span>
            <span class="cart-summary__value">${formatPrice(total)}</span>
        </div>
        <div class="cart-summary__row">
            <span class="cart-summary__label">Shipping</span>
            <span class="cart-summary__value">Calculated at checkout</span>
        </div>
        <div class="cart-summary__row cart-summary__row--total">
            <span class="cart-summary__label">Subtotal</span>
            <span class="cart-summary__value">${formatPrice(total)}</span>
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
