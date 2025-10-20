/**
 * Hero Gallery Horizontal Scroll
 * Converts vertical scroll into horizontal gallery scroll
 */

(function() {
    const hero = document.getElementById('hero');
    const scrollTrack = document.querySelector('.hero-scroll-track');

    if (!hero || !scrollTrack) {
        console.log('Hero scroll elements not found:', { hero, scrollTrack });
        return;
    }

    console.log('Hero gallery scroll initialized');

    let isGalleryActive = false;
    let galleryScrollProgress = 0;
    let accumulatedScroll = 0;
    const scrollDistance = window.innerHeight * 3; // Total scroll distance for gallery animation

    // Expose gallery progress to window for navigation.js
    window.galleryScrollProgress = galleryScrollProgress;

    // Calculate how far we need to scroll the track
    function getTrackScrollWidth() {
        const trackWidth = scrollTrack.scrollWidth;
        const containerWidth = scrollTrack.parentElement.offsetWidth;
        return trackWidth - containerWidth;
    }

    // Global function to reset gallery (called by navigation)
    window.resetGallery = function(callback, instant = false) {
        if (instant) {
            // Instant reset (for page load)
            scrollTrack.style.transform = `translateX(0)`;
            galleryScrollProgress = 0;
            accumulatedScroll = 0;
            isGalleryActive = false;
            window.galleryScrollProgress = 0;

            if (callback) {
                setTimeout(callback, 50);
            }
        } else if (galleryScrollProgress > 0) {
            // Animated reset
            const interval = setInterval(() => {
                accumulatedScroll -= 50;
                accumulatedScroll = Math.max(0, accumulatedScroll);
                galleryScrollProgress = Math.max(0, accumulatedScroll / scrollDistance);
                window.galleryScrollProgress = galleryScrollProgress;

                const maxScroll = getTrackScrollWidth();
                const translateX = -(galleryScrollProgress * maxScroll);
                scrollTrack.style.transform = `translateX(${translateX}px)`;

                if (galleryScrollProgress === 0) {
                    clearInterval(interval);
                    isGalleryActive = false;

                    if (callback) {
                        setTimeout(callback, 100);
                    }
                }
            }, 16);
        } else {
            // Already at start
            if (callback) {
                callback();
            }
        }
    };

    // Global function to set gallery to end (for cross-page navigation to sections)
    window.setGalleryToEnd = function(instant = true) {
        if (instant) {
            // Instant set to 100%
            accumulatedScroll = scrollDistance;
            galleryScrollProgress = 1;
            window.galleryScrollProgress = 1;

            const maxScroll = getTrackScrollWidth();
            const translateX = -maxScroll;
            scrollTrack.style.transform = `translateX(${translateX}px)`;
        }
    };

    // Global function to scroll gallery forward to a target section (called by navigation)
    window.scrollGalleryForward = function(targetSection) {
        if (!targetSection) {
            return;
        }

        // If gallery not at 100%, animate forward first
        if (galleryScrollProgress < 1) {
            const interval = setInterval(() => {
                accumulatedScroll += 50;
                galleryScrollProgress = Math.min(accumulatedScroll / scrollDistance, 1);
                window.galleryScrollProgress = galleryScrollProgress;

                const maxScroll = getTrackScrollWidth();
                const translateX = -(galleryScrollProgress * maxScroll);
                scrollTrack.style.transform = `translateX(${translateX}px)`;

                // Once gallery complete, scroll to target section
                if (galleryScrollProgress >= 1) {
                    clearInterval(interval);
                    isGalleryActive = false;

                    // Scroll to target section
                    setTimeout(() => {
                        targetSection.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                }
            }, 16); // ~60fps
        } else {
            // Gallery already at end, just scroll to section
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Handle wheel events to control gallery
    function handleWheel(e) {
        const heroRect = hero.getBoundingClientRect();
        const heroTop = heroRect.top;
        const heroBottom = heroRect.bottom;
        const isHeroInView = heroBottom > 0 && heroTop < window.innerHeight;
        const isHeroAtTop = heroTop >= -10 && heroTop <= 10; // Hero is at top of viewport

        // Deactivate if hero is completely out of view
        if (!isHeroInView) {
            isGalleryActive = false;
        }

        // Scrolling down - activate when hero reaches top
        if (e.deltaY > 0 && heroTop <= 0 && heroTop > -50 && isHeroInView && galleryScrollProgress < 1) {
            isGalleryActive = true;
            e.preventDefault();

            // Add scroll delta to accumulated scroll
            accumulatedScroll += e.deltaY;
            galleryScrollProgress = Math.min(accumulatedScroll / scrollDistance, 1);
            window.galleryScrollProgress = galleryScrollProgress; // Update global

            console.log('Gallery progress:', galleryScrollProgress.toFixed(2));

            // Move entire track from right to left
            const maxScroll = getTrackScrollWidth();
            const translateX = -(galleryScrollProgress * maxScroll);
            scrollTrack.style.transform = `translateX(${translateX}px)`;

            // Gallery complete, allow normal scrolling
            if (galleryScrollProgress >= 1) {
                isGalleryActive = false;
            }
        }
        // Scrolling up (reverse) - ONLY when hero is at top of page AND has progress
        else if (e.deltaY < 0 && isHeroAtTop && galleryScrollProgress > 0) {
            isGalleryActive = true;
            e.preventDefault();

            // Subtract from accumulated scroll
            accumulatedScroll += e.deltaY; // deltaY is negative, so this subtracts
            accumulatedScroll = Math.max(0, accumulatedScroll); // Don't go below 0
            galleryScrollProgress = Math.max(0, accumulatedScroll / scrollDistance);
            window.galleryScrollProgress = galleryScrollProgress; // Update global

            console.log('Gallery progress (reverse):', galleryScrollProgress.toFixed(2));

            // Move entire track back to the right
            const maxScroll = getTrackScrollWidth();
            const translateX = -(galleryScrollProgress * maxScroll);
            scrollTrack.style.transform = `translateX(${translateX}px)`;

            // At the beginning, allow normal scroll
            if (galleryScrollProgress === 0) {
                isGalleryActive = false;
            }
        }
    }

    // Handle keyboard events (arrow keys)
    function handleKeydown(e) {
        const heroRect = hero.getBoundingClientRect();
        const heroTop = heroRect.top;
        const heroBottom = heroRect.bottom;
        const isHeroInView = heroBottom > 0 && heroTop < window.innerHeight;
        const isHeroAtTop = heroTop >= -10 && heroTop <= 10;

        // Down arrow key
        if (e.key === 'ArrowDown') {
            // Activate gallery if hero is at top and gallery incomplete
            if (heroTop <= 0 && heroTop > -50 && isHeroInView && galleryScrollProgress < 1) {
                e.preventDefault();
                isGalleryActive = true;

                // Simulate wheel delta (about 100px per keypress)
                accumulatedScroll += 100;
                galleryScrollProgress = Math.min(accumulatedScroll / scrollDistance, 1);
                window.galleryScrollProgress = galleryScrollProgress; // Update global

                console.log('Gallery progress (arrow down):', galleryScrollProgress.toFixed(2));

                const maxScroll = getTrackScrollWidth();
                const translateX = -(galleryScrollProgress * maxScroll);
                scrollTrack.style.transform = `translateX(${translateX}px)`;

                if (galleryScrollProgress >= 1) {
                    isGalleryActive = false;
                }
            }
        }
        // Up arrow key
        else if (e.key === 'ArrowUp') {
            // Only reverse if at top of page with gallery progress
            if (isHeroAtTop && galleryScrollProgress > 0) {
                e.preventDefault();
                isGalleryActive = true;

                // Simulate reverse wheel delta
                accumulatedScroll -= 100;
                accumulatedScroll = Math.max(0, accumulatedScroll);
                galleryScrollProgress = Math.max(0, accumulatedScroll / scrollDistance);
                window.galleryScrollProgress = galleryScrollProgress; // Update global

                console.log('Gallery progress (arrow up):', galleryScrollProgress.toFixed(2));

                const maxScroll = getTrackScrollWidth();
                const translateX = -(galleryScrollProgress * maxScroll);
                scrollTrack.style.transform = `translateX(${translateX}px)`;

                if (galleryScrollProgress === 0) {
                    isGalleryActive = false;
                }
            }
        }
    }

    // Use wheel event with passive: false to allow preventDefault
    window.addEventListener('wheel', handleWheel, { passive: false });

    // Add keyboard event listener
    window.addEventListener('keydown', handleKeydown);

    // Handle scroll arrow button click
    const scrollArrowBtn = document.querySelector('.scroll-arrow');
    if (scrollArrowBtn) {
        scrollArrowBtn.addEventListener('click', function(e) {
            e.preventDefault();

            // Step 1: Position hero at top if needed
            const heroRect = hero.getBoundingClientRect();
            const heroTop = heroRect.top;

            // If not at top, scroll hero to top first
            if (heroTop > 10) {
                hero.scrollIntoView({ behavior: 'smooth' });
                // Wait for scroll to complete, then animate gallery
                setTimeout(() => {
                    animateGalleryForward();
                }, 600);
            } else {
                // Already at top, start gallery animation
                animateGalleryForward();
            }
        });
    }

    // Function to animate gallery forward and then scroll to products
    function animateGalleryForward() {
        if (galleryScrollProgress < 1) {
            // Animate through gallery smoothly
            const interval = setInterval(() => {
                accumulatedScroll += 50;
                galleryScrollProgress = Math.min(accumulatedScroll / scrollDistance, 1);
                window.galleryScrollProgress = galleryScrollProgress; // Update global

                const maxScroll = getTrackScrollWidth();
                const translateX = -(galleryScrollProgress * maxScroll);
                scrollTrack.style.transform = `translateX(${translateX}px)`;

                // Once gallery complete, immediately continue scrolling to products
                if (galleryScrollProgress >= 1) {
                    clearInterval(interval);
                    isGalleryActive = false;
                    // Immediately scroll to products for seamless transition
                    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
                }
            }, 16); // ~60fps
        } else {
            // Gallery already complete, just scroll to products
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Handle back to top button click
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            // Match home/logo behavior: scroll to hero first, then reverse gallery
            if (galleryScrollProgress > 0) {
                // Step 1: Scroll hero to top of viewport first (so gallery reverse is visible)
                hero.scrollIntoView({ behavior: 'smooth' });

                // Step 2: Wait for scroll, then reverse gallery
                setTimeout(() => {
                    // Animate backwards through gallery
                    const interval = setInterval(() => {
                        accumulatedScroll -= 50;
                        accumulatedScroll = Math.max(0, accumulatedScroll);
                        galleryScrollProgress = Math.max(0, accumulatedScroll / scrollDistance);
                        window.galleryScrollProgress = galleryScrollProgress; // Update global

                        const maxScroll = getTrackScrollWidth();
                        const translateX = -(galleryScrollProgress * maxScroll);
                        scrollTrack.style.transform = `translateX(${translateX}px)`;

                        // Once gallery reset, immediately continue scrolling to top
                        if (galleryScrollProgress === 0) {
                            clearInterval(interval);
                            isGalleryActive = false;
                            // Scroll to top for seamless transition
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                    }, 16); // ~60fps
                }, 600);
            } else {
                // Gallery already at start, just scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    // Handle scroll up to reset
    window.addEventListener('scroll', () => {
        const heroRect = hero.getBoundingClientRect();
        if (heroRect.top > 0) {
            // Reset when scrolled back up
            scrollTrack.style.transform = `translateX(0)`;
            galleryScrollProgress = 0;
            accumulatedScroll = 0;
            isGalleryActive = false;
            window.galleryScrollProgress = 0; // Update global
        }
    });

    // Detect gallery state based on scroll position on page load
    // Run AFTER browser's natural hash positioning
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', detectGalleryStateOnLoad);
    } else {
        // DOM already ready, run immediately
        detectGalleryStateOnLoad();
    }

    function detectGalleryStateOnLoad() {
        // Let browser handle hash navigation naturally
        // Then detect where we landed and set gallery accordingly

        const heroBottom = hero.offsetTop + hero.offsetHeight;
        const currentScroll = window.scrollY || window.pageYOffset;

        // If we've scrolled past the hero section, set gallery to end
        // This handles cross-page navigation to #products, #about, #contact
        if (currentScroll > heroBottom - 100) {
            // Instantly set gallery to 100% (hidden by page fade-in)
            window.setGalleryToEnd(true);
            console.log('Gallery set to end (scrolled past hero)');
        } else {
            // At top or hero visible - gallery stays at 0% (default)
            console.log('Gallery at start (hero visible)');
        }
    }
})();
