# Research: Shop Gallery Viewer

**Branch**: `001-shop-gallery-viewer` | **Date**: 2025-01-16

## Overview

This document captures research findings and technology decisions for the Shop Gallery Viewer feature. All decisions align with the project constitution and existing codebase patterns.

---

## Decision 1: Data Storage Approach

**Decision**: Use static JavaScript module with embedded JSON data

**Rationale**:
- Consistent with existing static site architecture (no server-side code)
- Enables offline functionality once page loads
- Simple deployment via existing FTP workflow
- No build step required, maintains vanilla JS pattern
- Data can be easily updated by editing a single file

**Alternatives Considered**:
| Alternative | Why Rejected |
|-------------|--------------|
| External JSON file with fetch | Requires CORS handling, adds HTTP request, complicates local testing |
| localStorage | Not suitable for source data, better for user preferences (filter state) |
| IndexedDB | Overkill for read-only gallery data of this scale (50-200 items) |
| CMS/API integration | Against project's static site philosophy, adds deployment complexity |

**Implementation Notes**:
- Data file: `assets/js/gallery/gallery-data.js`
- Export pattern: `export const galleryItems = [...]`
- Filter/sort state stored in sessionStorage per FR-007

---

## Decision 2: Grid Layout Implementation

**Decision**: Use CSS Grid with existing utility classes

**Rationale**:
- Existing `.grid` and `.col-span-*` utilities provide 12-column system
- CSS Grid handles responsive layout without JavaScript
- Aspect ratio maintained via existing `--hero-frame-aspect: 0.75` variable
- Consistent with constitution principle IV (Responsive Design)

**Alternatives Considered**:
| Alternative | Why Rejected |
|-------------|--------------|
| Flexbox-based grid | Less control over column counts at breakpoints |
| JavaScript-based masonry | Inconsistent aspect ratios, complex implementation |
| CSS columns | Poor support for maintaining item order during filtering |

**Breakpoint Strategy** (mobile-first):
```css
/* Default: 2 columns (mobile) */
/* 768px+: 3 columns (tablet) */
/* 1024px+: 4 columns (desktop) */
```

---

## Decision 3: Filter/Sort UI Pattern

**Decision**: Toolbar-style filter bar above gallery with dropdown selects

**Rationale**:
- Matches common e-commerce UX patterns
- Minimal UI footprint, content-focused design
- Uses existing `.form-select` and `.btn-*` components
- Filter state preserved in sessionStorage (FR-007)

**Alternatives Considered**:
| Alternative | Why Rejected |
|-------------|--------------|
| Sidebar filters | Reduces gallery space, more complex responsive handling |
| Modal/overlay filters | Extra interaction step, breaks browsing flow |
| Filter chips | Good for applied filters, but needs dropdown for selection anyway |

**UI Components**:
- Type filter: `<select>` with Art/Photography/All options
- Sub-category filter: Dynamic `<select>` based on type selection
- Sort select: `<select>` with Newest/Oldest/A-Z/Z-A options
- Clear filters button (shown when filters active)

---

## Decision 4: Product Detail Page Architecture

**Decision**: Static HTML files per product in `/product/` directory

**Rationale**:
- SEO-friendly (each product has unique URL)
- Works with existing FTP deployment
- No JavaScript required for initial page load
- Can be pre-generated from data file

**Alternatives Considered**:
| Alternative | Why Rejected |
|-------------|--------------|
| Single-page with hash routing | Poor SEO, no direct linking to products |
| Query parameter approach | Less clean URLs, harder to share |
| JavaScript-rendered detail modal | SEO issues, accessibility concerns |

**URL Pattern**: `/product/[slug].html` (e.g., `/product/sunset-landscape.html`)

**Template Strategy**:
- Create base template with placeholder sections
- Each product page includes common header/footer via navigation component
- Detail data can be embedded or imported from central data file

---

## Decision 5: Image Handling

**Decision**: Separate thumbnail and full-size images with lazy loading

**Rationale**:
- Optimizes initial page load performance
- Thumbnails can be aggressively compressed (quality less critical at small size)
- Full images load only on detail page
- Native `loading="lazy"` attribute for progressive loading

**Image Structure**:
```
assets/images/gallery/
├── thumbnails/        # 600x800px (3:4 aspect, compressed)
│   └── [slug].jpg
└── full/              # Original/high-quality
    └── [slug].jpg
```

**Alternatives Considered**:
| Alternative | Why Rejected |
|-------------|--------------|
| Single image size | Poor performance, either too large for grid or too small for detail |
| CDN/image service | External dependency, against static site philosophy |
| Base64 inline images | Bloats HTML, no browser caching benefits |

---

## Decision 6: Accessibility Implementation

**Decision**: ARIA labels, keyboard navigation, focus management

**Rationale**:
- Required by FR-014 (keyboard accessible)
- Follows WCAG 2.1 AA guidelines
- Consistent with existing accessibility patterns in design system

**Implementation**:
- Filter controls: Proper `<label>` associations, `aria-label` where needed
- Gallery grid: `role="list"` with `role="listitem"` for items
- Thumbnails: Wrapped in focusable `<a>` with descriptive `alt` text
- Keyboard: Tab through filters, Enter/Space to select, Tab through gallery items

---

## Decision 7: Theme Support

**Decision**: Leverage existing temperature-based theming system

**Rationale**:
- Constitution principle III requires light/dark mode support
- Existing system uses cool accents (emerald) for light, warm (gold) for dark
- All new components use CSS variables from `_variables.css`

**Theme Considerations**:
- Filter toolbar: Use `--bg-secondary` background with `--text-primary`
- Gallery cards: Inherit from existing `.card` component
- Active filters: Use `--color-accent` for highlights
- Hover states: Follow existing opacity/transform patterns

---

## Open Items

None. All technical decisions resolved based on existing codebase patterns and constitution requirements.
