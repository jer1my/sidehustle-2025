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
    // Core system initialization
    initTheme();
    initGridLines();
    initLogoLetterAnimation();

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

    // Interactive features initialization
    initScrollAnimations(); // Scroll-triggered animations
    initSmoothScrolling(); // Smooth anchor scrolling with hash navigation
    initBackToTop(); // Show/hide back-to-top button on scroll
    initMobileMenuClose(); // Mobile menu toggle
    if (typeof initCarousel === 'function') {
        initCarousel(); // About carousel
    }
    initLogoColorChange(); // Logo accent color in hero
    initNavigationActiveState(); // Active nav states on scroll
    if (typeof initPageTransitions === 'function') {
        initPageTransitions(); // Page fade transitions
    }

    // Initialize particle system (only on index page with hero section)
    if (typeof initParticleSystem === 'function') {
        initParticleSystem();
    }

    // Handle hash navigation after everything is loaded and rendered
    if (window.location.hash) {
        // Wait for layout to fully settle
        setTimeout(() => {
            const target = document.querySelector(window.location.hash);
            if (target) {
                target.scrollIntoView({ behavior: 'instant', block: 'start' });
            }
        }, 300); // Longer delay ensures all content above is laid out
    }
});
