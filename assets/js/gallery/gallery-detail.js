/**
 * Gallery Detail Module
 * Handles product detail page functionality
 */

import {
    categories,
    purchaseOptions,
    frameNote,
    getItemBySlug,
    getLongDescription,
    formatPrice,
    getMainImagePath,
    getAltImagePaths
} from './gallery-data.js';

import { addItem } from '../cart/cart.js';

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

    renderProductDetail(item);
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
 */
function renderProductDetail(item) {
    const container = document.getElementById('product-detail');
    if (!container) return;

    // Get category display name
    const category = categories.find(c => c.id === item.type);
    const subCategory = category?.subCategories.find(s => s.id === item.subCategory);
    const categoryLabel = subCategory ? `${subCategory.name} ${category.name}` : item.subCategory;

    // Get description
    const description = getLongDescription(item.id) || item.description || '';

    // Get image paths
    const mainImage = getMainImagePath(item.slug, IMAGE_BASE_PATH);
    const altImages = getAltImagePaths(item.slug, IMAGE_BASE_PATH);

    // Overlay info for detail images
    const overlayLabels = [
        { label: 'Square', meta: 'Digital · Print · Framed 13×13' },
        { label: 'Portrait', meta: 'Digital · Print · Framed 13×19' },
        { label: 'Landscape', meta: 'Digital · Print · Framed 19×13' },
        { label: 'Framed Square', meta: '13×13 · Made in USA · 99% UV' },
        { label: 'Framed Portrait', meta: '13×19 · Made in USA · 99% UV' }
    ];

    container.innerHTML = `
        <div class="product-detail-layout">
            <div class="product-images-column">
                <!-- Large main image -->
                <div class="product-image-main">
                    <div class="product-image-main__bg" style="background-image: url('${mainImage}');"></div>
                    <div class="product-image-overlay">
                        <p class="product-image-overlay__label">Available Formats</p>
                        <p class="product-image-overlay__meta">Digital · Print · Framed</p>
                    </div>
                </div>

                <!-- Smaller sample images in 2-column grid -->
                <div class="product-thumbnails-grid">
                    ${altImages.map((src, i) => {
                        const info = overlayLabels[i] || overlayLabels[0];
                        return `<div class="product-thumbnail">
                            <div class="product-thumbnail__bg" style="background-image: url('${src}');"></div>
                            <div class="product-image-overlay">
                                <p class="product-image-overlay__label">${info.label}</p>
                                <p class="product-image-overlay__meta">${info.meta}</p>
                            </div>
                        </div>`;
                    }).join('')}
                </div>
            </div>

            <div class="product-info">
                <h1 class="product-title">${item.title}</h1>
                <p class="product-category">${categoryLabel}</p>

                ${description ? `<p class="product-description">${description}</p>` : ''}

                ${renderPurchaseOptions()}
            </div>
        </div>
    `;

    initPurchaseInteractions(item);
}

/**
 * Render purchase options section
 * @returns {string} HTML string
 */
function renderPurchaseOptions() {
    const defaultOption = purchaseOptions[0];

    // Type cards
    const typeCards = purchaseOptions.map(opt => `
        <div class="purchase-type-card${opt.id === defaultOption.id ? ' purchase-type-card--selected' : ''}"
             data-option-id="${opt.id}">
            <div class="purchase-type-card__label">${opt.label}</div>
            <div class="purchase-type-card__price">${formatPrice(opt.price)}</div>
        </div>
    `).join('');

    // Default sub-options (for the first option)
    const subOptionsHTML = renderSubOptions(defaultOption);

    return `
        <div class="purchase-options">
            <h3>Purchase Options</h3>

            <div class="purchase-options__types">
                ${typeCards}
            </div>

            <div class="purchase-sub-options__container">
                ${subOptionsHTML}
            </div>

            <div class="purchase-frame-color__container"></div>

            <div class="purchase-options__frame-note-container" style="display: none;">
                <p class="purchase-options__frame-note">${frameNote}</p>
            </div>

            <div class="purchase-options__total">
                <div>
                    <div class="purchase-options__total-label">Total</div>
                    <div class="purchase-options__tax-note">+ tax, shipping &amp; handling</div>
                </div>
                <div class="purchase-options__total-price">${formatPrice(defaultOption.price)}</div>
            </div>

            <button class="btn-accent button purchase-options__add-btn">Add to Cart</button>
            <div class="purchase-options__confirmation">Added to cart!</div>
        </div>
    `;
}

/**
 * Render sub-option pills for a given purchase option
 * @param {Object} option - Purchase option
 * @returns {string} HTML string
 */
function renderSubOptions(option) {
    if (!option.subOptions || option.subOptions.length === 0) {
        return '';
    }

    const label = option.subType === 'aspect-ratio' ? 'Aspect Ratio' : 'Orientation';
    const pills = option.subOptions.map((sub, i) => `
        <button class="purchase-pill${i === 0 ? ' purchase-pill--selected' : ''}"
                data-sub-id="${sub.id}">${sub.label}</button>
    `).join('');

    return `
        <div class="purchase-sub-options">
            <span class="purchase-sub-options__label">${label}</span>
            ${pills}
        </div>
    `;
}

