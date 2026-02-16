/**
 * Product Card Module
 * Shared component for creating product cards on home and shop pages.
 * Image-only card with hover overlay showing name, type, category, and CTA.
 */

import { getMainImagePath, categories } from './gallery-data.js';

/**
 * Get the display name for a category/subcategory
 * @param {Object} item - Gallery item
 * @returns {Object} Object with type and category display names
 */
function getCategoryInfo(item) {
    const category = categories.find(c => c.id === item.type);
    const subCategory = category?.subCategories.find(s => s.id === item.subCategory);

    return {
        typeName: category ? category.name : item.type,
        categoryName: subCategory ? subCategory.name : item.subCategory
    };
}

/**
 * Create a product card element
 * @param {Object} item - Gallery item from gallery-data.js
 * @param {Object} options - Card options
 * @param {string} [options.basePath='assets/images/gallery'] - Base path for images
 * @param {string} [options.extraClass=''] - Additional CSS class(es) to add
 * @returns {HTMLElement} The product card element
 */
export function createProductCard(item, options = {}) {
    const {
        basePath = 'assets/images/gallery',
        extraClass = ''
    } = options;

    const { typeName, categoryName } = getCategoryInfo(item);
    const imagePath = getMainImagePath(item.slug, basePath);

    // Create card as an <a> tag for the whole clickable area
    const card = document.createElement('a');
    card.href = `product/${item.slug}.html`;
    card.className = `product-card${extraClass ? ' ' + extraClass : ''}`;
    card.setAttribute('aria-label', `View ${item.title} - ${typeName}, ${categoryName}`);
    card.dataset.productId = item.id;
    card.dataset.slug = item.slug;

    card.innerHTML = `
        <div class="product-card__image" style="background-image: url('${imagePath}');"></div>
        <div class="product-card__overlay">
            <h3 class="product-card__title">${item.title}</h3>
            <p class="product-card__meta">${typeName} · ${categoryName}</p>
            <span class="product-card__cta">View Details</span>
        </div>
    `;

    return card;
}
