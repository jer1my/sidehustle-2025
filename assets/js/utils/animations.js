/**
 * Animation & Interaction Systems
 *
 * Scroll animations, observers, page transitions
 *
 * Dependencies: None
 * Exports: Animation and transition functions
 */

// Animation & Interaction Observers
// ==========================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe project cards (only on index page)
    document.querySelectorAll('.project-card').forEach(card => {
        observer.observe(card);
    });
}

function initSmoothScrolling() {
    // Get current page name
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"], a[href*=".html#"]').forEach(link => {
        // Skip scroll arrow - it has custom behavior
        if (link.classList.contains('scroll-arrow')) {
            return;
        }

        // Remove any existing smooth scroll listener to prevent duplicates
        link.removeEventListener('click', link._smoothScrollHandler);

        // Create and store the handler
        link._smoothScrollHandler = function(e) {
            const href = this.getAttribute('href');

            // Skip if href is just '#' or empty
            if (!href || href === '#') {
                return;
            }

            // Extract page and hash from href
            let targetPage = currentPage;
            let hash = href;

            if (href.includes('#')) {
                const parts = href.split('#');
                if (parts[0]) {
                    targetPage = parts[0].split('/').pop();
                }
                hash = '#' + parts[1];
            }

            // If link is to same page with hash, smooth scroll to section
            if (targetPage === currentPage && hash) {
                e.preventDefault();
                const target = document.querySelector(hash);
                if (target) {
                    const targetPosition = target.offsetTop - 48;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        };

        link.addEventListener('click', link._smoothScrollHandler);
    });
}

// Re-initialize smooth scrolling when navigation is dynamically loaded
window.addEventListener('navigationLoaded', function() {
    initSmoothScrolling();
});

// Custom Smooth Scroll Function
// ==========================================
// Provides slower, controlled scrolling with custom duration
// Used for down arrow to handle long 1500vh scroll distance

function smoothScrollTo(targetY, duration = 2000) {
    const startY = window.scrollY;
    const distance = targetY - startY;
    const startTime = performance.now();

    // Easing function: easeInOutCubic for smooth acceleration/deceleration
    function easeInOutCubic(t) {
        return t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function scroll(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easing = easeInOutCubic(progress);

        window.scrollTo(0, startY + distance * easing);

        if (progress < 1) {
            requestAnimationFrame(scroll);
        }
    }

    requestAnimationFrame(scroll);
}

// Page Transitions
// ==========================================

function initPageTransitions() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        return; // Skip transitions if user prefers reduced motion
    }

    // Fade in the page on load
    document.body.classList.add('page-transition-in');

    // Get all links that navigate to other HTML pages
    const pageLinks = document.querySelectorAll('a[href$=".html"], a[href*=".html#"], a[href*="/"][href*=".html"]');

    pageLinks.forEach(link => {
        // Skip external links
        const href = link.getAttribute('href');
        if (href.startsWith('http') || href.startsWith('//')) {
            return;
        }

        link.addEventListener('click', function(e) {
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';

            // Check if link is to same page (e.g., art.html#products when on art.html)
            let targetPage = currentPage;
            if (href.includes('#')) {
                const parts = href.split('#');
                if (parts[0]) {
                    targetPage = parts[0].split('/').pop();
                }
            } else if (href.includes('.html')) {
                targetPage = href.split('/').pop().split('?')[0];
            }

            // Skip page transition if navigating to same page with hash
            if (targetPage === currentPage && href.includes('#')) {
                return; // Let smooth scroll handler deal with it
            }

            e.preventDefault();

            const targetUrl = this.href;

            // Add fade out class
            document.body.classList.add('page-transition-out');

            // Check if mobile menu is open - use longer delay if it is
            const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
            const isMobileMenuOpen = mobileMenuOverlay && mobileMenuOverlay.classList.contains('active');
            const delay = isMobileMenuOpen ? 600 : 300; // Longer delay for mobile menu sequential fade

            // Navigate after transition completes
            setTimeout(() => {
                window.location.href = targetUrl;
            }, delay);
        });
    });
}

// ==========================================
