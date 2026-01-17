/**
 * Gallery Grid Module
 * Renders and manages the gallery grid with filtering and sorting
 */

import { galleryItems, categories, getSubCategories, getMainImagePath } from './gallery-data.js';

// State
let currentFilter = {
    type: 'all',
    subCategory: 'all'
};
let currentSort = 'newest';

// DOM Elements (initialized on load)
let galleryGrid = null;
let typeFilter = null;
let subCategoryFilter = null;
let sortSelect = null;
let clearButton = null;

/**
 * Initialize the gallery
 */
export function init() {
    // Get DOM elements
    galleryGrid = document.getElementById('gallery-grid');
    typeFilter = document.getElementById('type-filter');
    subCategoryFilter = document.getElementById('subcategory-filter');
    sortSelect = document.getElementById('sort-select');
    clearButton = document.getElementById('clear-filters');

    if (!galleryGrid) {
        console.error('Gallery grid element not found');
        return;
    }

    // Restore state from sessionStorage
    restoreState();

    // Set up event listeners
    if (typeFilter) {
        typeFilter.addEventListener('change', handleTypeChange);
    }
    if (subCategoryFilter) {
        subCategoryFilter.addEventListener('change', handleSubCategoryChange);
    }
    if (sortSelect) {
        sortSelect.addEventListener('change', handleSortChange);
    }
    if (clearButton) {
        clearButton.addEventListener('click', clearFilters);
    }

    // Update sub-category options based on current type
    updateSubCategoryOptions();

    // Render the gallery
    renderGallery();

    // Update clear button visibility
    updateClearButtonVisibility();
}

/**
 * Restore filter/sort state from sessionStorage
 */
function restoreState() {
    const savedType = sessionStorage.getItem('gallery-filter-type');
    const savedSubCategory = sessionStorage.getItem('gallery-filter-subcategory');
    const savedSort = sessionStorage.getItem('gallery-sort');

    if (savedType) {
        currentFilter.type = savedType;
        if (typeFilter) typeFilter.value = savedType;
    }
    if (savedSubCategory) {
        currentFilter.subCategory = savedSubCategory;
    }
    if (savedSort) {
        currentSort = savedSort;
        if (sortSelect) sortSelect.value = savedSort;
    }
}

/**
 * Save state to sessionStorage
 */
function saveState() {
    sessionStorage.setItem('gallery-filter-type', currentFilter.type);
    sessionStorage.setItem('gallery-filter-subcategory', currentFilter.subCategory);
    sessionStorage.setItem('gallery-sort', currentSort);
}

/**
 * Handle type filter change
 */
function handleTypeChange(e) {
    currentFilter.type = e.target.value;
    currentFilter.subCategory = 'all'; // Reset sub-category when type changes
    updateSubCategoryOptions();
    saveState();
    renderGallery();
    updateClearButtonVisibility();
}

/**
 * Handle sub-category filter change
 */
function handleSubCategoryChange(e) {
    currentFilter.subCategory = e.target.value;
    saveState();
    renderGallery();
    updateClearButtonVisibility();
}

/**
 * Handle sort change
 */
function handleSortChange(e) {
    currentSort = e.target.value;
    saveState();
    renderGallery();
}

/**
 * Update sub-category dropdown options based on selected type
 */
function updateSubCategoryOptions() {
    if (!subCategoryFilter) return;

    // Clear existing options
    subCategoryFilter.innerHTML = '<option value="all">All Sub-categories</option>';

    if (currentFilter.type === 'all') {
        // Show all sub-categories from all types
        categories.forEach(category => {
            category.subCategories.forEach(sub => {
                const option = document.createElement('option');
                option.value = sub.id;
                option.textContent = `${sub.name} (${category.name})`;
                subCategoryFilter.appendChild(option);
            });
        });
    } else {
        // Show sub-categories for selected type only
        const subCategories = getSubCategories(currentFilter.type);
        subCategories.forEach(sub => {
            const option = document.createElement('option');
            option.value = sub.id;
            option.textContent = sub.name;
            subCategoryFilter.appendChild(option);
        });
    }

    // Restore selected value if it exists in the new options
    if (currentFilter.subCategory !== 'all') {
        const optionExists = Array.from(subCategoryFilter.options).some(
            opt => opt.value === currentFilter.subCategory
        );
        if (optionExists) {
            subCategoryFilter.value = currentFilter.subCategory;
        } else {
            currentFilter.subCategory = 'all';
            subCategoryFilter.value = 'all';
        }
    }
}

