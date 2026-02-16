/**
 * Cart Icon Component
 * Renders cart icon with badge in the navigation header
 */

import { getCartCount, CART_EVENTS } from './cart.js';

// SVG icon for shopping bag
const CART_SVG = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M3 6H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

/**
 * Create the cart icon element
 * @param {Object} options - Configuration options
 * @param {string} [options.href='/cart.html'] - Link to cart page
 * @returns {HTMLElement} The cart icon element
 */
export function createCartIcon(options = {}) {
    const { href = 'cart.html' } = options;
    const count = getCartCount();

    const link = document.createElement('a');
    link.href = href;
    link.className = 'cart-icon';
    link.setAttribute('aria-label', `Shopping cart${count > 0 ? ` (${count} items)` : ''}`);

    link.innerHTML = `
        ${CART_SVG}
        <span class="cart-icon__badge" data-count="${count}">${count > 0 ? count : ''}</span>
    `;

    return link;
}

/**
 * Update all cart icons on the page with current count
 */
export function updateCartIcons() {
    const count = getCartCount();
    const badges = document.querySelectorAll('.cart-icon__badge');
    const icons = document.querySelectorAll('.cart-icon');

    badges.forEach(badge => {
        badge.textContent = count > 0 ? count : '';
        badge.dataset.count = count;
    });

    icons.forEach(icon => {
        icon.setAttribute('aria-label', `Shopping cart${count > 0 ? ` (${count} items)` : ''}`);
    });
}

/**
 * Initialize cart icon in a container
 * @param {string|HTMLElement} container - Container selector or element
 * @param {Object} options - Configuration options
 */
export function initCartIcon(container, options = {}) {
    const containerEl = typeof container === 'string'
        ? document.querySelector(container)
        : container;

    if (!containerEl) {
        console.warn('Cart icon container not found:', container);
        return;
    }

    // Check if cart icon already exists in container
    if (containerEl.querySelector('.cart-icon')) {
        return;
    }

    const cartIcon = createCartIcon(options);
    containerEl.appendChild(cartIcon);
}

/**
 * Initialize cart icon event listeners
 */
export function initCartIconListeners() {
    // Listen for cart updates
    window.addEventListener(CART_EVENTS.UPDATED, updateCartIcons);
    window.addEventListener(CART_EVENTS.CLEARED, updateCartIcons);

    // Initial update
    updateCartIcons();
}

// Auto-initialize listeners when module is loaded
if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCartIconListeners);
    } else {
        initCartIconListeners();
    }
}
