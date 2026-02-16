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
    getAllImagePaths
} from './gallery-data.js';

import { addItem, isInCart } from '../cart/cart.js';

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

    // Get all image paths
    const images = getAllImagePaths(item.slug, IMAGE_BASE_PATH);
    const allSlides = [images.main, ...images.alts];

    // Arrow SVGs
    const prevArrowSVG = `<svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>`;
    const nextArrowSVG = `<svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg>`;

    container.innerHTML = `
        <div class="product-detail-layout">
            <div class="product-images-column">
                <!-- Image Carousel -->
                <div class="product-carousel">
                    <div class="product-carousel__container">
                        <div class="product-carousel__track">
                            ${allSlides.map(src => `
                                <div class="product-carousel__slide">
                                    <div class="product-carousel__slide-bg" style="background-image: url('${src}');"></div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <button class="product-carousel__arrow product-carousel__arrow--prev" aria-label="Previous image">${prevArrowSVG}</button>
                    <button class="product-carousel__arrow product-carousel__arrow--next" aria-label="Next image">${nextArrowSVG}</button>
                </div>

                <!-- Thumbnail Strip -->
                <div class="product-thumbnail-strip">
                    <button class="product-thumbnail-strip__arrow product-thumbnail-strip__arrow--prev" aria-label="Previous thumbnails">${prevArrowSVG}</button>
                    <div class="product-thumbnail-strip__viewport">
                        <div class="product-thumbnail-strip__track">
                            ${allSlides.map((src, i) => `
                                <div class="product-thumbnail-strip__item${i === 0 ? ' product-thumbnail-strip__item--active' : ''}" data-slide="${i}">
                                    <div class="product-thumbnail-strip__bg" style="background-image: url('${src}');"></div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <button class="product-thumbnail-strip__arrow product-thumbnail-strip__arrow--next" aria-label="Next thumbnails">${nextArrowSVG}</button>
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

    initCarousel();
    initPurchaseInteractions(item);
}

/**
 * Initialize carousel behavior: auto-advance, arrows, thumbnails, touch swipe, visibility
 */
function initCarousel() {
    const track = document.querySelector('.product-carousel__track');
    const carouselContainer = document.querySelector('.product-carousel__container');
    const thumbs = document.querySelectorAll('.product-thumbnail-strip__item');
    const prevBtn = document.querySelector('.product-carousel__arrow--prev');
    const nextBtn = document.querySelector('.product-carousel__arrow--next');

    // Thumbnail strip navigation
    const thumbTrack = document.querySelector('.product-thumbnail-strip__track');
    const thumbViewport = document.querySelector('.product-thumbnail-strip__viewport');
    const thumbPrevBtn = document.querySelector('.product-thumbnail-strip__arrow--prev');
    const thumbNextBtn = document.querySelector('.product-thumbnail-strip__arrow--next');

    if (!track || !carouselContainer) return;

    const totalSlides = thumbs.length;
    let currentSlide = 0;
    let autoAdvanceTimer = null;
    let resumeTimer = null;

    // Thumbnail strip scroll state
    const VISIBLE_THUMBS = 5;
    const GAP_PX = 8;

    function getThumbMetrics() {
        if (!thumbViewport) return { thumbWidth: 0, step: 0 };
        const viewportWidth = thumbViewport.offsetWidth;
        const visibleCount = Math.min(totalSlides, VISIBLE_THUMBS);
        const thumbWidth = (viewportWidth - (visibleCount - 1) * GAP_PX) / visibleCount;
        return { thumbWidth, step: thumbWidth + GAP_PX, viewportWidth };
    }

    function sizeThumbItems() {
        if (!thumbTrack || !thumbViewport || totalSlides === 0) return;
        const { thumbWidth } = getThumbMetrics();
        thumbs.forEach(t => { t.style.width = `${thumbWidth}px`; });
    }

    function goToSlide(index) {
        currentSlide = ((index % totalSlides) + totalSlides) % totalSlides;
        track.style.transform = `translateX(-${currentSlide * 100}%)`;

        thumbs.forEach((t, i) => {
            t.classList.toggle('product-thumbnail-strip__item--active', i === currentSlide);
        });

        centerThumbOnActive();
    }

    function centerThumbOnActive() {
        if (!thumbTrack || !thumbViewport || totalSlides <= VISIBLE_THUMBS) return;

        const { thumbWidth, step, viewportWidth } = getThumbMetrics();

        // Position of the active thumb's center relative to track start
        const activeCenter = currentSlide * step + thumbWidth / 2;

        // Shift so the active thumb center aligns with viewport center
        let shift = activeCenter - viewportWidth / 2;

        // Clamp so we don't scroll past the edges
        const maxShift = (totalSlides * step - GAP_PX) - viewportWidth;
        shift = Math.max(0, Math.min(shift, maxShift));

        thumbTrack.style.transform = `translateX(-${shift}px)`;
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    function startAutoAdvance() {
        stopAutoAdvance();
        autoAdvanceTimer = setInterval(nextSlide, 4500);
    }

    function stopAutoAdvance() {
        if (autoAdvanceTimer) {
            clearInterval(autoAdvanceTimer);
            autoAdvanceTimer = null;
        }
    }

    function pauseAndResume() {
        stopAutoAdvance();
        if (resumeTimer) clearTimeout(resumeTimer);
        resumeTimer = setTimeout(startAutoAdvance, 8000);
    }

    // Carousel arrow clicks
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            pauseAndResume();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            pauseAndResume();
        });
    }

    // Thumbnail strip arrows navigate the carousel (prev/next slide)
    if (thumbPrevBtn) {
        thumbPrevBtn.addEventListener('click', () => {
            prevSlide();
            pauseAndResume();
        });
    }

    if (thumbNextBtn) {
        thumbNextBtn.addEventListener('click', () => {
            nextSlide();
            pauseAndResume();
        });
    }

    // Thumbnail clicks
    thumbs.forEach(thumb => {
        thumb.addEventListener('click', () => {
            const index = parseInt(thumb.dataset.slide, 10);
            goToSlide(index);
            pauseAndResume();
        });
    });

    // Touch swipe on carousel
    let touchStartX = 0;
    let touchDeltaX = 0;
    let isSwiping = false;

    carouselContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchDeltaX = 0;
        isSwiping = true;
        track.classList.add('product-carousel__track--no-transition');
    }, { passive: true });

    carouselContainer.addEventListener('touchmove', (e) => {
        if (!isSwiping) return;
        touchDeltaX = e.touches[0].clientX - touchStartX;
    }, { passive: true });

    carouselContainer.addEventListener('touchend', () => {
        if (!isSwiping) return;
        isSwiping = false;
        track.classList.remove('product-carousel__track--no-transition');

        if (Math.abs(touchDeltaX) > 30) {
            if (touchDeltaX < 0) {
                nextSlide();
            } else {
                prevSlide();
            }
            pauseAndResume();
        }
    });

    // Visibility API: pause when page hidden, resume when visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAutoAdvance();
        } else {
            startAutoAdvance();
        }
    });

    // Set initial thumb sizes
    sizeThumbItems();

    // Recalculate on resize so thumbnails stay centered and properly sized
    let resizeTimer = null;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            sizeThumbItems();
            centerThumbOnActive();
        }, 100);
    });

    startAutoAdvance();
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

            <div class="purchase-options__in-cart-notice"></div>
            <button class="btn-accent button purchase-options__add-btn">Add to Cart</button>
            <a href="../cart.html" class="btn-accent button purchase-options__go-to-cart-btn">Go to Cart</a>
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
    const goToCartBtn = container.querySelector('.purchase-options__go-to-cart-btn');
    const inCartNotice = container.querySelector('.purchase-options__in-cart-notice');

    function updateInCartState() {
        const alreadyInCart = isInCart(item.id);
        if (alreadyInCart) {
            inCartNotice.textContent = 'This item is in your cart';
            inCartNotice.classList.add('purchase-options__in-cart-notice--visible');
            addBtn.textContent = 'Add Another';
            addBtn.classList.remove('btn-accent');
            addBtn.classList.add('btn-secondary');
            goToCartBtn.classList.add('purchase-options__go-to-cart-btn--visible');
        } else {
            inCartNotice.textContent = '';
            inCartNotice.classList.remove('purchase-options__in-cart-notice--visible');
            addBtn.textContent = 'Add to Cart';
            addBtn.classList.remove('btn-secondary');
            addBtn.classList.add('btn-accent');
            goToCartBtn.classList.remove('purchase-options__go-to-cart-btn--visible');
        }
    }

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

        // Brief confirmation flash, then show persistent "in cart" state
        addBtn.textContent = 'Added!';
        addBtn.classList.add('purchase-options__add-btn--added');
        addBtn.disabled = true;

        setTimeout(() => {
            addBtn.classList.remove('purchase-options__add-btn--added');
            addBtn.disabled = false;
            updateInCartState();
        }, 1500);
    });

    // Set initial states
    updateInCartState();
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
