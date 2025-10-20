/**
 * Secondary Pages Navigation
 *
 * Simple navigation for pages WITHOUT gallery (style-guide, etc.)
 * No gallery logic - just basic smooth scrolling and page transitions
 *
 * Dependencies: None
 * Used on: style-guide.html and other non-index pages
 */

// ==========================================
// Simple Smooth Scrolling (No Gallery Logic)
// ==========================================

function initSmoothScrolling() {
    // Handle same-page anchor links (e.g., style-guide internal sections)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // If it's just # (home link), scroll to top
            if (href === '#') {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });

                // Update URL hash
                history.pushState(null, null, ' ');

                // Update active state
                setTimeout(() => {
                    updateNavigationActiveStates('#');
                }, 100);
                return;
            }

            // For section links on same page
            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                e.preventDefault();
                const targetPosition = targetSection.offsetTop - 76;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update URL hash
                history.pushState(null, null, href);

                // Update active state after scroll completes
                setTimeout(() => {
                    updateNavigationActiveStates(href);
                }, 500);

                // Close mobile menu if open
                const mobileMenu = document.getElementById('mobileMenuOverlay');
                const mobileToggle = document.querySelector('.nav-mobile-toggle');
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    if (mobileToggle) {
                        mobileToggle.classList.remove('menu-active');
                    }
                    document.body.classList.remove('mobile-menu-open');
                }
            }
        });
    });

    // External links (index.html, etc.) work naturally - no preventDefault
}

// ==========================================
// Navigation Active States
// ==========================================

function updateNavigationActiveStates(targetHash) {
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');

    // Remove active from all section links
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    // Add active to target links
    if (targetHash === '#' || targetHash === '') {
        const homeLinks = document.querySelectorAll('a[href="#"]');
        homeLinks.forEach(link => {
            link.classList.add('active');
        });
    } else {
        const targetLinks = document.querySelectorAll(`a[href="${targetHash}"]`);
        targetLinks.forEach(link => {
            link.classList.add('active');
        });
    }
}

function initNavigationActiveState() {
    // Only run on pages with sections
    const sections = document.querySelectorAll('section[id]');

    if (sections.length === 0) {
        return;
    }

    const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');

    function updateActiveNavigation() {
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= (sectionTop - 150)) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                link.classList.remove('active');
            }
        });

        if (window.scrollY <= 50) {
            const homeLinks = document.querySelectorAll('a[href="#"]');
            homeLinks.forEach(link => {
                link.classList.add('active');
            });
        } else if (currentSection) {
            const currentLinks = document.querySelectorAll(`a[href="#${currentSection}"]`);
            currentLinks.forEach(link => {
                link.classList.add('active');
            });
        }
    }

    window.addEventListener('scroll', updateActiveNavigation);
    updateActiveNavigation();
}

// ==========================================
// Back-to-Top Button
// ==========================================

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function toggleBackToTop() {
    const backToTopButton = document.querySelector('.back-to-top');
    const scrollPosition = window.scrollY;

    if (backToTopButton) {
        if (scrollPosition > 200) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    }
}

function initBackToTop() {
    window.addEventListener('scroll', toggleBackToTop);
    toggleBackToTop();
}
