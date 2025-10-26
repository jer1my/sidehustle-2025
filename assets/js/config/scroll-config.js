/**
 * Hero Scroll Configuration
 * Centralized configuration for scroll-driven hero gallery animations
 *
 * Adjust these values to tweak the scroll behavior across both art and digital pages
 */

const HERO_SCROLL_CONFIG = {
    // ===== SCROLL SPEED & SENSITIVITY =====

    /**
     * Container height multiplier (higher = slower scroll)
     * Default: 1100 (1100vh = moderate speed)
     * Range: 300-3000 (300vh = fast, 3000vh = very slow)
     *
     * Example values:
     * - 300: Fast scroll (like old implementation)
     * - 1000: Moderate speed
     * - 1100: Current speed (default)
     * - 1500: Slower, more deliberate
     * - 2000: Very slow scroll
     *
     * NOTE: This controls SPEED only. Use scrollDistanceMultiplier to control
     * how much content is visible at the end of the scroll.
     */
    scrollHeightMultiplier: 1100,

    /**
     * Horizontal scroll distance multiplier (higher = scroll further)
     * Default: 1.2 (scroll 20% further than content width)
     * Range: 0.8-1.5 (0.8 = see less content, 1.5 = scroll way past content)
     *
     * This controls HOW FAR the gallery scrolls horizontally, independent of speed.
     * Increase this value if you're not seeing all gallery frames at the end.
     *
     * Example values:
     * - 1.0: Exact content width (may cut off last frame due to padding)
     * - 1.1: Scroll 10% further (slight buffer)
     * - 1.2: Scroll 20% further (recommended - shows all frames)
     * - 1.3: Scroll 30% further (extra space at end)
     */
    scrollDistanceMultiplier: 1.2,

    /**
     * Scroll transition easing for smooth animation
     * Default: 0.1s ease-out
     */
    scrollTransitionDuration: 0.1, // seconds
    scrollTransitionEasing: 'ease-out',


    // ===== SCROLL ARROW BEHAVIOR =====

    /**
     * Duration for scroll arrow smooth scroll to products section
     * Default: 2000ms (2 seconds)
     */
    scrollArrowDuration: 2000, // milliseconds

    /**
     * Offset from top when scrolling to products section
     * Default: 48px (accounts for navigation)
     */
    scrollArrowOffset: 48, // pixels


    // ===== GALLERY FRAME SPACING =====

    /**
     * Gap between gallery frames on desktop
     * Default: 40px
     */
    frameGapDesktop: 40, // pixels

    /**
     * Gap between gallery frames on mobile
     * Default: 24px
     */
    frameGapMobile: 24, // pixels


    // ===== GALLERY FRAME SIZES =====

    /**
     * Gallery frame height on desktop (as percentage of viewport height)
     * Default: 55 (55vh)
     */
    frameHeightDesktop: 55, // vh units

    /**
     * Gallery frame height on mobile (as percentage of viewport height)
     * Default: 50 (50vh)
     */
    frameHeightMobile: 50, // vh units

    /**
     * Gallery frame aspect ratio (width = height * ratio)
     * Default: 0.75 (3:4 portrait ratio)
     */
    frameAspectRatio: 0.75, // 3:4 portrait


    // ===== SCROLL TRACK PADDING =====

    /**
     * Padding on the sides of the scroll track
     * These values control how much whitespace is on each side
     * and how much of the gallery "peeks" into view
     *
     * Art page (left scroll): uses leftPadding on left, rightPadding on right
     * Digital page (right scroll): uses rightPadding on left, leftPadding on right
     */
    padding: {
        desktop: {
            left: 10,  // vw units (left side padding)
            right: 15  // vw units (right side padding - more to ensure gallery peek)
        },
        mobile: {
            left: 5,   // vw units
            right: 15  // vw units
        }
    },


    // ===== MOBILE ADJUSTMENTS =====

    /**
     * Vertical offset to account for mobile browser menu bars
     * Default: -36px (shifts content up)
     */
    mobileVerticalOffset: -36, // pixels

    /**
     * Mobile breakpoint (max-width)
     * Default: 768px
     */
    mobileBreakpoint: 768 // pixels
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HERO_SCROLL_CONFIG;
}
