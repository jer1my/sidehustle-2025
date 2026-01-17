# Data Model: Shop Gallery Viewer

**Branch**: `001-shop-gallery-viewer` | **Date**: 2025-01-16

## Overview

This document defines the data entities for the Shop Gallery Viewer feature. All entities are implemented as JavaScript objects/arrays in static data files.

---

## Entity Definitions

### GalleryItem

Represents a single item in the gallery.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier (UUID or slug-based) |
| `title` | string | Yes | Display title for the item |
| `slug` | string | Yes | URL-safe identifier (e.g., "sunset-landscape") |
| `type` | enum | Yes | Main category: "art" or "photography" |
| `subCategory` | string | Yes | Sub-category within type (e.g., "landscape", "portrait") |
| `thumbnail` | string | Yes | Path to thumbnail image (relative to assets) |
| `fullImage` | string | Yes | Path to full-size image (relative to assets) |
| `dateCreated` | string | Yes | ISO 8601 date string (YYYY-MM-DD) |
| `description` | string | No | Brief description (for detail page) |
| `featured` | boolean | No | Whether to feature prominently (default: false) |

**Validation Rules**:
- `title`: 1-100 characters
- `slug`: lowercase alphanumeric with hyphens, unique across all items
- `type`: must be "art" or "photography"
- `subCategory`: must exist in the SubCategories list for the given type
- `thumbnail`: must be valid relative path to existing image
- `dateCreated`: valid ISO 8601 date, not in the future

**Example**:
```javascript
{
  id: "gal-001",
  title: "Sunset Over Mountains",
  slug: "sunset-over-mountains",
  type: "photography",
  subCategory: "landscape",
  thumbnail: "images/gallery/thumbnails/sunset-over-mountains.jpg",
  fullImage: "images/gallery/full/sunset-over-mountains.jpg",
  dateCreated: "2024-06-15",
  description: "Golden hour capture of the Sierra Nevada mountain range.",
  featured: true
}
```

---

### Category

Main classification for gallery items.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier ("art" or "photography") |
| `name` | string | Yes | Display name |
| `subCategories` | SubCategory[] | Yes | List of sub-categories |

**Values**:
```javascript
const categories = [
  {
    id: "art",
    name: "Art",
    subCategories: [/* see SubCategory */]
  },
  {
    id: "photography",
    name: "Photography",
    subCategories: [/* see SubCategory */]
  }
];
```

---

### SubCategory

Secondary classification within a category.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier within category |
| `name` | string | Yes | Display name |
| `parentCategory` | string | Yes | Parent category ID |

**Art Sub-Categories**:
- `abstract` - Abstract Art
- `digital` - Digital Art
- `mixed-media` - Mixed Media
- `illustration` - Illustration

**Photography Sub-Categories**:
- `landscape` - Landscape Photography
- `portrait` - Portrait Photography
- `street` - Street Photography
- `nature` - Nature Photography
- `architecture` - Architecture Photography

---

### ProductDetail

Extended information for a gallery item's detail page.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `galleryItemId` | string | Yes | Reference to GalleryItem.id |
| `longDescription` | string | No | Extended description/story |
| `printOptions` | PrintOption[] | Yes | Available print configurations |
| `frameOptions` | FrameOption[] | No | Available framing styles |
| `relatedItems` | string[] | No | Array of related GalleryItem IDs |

**Example**:
```javascript
{
  galleryItemId: "gal-001",
  longDescription: "This photograph was captured during golden hour in the Sierra Nevada...",
  printOptions: [/* see PrintOption */],
  frameOptions: [/* see FrameOption */],
  relatedItems: ["gal-005", "gal-012"]
}
```

---

### PrintOption

Available print configuration for a gallery item.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier |
| `size` | string | Yes | Print dimensions (e.g., "8x10", "16x20") |
| `sizeLabel` | string | Yes | Human-readable size label |
| `price` | number | Yes | Base price in USD (cents) |
| `available` | boolean | Yes | Whether currently available |

**Standard Sizes**:
```javascript
const standardPrintOptions = [
  { id: "print-8x10", size: "8x10", sizeLabel: "8\" × 10\" (Small)", price: 4500, available: true },
  { id: "print-11x14", size: "11x14", sizeLabel: "11\" × 14\" (Medium)", price: 7500, available: true },
  { id: "print-16x20", size: "16x20", sizeLabel: "16\" × 20\" (Large)", price: 12500, available: true },
  { id: "print-24x30", size: "24x30", sizeLabel: "24\" × 30\" (X-Large)", price: 22500, available: true }
];
```

**Note**: Prices stored in cents to avoid floating-point issues. Display as `$45.00`.

---

### FrameOption

Framing/mounting style for prints.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier |
| `name` | string | Yes | Display name |
| `description` | string | Yes | Brief description of the framing style |
| `previewImage` | string | Yes | Path to preview image |
| `priceModifier` | number | Yes | Additional cost in USD (cents) |

**Standard Frame Options**:
```javascript
const standardFrameOptions = [
  {
    id: "frame-none",
    name: "Print Only",
    description: "Unframed print, ready for your own framing",
    previewImage: "images/frames/print-only.jpg",
    priceModifier: 0
  },
  {
    id: "frame-gallery-wrap",
    name: "Gallery Wrap",
    description: "Canvas stretched over wooden frame, ready to hang",
    previewImage: "images/frames/gallery-wrap.jpg",
    priceModifier: 5000
  },
  {
    id: "frame-classic-black",
    name: "Classic Black Frame",
    description: "Timeless black wood frame with white mat",
    previewImage: "images/frames/classic-black.jpg",
    priceModifier: 7500
  },
  {
    id: "frame-natural-wood",
    name: "Natural Wood Frame",
    description: "Light oak frame with natural finish",
    previewImage: "images/frames/natural-wood.jpg",
    priceModifier: 8500
  }
];
```

---

## Relationships

```
┌─────────────┐      ┌──────────────┐
│  Category   │─────<│ SubCategory  │
└─────────────┘      └──────────────┘
                            │
                            │ type + subCategory
                            ▼
┌─────────────┐      ┌──────────────┐
│GalleryItem  │──────│ProductDetail │
└─────────────┘      └──────────────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
              ▼             ▼             ▼
       ┌───────────┐ ┌───────────┐ ┌───────────┐
       │PrintOption│ │FrameOption│ │RelatedItem│
       └───────────┘ └───────────┘ └───────────┘
```

---

## State Management

### Session State (sessionStorage)

| Key | Type | Description |
|-----|------|-------------|
| `gallery-filter-type` | string | Selected type filter ("all", "art", "photography") |
| `gallery-filter-subcategory` | string | Selected sub-category filter |
| `gallery-sort` | string | Selected sort option ("newest", "oldest", "title-asc", "title-desc") |

---

## Data File Structure

```javascript
// assets/js/gallery/gallery-data.js

export const categories = [
  { id: "art", name: "Art", subCategories: [...] },
  { id: "photography", name: "Photography", subCategories: [...] }
];

export const galleryItems = [
  { id: "gal-001", title: "...", ... },
  { id: "gal-002", title: "...", ... },
  // ... more items
];

export const productDetails = {
  "gal-001": { galleryItemId: "gal-001", ... },
  "gal-002": { galleryItemId: "gal-002", ... },
  // ... keyed by gallery item ID
};

export const printOptions = [...];  // Shared across all items
export const frameOptions = [...];  // Shared across all items
```
