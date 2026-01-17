/**
 * Hero Gallery Module
 * Populates the home page hero gallery with the latest gallery items
 */

import { galleryItems, getMainImagePath } from './gallery-data.js';

// Configuration
const HERO_GALLERY_COUNT = 6;

/**
 * Get the most recent gallery items sorted by date
 * @param {number} count - Number of items to return
 * @returns {Array} Array of gallery items
 */
function getRecentItems(count = HERO_GALLERY_COUNT) {
    return [...galleryItems]
        .sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated))
        .slice(0, count);
}

/**
 * Create a gallery frame element
 * @param {Object} item - Gallery item
 * @returns {HTMLElement} The gallery frame element
 */
function createGalleryFrame(item) {
    const link = document.createElement('a');
    link.href = `product/${item.slug}.html`;
    link.className = 'gallery-frame';
    link.setAttribute('aria-label', `View ${item.title}`);
    link.dataset.slug = item.slug;

    // Set background image using the main image
    const imagePath = getMainImagePath(item.slug);
    link.style.backgroundImage = `url('${imagePath}')`;
    link.style.backgroundSize = 'cover';
    link.style.backgroundPosition = 'center';

    return link;
}

/**
 * Initialize the hero gallery
 * Replaces static gallery frames with dynamic ones from gallery data
 */
export function initHeroGallery() {
    const scrollTrack = document.querySelector('.hero-scroll-track');
    if (!scrollTrack) return;

    // Find existing gallery frames
    const existingFrames = scrollTrack.querySelectorAll('.gallery-frame');
    if (existingFrames.length === 0) return;

    // Get recent items
    const recentItems = getRecentItems();

    // Replace existing frames with dynamic ones
    existingFrames.forEach((frame, index) => {
        if (index < recentItems.length) {
            const item = recentItems[index];
            const newFrame = createGalleryFrame(item);
            frame.replaceWith(newFrame);
        }
    });

    console.log(`Hero gallery populated with ${recentItems.length} items`);
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initHeroGallery);
