/**
 * Gallery Detail Module
 * Handles product detail page functionality
 */

import {
    galleryItems,
    categories,
    productDetails,
    printOptions,
    frameOptions,
    getItemBySlug,
    getProductDetail,
    formatPrice,
    getMainImagePath,
    getAltImagePaths
} from './gallery-data.js';

// Base path for images (relative to product/ directory)
const IMAGE_BASE_PATH = '../assets/images/gallery';

/**
 * Initialize the detail page
 * @param {string} slug - The product slug from the URL
 */
export function init(slug) {
    if (!slug) {
        console.error('No product slug provided');
        return;
    }

    const item = getItemBySlug(slug);
    if (!item) {
        console.error(`Product not found: ${slug}`);
        showNotFound();
        return;
    }

    const detail = getProductDetail(item.id);
    renderProductDetail(item, detail);
}

/**
 * Show not found message
 */
function showNotFound() {
    const container = document.getElementById('product-detail');
    if (container) {
        container.innerHTML = `
            <div class="product-not-found">
                <h2>Product Not Found</h2>
                <p>Sorry, we couldn't find the product you're looking for.</p>
                <a href="../shop-all.html" class="btn-accent button" style="margin-top: 24px;">
                    Return to Gallery
                </a>
            </div>
        `;
    }
}

/**
 * Render the full product detail
 * @param {Object} item - Gallery item
 * @param {Object} detail - Product detail (may be undefined)
 */
function renderProductDetail(item, detail) {
    const container = document.getElementById('product-detail');
    if (!container) return;

    // Get category display name
    const category = categories.find(c => c.id === item.type);
    const subCategory = category?.subCategories.find(s => s.id === item.subCategory);
    const categoryLabel = subCategory ? `${subCategory.name} ${category.name}` : item.subCategory;

    // Get description (use long description if available, else short)
    const description = detail?.longDescription || item.description || '';

    // Get image paths
    const mainImage = getMainImagePath(item.slug, IMAGE_BASE_PATH);
    const altImages = getAltImagePaths(item.slug, IMAGE_BASE_PATH);

    container.innerHTML = `
        <div class="product-detail-layout">
            <div class="product-images-column">
                <!-- Large main image -->
                <div class="product-image-main" data-src="${mainImage}"></div>

                <!-- Smaller sample images in 2-column grid -->
                <div class="product-thumbnails-grid">
                    ${altImages.map((src, i) => `<div class="product-thumbnail" data-src="${src}"></div>`).join('')}
                </div>
            </div>

            <div class="product-info">
                <h1 class="product-title">${item.title}</h1>
                <p class="product-category">${categoryLabel}</p>

                ${description ? `<p class="product-description">${description}</p>` : ''}

                ${renderPrintOptions(detail)}
            </div>
        </div>
    `;
}

/**
 * Render print options section
 * @param {Object} detail - Product detail
 * @returns {string} HTML string
 */
function renderPrintOptions(detail) {
    // If no detail or no print options, show coming soon
    if (!detail || !detail.printOptions || detail.printOptions.length === 0) {
        return `
            <div class="print-options">
                <h3>Print Sizes & Pricing</h3>
                <div class="options-coming-soon">
                    <p>Print options coming soon</p>
                </div>
            </div>
        `;
    }

    // Get the actual print option objects
    const availableOptions = detail.printOptions
        .map(id => printOptions.find(opt => opt.id === id))
        .filter(Boolean);

    if (availableOptions.length === 0) {
        return `
            <div class="print-options">
                <h3>Print Sizes & Pricing</h3>
                <div class="options-coming-soon">
                    <p>Print options coming soon</p>
                </div>
            </div>
        `;
    }

    const rows = availableOptions.map(opt => `
        <tr>
            <td>${opt.sizeLabel}</td>
            <td class="${opt.available ? 'print-price' : 'print-unavailable'}">
                ${opt.available ? formatPrice(opt.price) : 'Unavailable'}
            </td>
        </tr>
    `).join('');

    return `
        <div class="print-options">
            <h3>Print Sizes & Pricing</h3>
            <table class="print-options-table">
                <thead>
                    <tr>
                        <th>Size</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        </div>
    `;
}

/**
 * Render frame options section
 * @param {Object} detail - Product detail
 * @returns {string} HTML string
 */
function renderFrameOptions(detail) {
    // If no detail or no frame options, don't show section
    if (!detail || !detail.frameOptions || detail.frameOptions.length === 0) {
        return '';
    }

    // Get the actual frame option objects
    const availableOptions = detail.frameOptions
        .map(id => frameOptions.find(opt => opt.id === id))
        .filter(Boolean);

    if (availableOptions.length === 0) {
        return '';
    }

    const cards = availableOptions.map(opt => `
        <div class="frame-option">
            <div class="frame-option-image"></div>
            <div class="frame-option-name">${opt.name}</div>
            <div class="frame-option-price">
                ${opt.priceModifier > 0 ? '+' + formatPrice(opt.priceModifier) : 'Included'}
            </div>
            <div class="frame-option-desc">${opt.description}</div>
        </div>
    `).join('');

    return `
        <div class="frame-options">
            <h3>Framing Options</h3>
            <div class="frame-options-grid">
                ${cards}
            </div>
        </div>
    `;
}

// Auto-initialize if product-detail element exists
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('product-detail');
    if (container) {
        // Get slug from data attribute or URL
        const slug = container.dataset.productSlug ||
                    window.location.pathname.split('/').pop().replace('.html', '');
        init(slug);
    }
});
