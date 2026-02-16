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
  },
  {
    id: 'gal-006',
    title: 'Neon Dreams',
    slug: 'neon-dreams',
    type: 'art',
    subCategory: 'digital',
    dateCreated: '2025-01-10',
    description: 'A vibrant exploration of color and light in the digital realm.',
    featured: true
  },
  {
    id: 'gal-007',
    title: 'Quiet Moment',
    slug: 'quiet-moment',
    type: 'photography',
    subCategory: 'portrait',
    dateCreated: '2025-01-05',
    description: 'An intimate portrait capturing a fleeting moment of reflection.',
    featured: false
  },
  {
    id: 'gal-008',
    title: 'Botanical Study',
    slug: 'botanical-study',
    type: 'art',
    subCategory: 'illustration',
    dateCreated: '2024-12-28',
    description: 'Detailed botanical illustration inspired by vintage scientific drawings.',
    featured: true
  },
  {
    id: 'gal-009',
    title: 'Rainy Evening',
    slug: 'rainy-evening',
    type: 'photography',
    subCategory: 'street',
    dateCreated: '2024-12-20',
    description: 'City streets glistening with rain, reflections dancing in puddles.',
    featured: false
  },
  {
    id: 'gal-010',
    title: 'Layers of Time',
    slug: 'layers-of-time',
    type: 'art',
    subCategory: 'mixed-media',
    dateCreated: '2024-11-30',
    description: 'Mixed media piece combining photography, paint, and found materials.',
    featured: false
  }
];

// ===========================================
// Purchase Options (shared across all items)
// ===========================================
export const purchaseOptions = [
  {
    id: 'digital',
    label: 'Digital File',
    price: 2000,
    subType: 'aspect-ratio',
    subOptions: [
      { id: 'square', label: 'Square' },
      { id: 'portrait', label: 'Portrait' },
      { id: 'landscape', label: 'Landscape' }
    ]
  },
  {
    id: 'print',
    label: 'Print Only',
    price: 5000,
    subType: 'aspect-ratio',
    subOptions: [
      { id: 'square', label: 'Square' },
      { id: 'portrait', label: 'Portrait' },
      { id: 'landscape', label: 'Landscape' }
    ]
  },
  {
    id: 'framed-square',
    label: 'Framed Print (Square)',
    price: 17500,
    sizeNote: '13×13',
    subType: null,
    subOptions: [],
    frameColors: [
      { id: 'white', label: 'White Frame / White Mat' },
      { id: 'black', label: 'Black Frame / Black Mat' }
    ]
  },
  {
    id: 'framed-rect',
    label: 'Framed Print (Portrait/Landscape)',
    price: 22500,
    subType: 'orientation',
    subOptions: [
      { id: 'portrait', label: 'Portrait', sizeNote: '13×19' },
      { id: 'landscape', label: 'Landscape', sizeNote: '19×13' }
    ],
    frameColors: [
      { id: 'white', label: 'White Frame / White Mat' },
      { id: 'black', label: 'Black Frame / Black Mat' }
    ]
  }
];

export const frameNote = 'Frames made in USA with 99% UV protection cover.';

// Long descriptions for detail pages
export const longDescriptions = {
  'gal-001': 'This photograph was captured during golden hour in the Sierra Nevada mountain range. The warm light of the setting sun creates a magical glow across the peaks, while the valleys below are shrouded in soft shadow. A moment of perfect stillness frozen in time.',
  'gal-002': 'Abstract Flow explores the concept of movement and energy through fluid shapes and vibrant colors. Created using a combination of digital techniques, this piece invites viewers to find their own meaning in the interplay of form and color.',
  'gal-003': 'City Lights captures the rhythm of urban life through the glowing windows of a nighttime skyline. Each lit window represents a story, a life, a moment happening simultaneously across the city. The contrast between the dark silhouettes and warm light creates a sense of intimacy within the vast urban landscape.',
  'gal-004': 'Ocean Waves captures the timeless dance between sea and sky. The gentle rhythm of the waves creates a meditative quality, while the soft colors of the sky reflect off the water surface. A reminder of nature\'s endless cycles and the peace found at the water\'s edge.',
  'gal-005': 'Forest Path invites you to step into an ancient woodland on a misty morning. The winding path leads deeper into the trees, where light filters through the canopy creating an ethereal atmosphere. A journey into the heart of nature\'s quiet sanctuary.',
  'gal-006': 'Neon Dreams pushes the boundaries of digital art, creating a vivid dreamscape of electric colors and impossible geometries. Each element pulses with energy, inviting the viewer into a world where reality bends to imagination.',
  'gal-007': 'Quiet Moment captures the beauty found in stillness. Natural light falls softly across the subject, revealing textures and emotions that often go unnoticed in our busy lives. A celebration of the intimate and the everyday.',
  'gal-008': 'Botanical Study draws inspiration from the golden age of scientific illustration. Each leaf and petal is rendered with careful attention to detail, blending artistic expression with botanical accuracy. A tribute to the beauty of the natural world.',
  'gal-009': 'Rainy Evening transforms an ordinary city street into a canvas of light and reflection. The rain creates mirrors on the pavement, doubling the glow of neon signs and streetlights. An homage to the beauty found in urban moments we often rush past.',
  'gal-010': 'Layers of Time is a mixed media exploration of memory and history. Fragments of photographs, hand-painted elements, and found materials combine to create a rich tapestry of texture and meaning. Each layer reveals and conceals, inviting deeper contemplation.'
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

// Helper function to get long description by gallery item ID
export function getLongDescription(galleryItemId) {
  return longDescriptions[galleryItemId] || '';
}

// Helper function to get a purchase option by ID
export function getPurchaseOption(optionId) {
  return purchaseOptions.find(opt => opt.id === optionId);
}

// Helper function to format price (cents to dollars)
export function formatPrice(cents) {
  return '$' + (cents / 100).toFixed(2);
}
