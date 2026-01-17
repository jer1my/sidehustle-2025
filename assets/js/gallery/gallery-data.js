/**
 * Gallery Data Module
 * Static data for the shop gallery viewer
 */

// ===========================================
// Image Path Configuration
// ===========================================
// All gallery images are stored in a single folder per item:
//   assets/images/gallery/{slug}/
//     main.jpg     - Primary image (used in hero, grid, detail main)
//     alt-1.jpg    - Alternate view 1
//     alt-2.jpg    - Alternate view 2
//     alt-3.jpg    - Alternate view 3
//     alt-4.jpg    - Alternate view 4
//
// All images should be 3:4 aspect ratio (portrait)
// Recommended sizes: main.jpg (1200x1600), alternates (600x800)
// ===========================================

const IMAGE_CONFIG = {
    basePath: 'assets/images/gallery',
    mainImage: 'main.jpg',
    altImages: ['alt-1.jpg', 'alt-2.jpg', 'alt-3.jpg', 'alt-4.jpg'],
    extension: 'jpg'
};

/**
 * Get the main image path for a gallery item
 * @param {string} slug - The item's slug
 * @param {string} basePath - Optional base path override (e.g., '../assets/...' for subpages)
 * @returns {string} Full path to main image
 */
export function getMainImagePath(slug, basePath = IMAGE_CONFIG.basePath) {
    return `${basePath}/${slug}/${IMAGE_CONFIG.mainImage}`;
}

/**
 * Get alternate image paths for a gallery item
 * @param {string} slug - The item's slug
 * @param {string} basePath - Optional base path override
 * @returns {string[]} Array of paths to alternate images
 */
export function getAltImagePaths(slug, basePath = IMAGE_CONFIG.basePath) {
    return IMAGE_CONFIG.altImages.map(filename => `${basePath}/${slug}/${filename}`);
}

/**
 * Get all image paths for a gallery item (main + alternates)
 * @param {string} slug - The item's slug
 * @param {string} basePath - Optional base path override
 * @returns {Object} Object with main and alts arrays
 */
export function getAllImagePaths(slug, basePath = IMAGE_CONFIG.basePath) {
    return {
        main: getMainImagePath(slug, basePath),
        alts: getAltImagePaths(slug, basePath)
    };
}

// Categories and Sub-categories
export const categories = [
  {
    id: 'art',
    name: 'Art',
    subCategories: [
      { id: 'abstract', name: 'Abstract', parentCategory: 'art' },
      { id: 'digital', name: 'Digital Art', parentCategory: 'art' },
      { id: 'mixed-media', name: 'Mixed Media', parentCategory: 'art' },
      { id: 'illustration', name: 'Illustration', parentCategory: 'art' }
    ]
  },
  {
    id: 'photography',
    name: 'Photography',
    subCategories: [
      { id: 'landscape', name: 'Landscape', parentCategory: 'photography' },
      { id: 'portrait', name: 'Portrait', parentCategory: 'photography' },
      { id: 'street', name: 'Street', parentCategory: 'photography' },
      { id: 'nature', name: 'Nature', parentCategory: 'photography' },
      { id: 'architecture', name: 'Architecture', parentCategory: 'photography' }
    ]
  }
];

// Gallery Items
// Note: Image paths are generated from slug using getMainImagePath() and getAltImagePaths()
export const galleryItems = [
  {
    id: 'gal-001',
    title: 'Sunset Over Mountains',
    slug: 'sunset-mountains',
    type: 'photography',
    subCategory: 'landscape',
    dateCreated: '2024-12-15',
    description: 'Golden hour capture of mountain peaks bathed in warm sunset light.',
    featured: true
  },
  {
    id: 'gal-002',
    title: 'Abstract Flow',
    slug: 'abstract-flow',
    type: 'art',
    subCategory: 'abstract',
    dateCreated: '2024-11-20',
    description: 'Fluid shapes and vibrant colors exploring the concept of movement and energy.',
    featured: true
  },
  {
    id: 'gal-003',
    title: 'City Lights',
    slug: 'city-lights',
    type: 'photography',
    subCategory: 'architecture',
    dateCreated: '2024-10-08',
    description: 'Urban nightscape capturing the rhythm of city life through glowing windows.',
    featured: false
  },
  {
    id: 'gal-004',
    title: 'Ocean Waves',
    slug: 'ocean-waves',
    type: 'photography',
    subCategory: 'nature',
    dateCreated: '2024-09-25',
    description: 'Serene seascape with gentle waves rolling toward a distant horizon.',
    featured: false
  },
  {
    id: 'gal-005',
    title: 'Forest Path',
    slug: 'forest-path',
    type: 'photography',
    subCategory: 'landscape',
    dateCreated: '2024-08-12',
    description: 'Misty morning in an ancient forest, with light filtering through the canopy.',
    featured: true
  }
];

