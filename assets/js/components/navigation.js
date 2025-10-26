/**
 * Navigation & Scrolling System
 *
 * Main navigation, scrolling, active states
 * Simplified for scroll-driven animation (no gallery state management)
 *
 * Dependencies: None
 * Exports: Navigation and scrolling functions
 */

// ==========================================

// Smooth scroll to sections with hash navigation
function initSmoothScrolling() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Handle all anchor links (both # and .html# formats)
    document.querySelectorAll('a[href^="#"], a[href*=".html#"]').forEach(anchor => {
        // Remove any existing handler to prevent duplicates
        if (anchor._navigationScrollHandler) {
            anchor.removeEventListener('click', anchor._navigationScrollHandler);
        }

        anchor._navigationScrollHandler = function (e) {
            const href = this.getAttribute('href');

            // Extract page and hash
            let targetPage = currentPage;
            let hash = href;

            if (href.includes('#')) {
                const parts = href.split('#');
                if (parts[0]) {
                    targetPage = parts[0].split('/').pop();
                }
                hash = '#' + parts[1];
            }

            // Only handle if it's a same-page link
            if (targetPage !== currentPage) {
                return; // Let browser handle navigation to other pages
            }

            // If it's just # (home link), scroll to top
            if (hash === '#' || hash === '#') {
                e.preventDefault();

                // Use custom smooth scroll for controlled speed (2000ms)
                if (typeof smoothScrollTo === 'function') {
                    smoothScrollTo(0, 2000);
                } else {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }

                // Update URL hash
                history.pushState(null, null, ' ');

                // Update active state (longer timeout for 2s scroll)
                setTimeout(() => {
                    updateNavigationActiveStates(hash, href);
                }, 2100);
                return;
            }

            // For section links
            const targetSection = document.getElementById(hash.substring(1));

            if (targetSection) {
                e.preventDefault();

                const targetPosition = targetSection.offsetTop - 48;

                // Use custom smooth scroll for controlled speed (2000ms)
                if (typeof smoothScrollTo === 'function') {
                    smoothScrollTo(targetPosition, 2000);
                } else {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }

                // Update URL hash
                history.pushState(null, null, hash);

                // Update active state after scroll completes (longer timeout for 2s scroll)
                setTimeout(() => {
                    updateNavigationActiveStates(hash, href);
                }, 2100);

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
        };

        anchor.addEventListener('click', anchor._navigationScrollHandler);
    });
}

// Re-initialize when navigation is dynamically loaded
window.addEventListener('navigationLoaded', function() {
    initSmoothScrolling();
});

function scrollToProjects() {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
        projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function scrollToProducts() {
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });

        // Update active state after scroll completes
        setTimeout(() => {
            updateNavigationActiveStates('#products');
        }, 500);
    }
}

function scrollToAbout() {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth' });

        // Update active state after scroll completes
        setTimeout(() => {
            updateNavigationActiveStates('#about');
        }, 500);
    }
}

function scrollToContact() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });

        // Update active state after scroll completes
        setTimeout(() => {
            updateNavigationActiveStates('#contact');
        }, 500);
    }
}

function scrollToTop() {
    // Use custom smooth scroll for controlled speed (2000ms)
    if (typeof smoothScrollTo === 'function') {
        smoothScrollTo(0, 2000);
    } else {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

function toggleBackToTop() {
    const backToTopButton = document.querySelector('.back-to-top');
    const backToProjectsButton = document.querySelector('.back-to-projects');
    const heroSection = document.querySelector('.hero');
    const scrollPosition = window.scrollY;

    if (backToTopButton) {
        // Different logic for index page (with hero) vs style guide/project pages
        if (heroSection) {
            // Index page: show after 20% of hero height
            const heroHeight = heroSection.offsetHeight;
            const heroTwentyPercent = heroSection.offsetTop + (heroHeight * 0.2);

            if (scrollPosition > heroTwentyPercent) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        } else {
            // Project pages and style guide: show after 200px scroll
            if (scrollPosition > 200) {
                backToTopButton.classList.add('visible');
                // Also show back-to-projects button on project pages (not style guide)
                if (backToProjectsButton) {
                    backToProjectsButton.classList.add('visible');
                }
            } else {
                backToTopButton.classList.remove('visible');
                if (backToProjectsButton) {
                    backToProjectsButton.classList.remove('visible');
                }
            }
        }
    }
}


// Helper function to update active states manually
function updateNavigationActiveStates(targetHash, fullHref) {
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');

    // Remove active from all section links
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    // Add active to target links
    if (targetHash === '#' || targetHash === '') {
        // For home, activate links with href="#"
        const homeLinks = document.querySelectorAll('a[href="#"]');
        homeLinks.forEach(link => {
            link.classList.add('active');
        });
    } else {
        // For sections, activate matching links (both # and .html# formats)
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href) {
                // Check if it's a match (either exact match or ends with the target hash)
                if (href === targetHash || href === fullHref || href.endsWith(targetHash)) {
                    link.classList.add('active');
                }
            }
        });
    }
}

