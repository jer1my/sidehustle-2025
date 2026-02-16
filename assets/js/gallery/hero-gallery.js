/**
 * Hero Gallery Module
 * Populates the home page hero gallery with the latest gallery items
 * Uses the shared product card component with gallery-frame sizing
 */

import { galleryItems } from './gallery-data.js';
import { createProductCard } from './product-card.js';

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
 * Initialize the hero gallery
 * Replaces static gallery frames with dynamic product cards
 */
export function initHeroGallery() {
    const scrollTrack = document.querySelector('.hero-scroll-track');
    if (!scrollTrack) return;

    // Find existing gallery frames
    const existingFrames = scrollTrack.querySelectorAll('.gallery-frame');
    if (existingFrames.length === 0) return;

    // Get recent items
    const recentItems = getRecentItems();

    // Replace existing frames with product cards
    existingFrames.forEach((frame, index) => {
        if (index < recentItems.length) {
            const item = recentItems[index];
            const card = createProductCard(item, {
                extraClass: 'gallery-frame'
            });
            frame.replaceWith(card);
        }
    });
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initHeroGallery);