// Standard Print Options (shared across all items)
export const printOptions = [
  { id: 'print-8x10', size: '8x10', sizeLabel: '8" × 10" (Small)', price: 4500, available: true },
  { id: 'print-11x14', size: '11x14', sizeLabel: '11" × 14" (Medium)', price: 7500, available: true },
  { id: 'print-16x20', size: '16x20', sizeLabel: '16" × 20" (Large)', price: 12500, available: true },
  { id: 'print-24x30', size: '24x30', sizeLabel: '24" × 30" (X-Large)', price: 22500, available: true }
];

// Standard Frame Options (shared across all items)
export const frameOptions = [
  {
    id: 'frame-none',
    name: 'Print Only',
    description: 'Unframed print, ready for your own framing',
    previewImage: 'assets/images/frames/print-only.svg',
    priceModifier: 0
  },
  {
    id: 'frame-gallery-wrap',
    name: 'Gallery Wrap',
    description: 'Canvas stretched over wooden frame, ready to hang',
    previewImage: 'assets/images/frames/gallery-wrap.svg',
    priceModifier: 5000
  },
  {
    id: 'frame-classic-black',
    name: 'Classic Black Frame',
    description: 'Timeless black wood frame with white mat',
    previewImage: 'assets/images/frames/classic-black.svg',
    priceModifier: 7500
  },
  {
    id: 'frame-natural-wood',
    name: 'Natural Wood Frame',
    description: 'Light oak frame with natural finish',
    previewImage: 'assets/images/frames/natural-wood.svg',
    priceModifier: 8500
  }
];

// Product Details (extended info for detail pages)
export const productDetails = {
  'gal-001': {
    galleryItemId: 'gal-001',
    longDescription: 'This photograph was captured during golden hour in the Sierra Nevada mountain range. The warm light of the setting sun creates a magical glow across the peaks, while the valleys below are shrouded in soft shadow. A moment of perfect stillness frozen in time.',
    printOptions: ['print-8x10', 'print-11x14', 'print-16x20', 'print-24x30'],
    frameOptions: ['frame-none', 'frame-gallery-wrap', 'frame-classic-black', 'frame-natural-wood'],
    relatedItems: ['gal-004', 'gal-005']
  },
  'gal-002': {
    galleryItemId: 'gal-002',
    longDescription: 'Abstract Flow explores the concept of movement and energy through fluid shapes and vibrant colors. Created using a combination of digital techniques, this piece invites viewers to find their own meaning in the interplay of form and color.',
    printOptions: ['print-8x10', 'print-11x14', 'print-16x20', 'print-24x30'],
    frameOptions: ['frame-none', 'frame-gallery-wrap', 'frame-classic-black', 'frame-natural-wood'],
    relatedItems: []
  },
  'gal-003': {
    galleryItemId: 'gal-003',
    longDescription: 'City Lights captures the rhythm of urban life through the glowing windows of a nighttime skyline. Each lit window represents a story, a life, a moment happening simultaneously across the city. The contrast between the dark silhouettes and warm light creates a sense of intimacy within the vast urban landscape.',
    printOptions: ['print-8x10', 'print-11x14', 'print-16x20', 'print-24x30'],
    frameOptions: ['frame-none', 'frame-gallery-wrap', 'frame-classic-black', 'frame-natural-wood'],
    relatedItems: []
  },
  'gal-004': {
    galleryItemId: 'gal-004',
    longDescription: 'Ocean Waves captures the timeless dance between sea and sky. The gentle rhythm of the waves creates a meditative quality, while the soft colors of the sky reflect off the water surface. A reminder of nature\'s endless cycles and the peace found at the water\'s edge.',
    printOptions: ['print-8x10', 'print-11x14', 'print-16x20', 'print-24x30'],
    frameOptions: ['frame-none', 'frame-gallery-wrap', 'frame-classic-black', 'frame-natural-wood'],
    relatedItems: ['gal-001', 'gal-005']
  },
  'gal-005': {
    galleryItemId: 'gal-005',
    longDescription: 'Forest Path invites you to step into an ancient woodland on a misty morning. The winding path leads deeper into the trees, where light filters through the canopy creating an ethereal atmosphere. A journey into the heart of nature\'s quiet sanctuary.',
    printOptions: ['print-8x10', 'print-11x14', 'print-16x20', 'print-24x30'],
    frameOptions: ['frame-none', 'frame-gallery-wrap', 'frame-classic-black', 'frame-natural-wood'],
    relatedItems: ['gal-001', 'gal-004']
  }
};

// Helper function to get all subcategories for a category
export function getSubCategories(categoryId) {
  const category = categories.find(c => c.id === categoryId);
  return category ? category.subCategories : [];
}

// Helper function to get gallery item by slug
export function getItemBySlug(slug) {
  return galleryItems.find(item => item.slug === slug);
}

// Helper function to get product detail by gallery item ID
export function getProductDetail(galleryItemId) {
  return productDetails[galleryItemId];
}

// Helper function to format price (cents to dollars)
export function formatPrice(cents) {
  return '$' + (cents / 100).toFixed(2);
}