// Navigation Active State Management
function initNavigationActiveState() {
    // Only run on pages with sections (like index.html)
    const sections = document.querySelectorAll('section[id]');

    // If no sections found, don't run the active state management
    // This preserves manually set active classes on other pages
    if (sections.length === 0) {
        return;
    }

    const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');

    function updateActiveNavigation() {
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (window.scrollY >= (sectionTop - 150)) {
                currentSection = section.getAttribute('id');
            }
        });

        // Remove active class from all nav links
        navLinks.forEach(link => {
            link.classList.remove('active');
        });

        // Special handling for Home link when at top of page
        // Check if we're at the very top or in the hero section
        if (window.scrollY <= 50) {
            const homeLinks = document.querySelectorAll('a[href="#"]');
            homeLinks.forEach(link => {
                link.classList.add('active');
            });
        } else if (currentSection) {
            // Add active class to current section's links (both # and .html# formats)
            const targetHash = `#${currentSection}`;
            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href && (href === targetHash || href.endsWith(targetHash))) {
                    link.classList.add('active');
                }
            });
        }
    }

    // Update on scroll
    window.addEventListener('scroll', updateActiveNavigation);

    // Update on page load
    updateActiveNavigation();
}

// Project Page Contents Navigation Active State
function initProjectNavigationActiveState() {
    // Only run on project pages with contents navigation
    const projectNav = document.querySelector('.project-nav');
    if (!projectNav) {
        return;
    }

    const projectNavLinks = projectNav.querySelectorAll('a[href^="#"]');
    const contentSections = document.querySelectorAll('.content-section[id]');

    if (projectNavLinks.length === 0 || contentSections.length === 0) {
        return;
    }

    function updateProjectActiveNavigation() {
        let currentSection = '';

        // Find the current section based on scroll position
        contentSections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            // Account for the fixed navigation height (120px) plus some buffer
            if (window.scrollY >= (sectionTop - 150)) {
                currentSection = section.getAttribute('id');
            }
        });

        // Update active states
        projectNavLinks.forEach(link => {
            link.classList.remove('active');

            // Extract the hash from the href attribute
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const targetId = href.substring(1);
                if (targetId === currentSection) {
                    link.classList.add('active');
                }
            }
        });
    }

    // Update on scroll
    window.addEventListener('scroll', updateProjectActiveNavigation);

    // Update on page load
    updateProjectActiveNavigation();
}


// Sticky Project Nav Detection
function initStickyProjectNav() {
    const projectNav = document.querySelector('.project-nav');
    const sidebar = document.querySelector('.content-sidebar');

    if (!projectNav || !sidebar) return;

    // Use scroll detection to determine when sidebar is sticky
    function checkStickyState() {
        const sidebarRect = sidebar.getBoundingClientRect();
        const stickyTop = 120; // Same as CSS sticky top value

        // If sidebar top is at or above the sticky position, it's stuck
        if (sidebarRect.top <= stickyTop) {
            projectNav.classList.add('is-sticky');
        } else {
            projectNav.classList.remove('is-sticky');
        }
    }

    // Check on scroll
    window.addEventListener('scroll', checkStickyState);

    // Check on load
    checkStickyState();
}

// Initialize Back-to-Top Button Visibility
function initBackToTop() {
    // Listen for scroll events to show/hide back-to-top buttons
    window.addEventListener('scroll', toggleBackToTop);

    // Initial check
    toggleBackToTop();
}