/**
 * Render frame color pills
 * @param {Object} option - Purchase option
 * @returns {string} HTML string
 */
function renderFrameColors(option) {
    if (!option.frameColors || option.frameColors.length === 0) {
        return '';
    }

    const pills = option.frameColors.map((fc, i) => `
        <button class="purchase-pill${i === 0 ? ' purchase-pill--selected' : ''}"
                data-frame-color-id="${fc.id}">${fc.label}</button>
    `).join('');

    return `
        <div class="purchase-sub-options">
            <span class="purchase-sub-options__label">Frame Color</span>
            ${pills}
        </div>
    `;
}

/**
 * Initialize purchase option interactions
 * @param {Object} item - Gallery item
 */
function initPurchaseInteractions(item) {
    const container = document.querySelector('.purchase-options');
    if (!container) return;

    // State
    let selectedOptionId = purchaseOptions[0].id;
    let selectedSubId = purchaseOptions[0].subOptions?.[0]?.id || '';
    let selectedFrameColorId = '';

    const typeCards = container.querySelectorAll('.purchase-type-card');
    const subContainer = container.querySelector('.purchase-sub-options__container');
    const frameColorContainer = container.querySelector('.purchase-frame-color__container');
    const frameNoteContainer = container.querySelector('.purchase-options__frame-note-container');
    const totalPrice = container.querySelector('.purchase-options__total-price');
    const addBtn = container.querySelector('.purchase-options__add-btn');
    const confirmation = container.querySelector('.purchase-options__confirmation');

    function getSelectedOption() {
        return purchaseOptions.find(o => o.id === selectedOptionId);
    }

    function getSelectedSubOption() {
        const opt = getSelectedOption();
        if (!opt || !opt.subOptions.length) return null;
        return opt.subOptions.find(s => s.id === selectedSubId) || opt.subOptions[0];
    }

    function getSelectedFrameColor() {
        const opt = getSelectedOption();
        if (!opt || !opt.frameColors?.length) return null;
        return opt.frameColors.find(fc => fc.id === selectedFrameColorId) || opt.frameColors[0];
    }

    function updatePrice() {
        const opt = getSelectedOption();
        totalPrice.textContent = formatPrice(opt.price);
    }

    function updateFrameNote() {
        const isFramed = selectedOptionId === 'framed-square' || selectedOptionId === 'framed-rect';
        frameNoteContainer.style.display = isFramed ? 'block' : 'none';
    }

    function bindPillClicks(parent, dataAttr, callback) {
        parent.querySelectorAll('.purchase-pill').forEach(pill => {
            pill.addEventListener('click', () => {
                parent.querySelectorAll('.purchase-pill').forEach(p => p.classList.remove('purchase-pill--selected'));
                pill.classList.add('purchase-pill--selected');
                callback(pill.dataset[dataAttr]);
            });
        });
    }

    function updateSubOptions() {
        const opt = getSelectedOption();
        selectedSubId = opt.subOptions?.[0]?.id || '';
        subContainer.innerHTML = renderSubOptions(opt);
        bindPillClicks(subContainer, 'subId', id => { selectedSubId = id; });
    }

    function updateFrameColors() {
        const opt = getSelectedOption();
        selectedFrameColorId = opt.frameColors?.[0]?.id || '';
        frameColorContainer.innerHTML = renderFrameColors(opt);
        bindPillClicks(frameColorContainer, 'frameColorId', id => { selectedFrameColorId = id; });
    }

    // Type card clicks
    typeCards.forEach(card => {
        card.addEventListener('click', () => {
            typeCards.forEach(c => c.classList.remove('purchase-type-card--selected'));
            card.classList.add('purchase-type-card--selected');
            selectedOptionId = card.dataset.optionId;

            updateSubOptions();
            updateFrameColors();
            updatePrice();
            updateFrameNote();
        });
    });

    // Initial pill bindings
    bindPillClicks(subContainer, 'subId', id => { selectedSubId = id; });

    // Add to Cart
    addBtn.addEventListener('click', () => {
        const opt = getSelectedOption();
        const sub = getSelectedSubOption();
        const fc = getSelectedFrameColor();

        addItem({
            productId: item.id,
            slug: item.slug,
            title: item.title,
            type: item.type,
            optionId: opt.id,
            optionLabel: opt.label,
            subOption: sub?.id || '',
            subOptionLabel: sub?.label || '',
            sizeNote: sub?.sizeNote || opt.sizeNote || '',
            frameColor: fc?.id || '',
            frameColorLabel: fc?.label || '',
            price: opt.price,
            quantity: 1
        });

        // Show confirmation
        confirmation.classList.add('purchase-options__confirmation--visible');
        setTimeout(() => {
            confirmation.classList.remove('purchase-options__confirmation--visible');
        }, 2000);
    });

    // Set initial states
    updateFrameNote();
    updateFrameColors();
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
