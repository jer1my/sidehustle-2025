/**
 * PayPal Checkout Integration
 * Handles PayPal Buttons SDK integration for client-side checkout
 */

import { getCart, getCartTotal, clearCart, formatPrice } from './cart.js';
import { getPayPalOrderData } from './cart-page.js';

// PayPal button container ID
const PAYPAL_CONTAINER_ID = 'paypal-button-container';

/**
 * Check if PayPal SDK is loaded
 * @returns {boolean} True if PayPal SDK is available
 */
function isPayPalLoaded() {
    return typeof paypal !== 'undefined' && paypal.Buttons;
}

/**
 * Initialize PayPal Buttons
 */
export function initPayPal() {
    const container = document.getElementById(PAYPAL_CONTAINER_ID);

    if (!container) {
        console.warn('PayPal button container not found');
        return;
    }

    // Check if PayPal SDK is loaded
    if (!isPayPalLoaded()) {
        container.innerHTML = `
            <div style="text-align: center; padding: 20px; color: var(--text-secondary);">
                <p>PayPal checkout is not available.</p>
                <p style="font-size: 12px; margin-top: 8px;">
                    To enable PayPal, add your PayPal Client ID to cart.html
                </p>
            </div>
        `;
        return;
    }

    // Check if cart is empty
    const cart = getCart();
    if (cart.length === 0) {
        return;
    }

    // Render PayPal buttons
    renderPayPalButtons(container);
}

/**
 * Render PayPal Buttons in container
 * @param {HTMLElement} container - The container element
 */
function renderPayPalButtons(container) {
    // Clear any existing buttons
    container.innerHTML = '';

    paypal.Buttons({
        // Set up the style
        style: {
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'paypal',
            height: 45
        },

        // Create the order
        createOrder: function(data, actions) {
            const orderData = getPayPalOrderData();

            // Validate cart is not empty
            if (!orderData.purchase_units[0].items.length) {
                throw new Error('Cart is empty');
            }

            return actions.order.create(orderData);
        },

        // Handle approved payment
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                handlePaymentSuccess(details);
            });
        },

        // Handle cancellation
        onCancel: function(data) {
            console.log('Payment cancelled by user');
            // Stay on cart page, user can try again
        },

        // Handle errors
        onError: function(err) {
            console.error('PayPal error:', err);
            showPaymentError('An error occurred during checkout. Please try again.');
        }

    }).render('#' + PAYPAL_CONTAINER_ID);
}

/**
 * Handle successful payment
 * @param {Object} details - PayPal order details
 */
function handlePaymentSuccess(details) {
    const orderId = details.id;
    const payerName = details.payer?.name?.given_name || 'Customer';

    // Clear the cart
    clearCart();

    // Redirect to success page with order info
    const successUrl = `checkout-success.html?order=${orderId}&name=${encodeURIComponent(payerName)}`;
    window.location.href = successUrl;
}

/**
 * Show payment error message
 * @param {string} message - Error message to display
 */
function showPaymentError(message) {
    const container = document.getElementById(PAYPAL_CONTAINER_ID);
    if (!container) return;

    // Show error above PayPal buttons
    const errorDiv = document.createElement('div');
    errorDiv.className = 'paypal-error';
    errorDiv.style.cssText = `
        background: #fef2f2;
        border: 1px solid #fecaca;
        color: #dc2626;
        padding: 12px 16px;
        border-radius: 8px;
        margin-bottom: 16px;
        font-size: 14px;
        text-align: center;
    `;
    errorDiv.textContent = message;

    // Remove any existing error
    const existingError = container.parentNode.querySelector('.paypal-error');
    if (existingError) {
        existingError.remove();
    }

    container.parentNode.insertBefore(errorDiv, container);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

/**
 * Re-render PayPal buttons (call when cart changes)
 */
export function refreshPayPalButtons() {
    const container = document.getElementById(PAYPAL_CONTAINER_ID);
    if (!container || !isPayPalLoaded()) return;

    const cart = getCart();
    if (cart.length === 0) {
        container.innerHTML = '';
        return;
    }

    renderPayPalButtons(container);
}

// Initialize when DOM is ready
if (typeof window !== 'undefined') {
    // Wait for both DOM and PayPal SDK to be ready
    function tryInit() {
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            // Give PayPal SDK a moment to initialize
            setTimeout(initPayPal, 100);
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(initPayPal, 100);
            });
        }
    }

    tryInit();
}
