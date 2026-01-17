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
// Main Initialization Sequence
// ==========================================

document.addEventListener('DOMContentLoaded', async function() {
    // Core system initialization (with safety checks for pages with minimal scripts)
    if (typeof initTheme === 'function') initTheme();
    if (typeof initGridLines === 'function') initGridLines();
    if (typeof initLogoLetterAnimation === 'function') initLogoLetterAnimation();

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
