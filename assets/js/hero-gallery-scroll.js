/**
 * Hero Gallery Scroll-Driven Animation
 * Uses native browser scroll to drive horizontal gallery movement
 */

(function() {
    const scrollContainer = document.querySelector('.hero-scroll-container');
    const hero = document.querySelector('.hero');
    const scrollTrack = document.querySelector('.hero-scroll-track');

    if (!scrollContainer || !hero || !scrollTrack) {
        console.log('Hero scroll elements not found:', { scrollContainer, hero, scrollTrack });
        return;
    }

    console.log('Hero gallery scroll-driven animation initialized');

    // Calculate how far we need to scroll the track horizontally
    function getTrackScrollWidth() {
        const trackWidth = scrollTrack.scrollWidth;
        const containerWidth = scrollTrack.parentElement.offsetWidth;
        return trackWidth - containerWidth;
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
        const maxScroll = getTrackScrollWidth();
        const translateX = -(progress * maxScroll);
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
})();
