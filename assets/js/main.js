/* ==========================================
   Main JavaScript
   [CUSTOMIZE] Add your custom scripts here
   ========================================== */

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('Site initialized');

    // Smooth scroll for anchor links
    initSmoothScroll();

    // Add any custom initialization here
    // Example: initYourFeature();
});

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            // Skip if href is just "#"
            if (href === '#') return;

            e.preventDefault();

            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * [CUSTOMIZE] Add your custom functions below
 * Example:
 *
 * function initYourFeature() {
 *     // Your code here
 * }
 */
