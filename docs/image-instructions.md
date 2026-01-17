# Gallery Image System

This document explains how to add and manage images for the gallery.

## Folder Structure

All gallery images are organized by item slug:

```
assets/images/gallery/
  {slug}/
    main.jpg      # Primary image (used everywhere)
    alt-1.jpg     # Alternate view 1
    alt-2.jpg     # Alternate view 2
    alt-3.jpg     # Alternate view 3
    alt-4.jpg     # Alternate view 4
```

### What is a Slug?

A **slug** is the URL-friendly identifier for each gallery item. It's used in:
- Folder names (`assets/images/gallery/{slug}/`)
- Product page URLs (`product/{slug}.html`)
- Data references in `gallery-data.js`

### Current Slugs

| Slug | Title |
|------|-------|
| `sunset-mountains` | Sunset Over Mountains |
| `abstract-flow` | Abstract Flow |
| `city-lights` | City Lights |
| `ocean-waves` | Ocean Waves |
| `forest-path` | Forest Path |
| `neon-dreams` | Neon Dreams |
| `quiet-moment` | Quiet Moment |
| `botanical-study` | Botanical Study |
| `rainy-evening` | Rainy Evening |
| `layers-of-time` | Layers of Time |

## Image Specifications

### Aspect Ratio
All images must be **3:4 (portrait)** aspect ratio.

Examples of valid dimensions:
- 600 × 800 px
- 900 × 1200 px
- 1200 × 1600 px
- 1500 × 2000 px

### Recommended Sizes

| Image | Recommended Size | Usage |
|-------|------------------|-------|
| `main.jpg` | 1200 × 1600 px | Hero gallery, grid thumbnail, detail page main image |
| `alt-1.jpg` | 600 × 800 px | Detail page thumbnail grid |
| `alt-2.jpg` | 600 × 800 px | Detail page thumbnail grid |
| `alt-3.jpg` | 600 × 800 px | Detail page thumbnail grid |
| `alt-4.jpg` | 600 × 800 px | Detail page thumbnail grid |

### File Format
- **Format:** JPG (`.jpg`)
- **Quality:** 80-90% compression recommended for web
- **Color space:** sRGB

## Where Images Appear

### Main Image (`main.jpg`)
The main image is used in three places:
1. **Home page hero gallery** - Horizontal scroll gallery
2. **Shop page grid** - Thumbnail in the gallery grid
3. **Product detail page** - Large image at top of left column

This ensures consistency and eliminates duplicate files.

### Alternate Images (`alt-1.jpg` through `alt-4.jpg`)
Alternate images appear only on the **product detail page** in the 2-column thumbnail grid below the main image.

Use these for:
- Different angles of the artwork
- Detail/close-up shots
- The piece in a room setting
- Framing options preview

## Adding a New Gallery Item

### Step 1: Choose a Slug
Create a URL-friendly slug for your item:
- Use lowercase letters
- Replace spaces with hyphens
- Keep it short but descriptive
- Example: "Mountain Sunrise" → `mountain-sunrise`

### Step 2: Create the Image Folder
```
assets/images/gallery/{your-slug}/
```

### Step 3: Add Images
Add these files to the folder:
- `main.jpg` (required)
- `alt-1.jpg` (required)
- `alt-2.jpg` (required)
- `alt-3.jpg` (required)
- `alt-4.jpg` (required)

### Step 4: Add Data Entry
Edit `assets/js/gallery/gallery-data.js` and add to the `galleryItems` array:

```javascript
{
  id: 'gal-XXX',           // Unique ID (increment from last)
  title: 'Your Title',
  slug: 'your-slug',       // Must match folder name
  type: 'photography',     // or 'art'
  subCategory: 'landscape', // See categories in file
  dateCreated: '2025-01-15',
  description: 'Short description for the item.',
  featured: false          // Set true to feature
}
```

### Step 5: Create Product Page
Copy `product/_template.html` to `product/{your-slug}.html` and update:
- `<title>` tag
- `<meta>` description tags
- `data-product-slug` attribute

## Technical Details

### Configuration
Image path configuration is in `assets/js/gallery/gallery-data.js`:

```javascript
const IMAGE_CONFIG = {
    basePath: 'assets/images/gallery',
    mainImage: 'main.jpg',
    altImages: ['alt-1.jpg', 'alt-2.jpg', 'alt-3.jpg', 'alt-4.jpg'],
    extension: 'jpg'
};
```

### Helper Functions
Available in `gallery-data.js`:

```javascript
// Get main image path
getMainImagePath(slug)
// Returns: 'assets/images/gallery/{slug}/main.jpg'

// Get alternate image paths
getAltImagePaths(slug)
// Returns: ['assets/images/gallery/{slug}/alt-1.jpg', ...]

// Get all paths
getAllImagePaths(slug)
// Returns: { main: '...', alts: [...] }
```

### Subpage Paths
Product pages are in the `product/` subdirectory, so they use a different base path:
```javascript
const IMAGE_BASE_PATH = '../assets/images/gallery';
```

## Troubleshooting

### Images Not Showing
1. Check the slug matches exactly (case-sensitive)
2. Verify files are named correctly (`main.jpg`, not `Main.jpg`)
3. Ensure files are in the correct folder
4. Check browser console for 404 errors

### Wrong Aspect Ratio
If images appear stretched or cropped incorrectly:
1. Verify image is 3:4 aspect ratio
2. CSS uses `aspect-ratio: 3 / 4` and `object-fit: cover`

### Adding More Alternates
To add more than 4 alternate images, edit `IMAGE_CONFIG.altImages` in `gallery-data.js`:
```javascript
altImages: ['alt-1.jpg', 'alt-2.jpg', 'alt-3.jpg', 'alt-4.jpg', 'alt-5.jpg', 'alt-6.jpg']
```
Then update the CSS grid in `_components.css` if needed.
