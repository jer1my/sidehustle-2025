/**
 * Hero Gallery Scroll-Driven Animation
 * Uses native browser scroll to drive horizontal gallery movement
 * Supports both left-to-right (art) and right-to-left (digital) scroll directions
 *
 * Configuration: assets/js/config/scroll-config.js
 */

(function() {
    const scrollContainer = document.querySelector('.hero-scroll-container');
    const hero = document.querySelector('.hero');
    const scrollTrack = document.querySelector('.hero-scroll-track');

    if (!scrollContainer || !hero || !scrollTrack) {
        console.log('Hero scroll elements not found:', { scrollContainer, hero, scrollTrack });
        return;
    }

    // Get scroll direction from data attribute (instead of pathname detection)
    const scrollDirection = scrollTrack.getAttribute('data-scroll-direction') || 'left';
    const isRightScroll = scrollDirection === 'right';

    console.log('Hero gallery scroll-driven animation initialized', { scrollDirection, isRightScroll });

    // Horizontal scroll speed is controlled by container height in CSS (--hero-scroll-height)
    // Horizontal scroll distance is controlled by distance multiplier (--hero-scroll-distance-multiplier)
    // See: assets/css/_variables.css and assets/js/config/scroll-config.js

    // Get distance multiplier from CSS variable
    function getDistanceMultiplier() {
        const computedStyle = getComputedStyle(document.documentElement);
        const multiplier = parseFloat(computedStyle.getPropertyValue('--hero-scroll-distance-multiplier')) || 1.0;
        return multiplier;
    }

    // Calculate base scroll width (without multiplier)
    function getBaseScrollWidth() {
        const trackWidth = scrollTrack.scrollWidth;
        const containerWidth = scrollTrack.parentElement.offsetWidth;
        return trackWidth - containerWidth;
    }

    // Calculate how far we need to scroll the track horizontally (with multiplier)
    function getTrackScrollWidth() {
        const baseScroll = getBaseScrollWidth();
        const multiplier = getDistanceMultiplier();
        return baseScroll * multiplier;
    }

    // Update gallery position based on scroll position
    function updateGalleryPosition() {
        const scrollContainerTop = scrollContainer.offsetTop;
        const scrollContainerHeight = scrollContainer.offsetHeight;
        const currentScroll = window.scrollY;

        // Calculate progress through the scroll container (0 to 1)
        // Start when container reaches top of viewport
        // End when container exits viewport
        const scrollStart = scrollContainerTop;
        const scrollEnd = scrollContainerTop + scrollContainerHeight - window.innerHeight;
        const scrollDistance = scrollEnd - scrollStart;

        // Calculate progress (0 = start, 1 = end)
        const progress = Math.max(0, Math.min(1, (currentScroll - scrollStart) / scrollDistance));

        // Apply horizontal translation based on progress
        // Speed is controlled by container height (CSS variable: --hero-scroll-height)
        const baseScroll = getBaseScrollWidth();
        const maxScroll = getTrackScrollWidth();

        let translateX;
        if (isRightScroll) {
            // Digital page (row-reverse): Start showing content on right, scroll toward showing gallery on left
            // Use baseScroll (not maxScroll) for starting position to avoid over-scrolling content off-screen
            // progress 0 = -baseScroll (content visible on right), progress 1 = -baseScroll + maxScroll (gallery visible on left)
            translateX = -baseScroll + (progress * maxScroll);
        } else {
            // Art page: Start showing content on left (0), scroll toward -maxScroll
            // progress 0 = 0 (content visible on left), progress 1 = -maxScroll (gallery visible on right)
            translateX = -(progress * maxScroll);
        }

        scrollTrack.style.transform = `translateX(${translateX}px)`;
    }

    // Listen to scroll events with requestAnimationFrame for smooth performance
    let ticking = false;
    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateGalleryPosition();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', updateGalleryPosition); // Recalculate on resize

    // Update on page load and after images/fonts load
    updateGalleryPosition();
    window.addEventListener('load', updateGalleryPosition);

    // Handle scroll arrow - scroll to products section
    // Configuration: See HERO_SCROLL_CONFIG.scrollArrowDuration and scrollArrowOffset
    const scrollArrow = document.querySelector('.scroll-arrow');
    if (scrollArrow) {
        scrollArrow.addEventListener('click', function(e) {
            e.preventDefault();

            // Scroll to products section with custom smooth scroll
            const productsSection = document.querySelector('#products');
            if (productsSection) {
                // These values mirror the config in scroll-config.js
                const SCROLL_DURATION = 2000; // ms - adjust in scroll-config.js
                const SCROLL_OFFSET = 48;     // px - adjust in scroll-config.js

                const targetPosition = productsSection.offsetTop - SCROLL_OFFSET;

                // Use custom smooth scroll for controlled speed
                if (typeof smoothScrollTo === 'function') {
                    smoothScrollTo(targetPosition, SCROLL_DURATION);
                } else {
                    // Fallback to native smooth scroll
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    }
})();