/**
 * Clear all filters
 */
function clearFilters() {
    currentFilter.type = 'all';
    currentFilter.subCategory = 'all';
    currentSort = 'newest';

    if (typeFilter) typeFilter.value = 'all';
    if (sortSelect) sortSelect.value = 'newest';

    updateSubCategoryOptions();
    saveState();
    renderGallery();
    updateClearButtonVisibility();
}

/**
 * Update clear button visibility
 */
function updateClearButtonVisibility() {
    if (!clearButton) return;

    const hasActiveFilters = currentFilter.type !== 'all' ||
                            currentFilter.subCategory !== 'all' ||
                            currentSort !== 'newest';

    clearButton.style.display = hasActiveFilters ? 'inline-block' : 'none';
}

/**
 * Filter gallery items based on current filter state
 */
function filterItems(items) {
    return items.filter(item => {
        // Type filter
        if (currentFilter.type !== 'all' && item.type !== currentFilter.type) {
            return false;
        }

        // Sub-category filter
        if (currentFilter.subCategory !== 'all' && item.subCategory !== currentFilter.subCategory) {
            return false;
        }

        return true;
    });
}

/**
 * Sort gallery items based on current sort state
 */
function sortItems(items) {
    const sorted = [...items];

    switch (currentSort) {
        case 'newest':
            sorted.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));
            break;
        case 'oldest':
            sorted.sort((a, b) => new Date(a.dateCreated) - new Date(b.dateCreated));
            break;
        case 'title-asc':
            sorted.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'title-desc':
            sorted.sort((a, b) => b.title.localeCompare(a.title));
            break;
        default:
            // Default to newest
            sorted.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));
    }

    return sorted;
}

/**
 * Create a gallery card element
 */
function createGalleryCard(item) {
    const card = document.createElement('a');
    card.href = `product/${item.slug}.html`;
    card.className = 'gallery-card';
    card.setAttribute('aria-label', `View ${item.title}`);

    // Get category display name
    const category = categories.find(c => c.id === item.type);
    const subCategory = category?.subCategories.find(s => s.id === item.subCategory);
    const categoryLabel = subCategory ? subCategory.name : item.subCategory;

    card.innerHTML = `
        <div class="gallery-thumbnail"></div>
        <div class="gallery-card-info">
            <h3 class="gallery-card-title">${item.title}</h3>
            <p class="gallery-card-category">${categoryLabel}</p>
        </div>
    `;

    return card;
}

/**
 * Render empty state
 */
function renderEmptyState() {
    galleryGrid.innerHTML = `
        <div class="gallery-empty">
            <h3>No items found</h3>
            <p>Try adjusting your filters to see more results.</p>
            <button class="gallery-clear-btn" onclick="window.galleryGrid.clearFilters()">
                Clear Filters
            </button>
        </div>
    `;
}

/**
 * Render the gallery grid
 */
export function renderGallery() {
    if (!galleryGrid) return;

    // Filter and sort items
    let items = filterItems(galleryItems);
    items = sortItems(items);

    // Clear the grid
    galleryGrid.innerHTML = '';

    // Check for empty state
    if (items.length === 0) {
        renderEmptyState();
        return;
    }

    // Create and append cards
    items.forEach(item => {
        const card = createGalleryCard(item);
        galleryGrid.appendChild(card);
    });
}

// Expose clearFilters globally for the empty state button
window.galleryGrid = {
    clearFilters
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
