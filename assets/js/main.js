/**
 * Side Hustle - Main Initialization
 *
 * Art & Photography Portfolio by Jerimy Brown
 *
 * Module Architecture:
 * - core/: Core systems (data loading, theme, config)
 * - components/: Interactive components (carousels, navigation, menus)
 * - utils/: Utility functions (animations, image preloading, helpers)
 *
 * Load Order (see HTML):
 * 1. Core modules (config, data-loader, theme-system)
 * 2. Utilities (helpers, animations, image-preloader)
 * 3. Components (navigation, mobile-menu, logo-animation, carousel-base)
 * 4. This file (main.js) - initialization orchestration
 */

// ==========================================
// Cart Badge Update (works with localStorage cart)
// ==========================================

function updateCartBadges() {
    try {
        const cartData = localStorage.getItem('sidehustle_cart');
        const cart = cartData ? JSON.parse(cartData) : [];
        const count = cart.reduce((total, item) => total + (item.quantity || 1), 0);

        const badges = document.querySelectorAll('.cart-icon__badge');
        badges.forEach(badge => {
            badge.textContent = count > 0 ? count : '';
            badge.dataset.count = count;
        });
    } catch (e) {
        console.warn('Could not update cart badges:', e);
    }
}

// Listen for cart updates from cart module
window.addEventListener('cart:updated', updateCartBadges);
window.addEventListener('cart:cleared', updateCartBadges);

// Also update when storage changes (for cross-tab sync)
window.addEventListener('storage', function(e) {
    if (e.key === 'sidehustle_cart') {
        updateCartBadges();
    }
});

// ==========================================
// Main Initialization Sequence
// ==========================================

document.addEventListener('DOMContentLoaded', async function() {
    // Core system initialization (with safety checks for pages with minimal scripts)
    if (typeof initTheme === 'function') initTheme();
    if (typeof initGridLines === 'function') initGridLines();
    if (typeof initLogoLetterAnimation === 'function') initLogoLetterAnimation();

    // Update cart badge with current count
    updateCartBadges();

    // Dynamic content generation - must run BEFORE scroll animations
    if (typeof initAboutCarousel === 'function') {
        initAboutCarousel(); // Generate about carousel cards from JSON
    }
    if (typeof initAboutCarouselIndicators === 'function') {
        initAboutCarouselIndicators(); // Generate about carousel indicators from JSON
    }
    if (typeof initHoverPreloading === 'function') {
        initHoverPreloading(); // Initialize hover intent image preloading
    }

    // Interactive features initialization (with safety checks)
    if (typeof initScrollAnimations === 'function') initScrollAnimations();
    if (typeof initSmoothScrolling === 'function') initSmoothScrolling();
    if (typeof initBackToTop === 'function') initBackToTop();
    if (typeof initMobileMenuClose === 'function') initMobileMenuClose();
    if (typeof initCarousel === 'function') initCarousel();
    if (typeof initLogoColorChange === 'function') initLogoColorChange();
    if (typeof initNavigationActiveState === 'function') initNavigationActiveState();
    if (typeof initPageTransitions === 'function') initPageTransitions();

    // Initialize particle system (only on index page with hero section)
    if (typeof initParticleSystem === 'function') {
        initParticleSystem();
    }

    // Handle hash navigation after everything is loaded and rendered
    // With scroll-driven animation, this works naturally on all pages
    if (window.location.hash) {
        setTimeout(() => {
            const target = document.querySelector(window.location.hash);
            if (target) {
                target.scrollIntoView({ behavior: 'instant', block: 'start' });
            }
        }, 300); // Delay ensures all content above is laid out
    }
});
