# Quickstart: Shop Gallery Viewer

**Branch**: `001-shop-gallery-viewer` | **Date**: 2025-01-16

## Prerequisites

- Git repository cloned locally
- Modern web browser (Chrome, Firefox, Safari, or Edge)
- Local web server for testing (e.g., `python -m http.server` or VS Code Live Server)

## Getting Started

### 1. Switch to Feature Branch

```bash
git checkout 001-shop-gallery-viewer
```

### 2. Understand the Existing Structure

Review these key files before implementing:

| File | Purpose |
|------|---------|
| `assets/css/_variables.css` | Design tokens (colors, spacing, aspect ratios) |
| `assets/css/_components.css` | Existing component styles (cards, buttons, forms) |
| `assets/css/_grid.css` | Grid system utilities |
| `docs/design-system.md` | Complete design system documentation |
| `shop-all.html` | Target page (currently placeholder) |

### 3. Create New Files

```bash
# Create gallery JavaScript module directory
mkdir -p assets/js/gallery

# Create gallery image directories
mkdir -p assets/images/gallery/thumbnails
mkdir -p assets/images/gallery/full

# Create product detail pages directory
mkdir -p product

# Create frame preview images directory
mkdir -p assets/images/frames
```

### 4. Implementation Order

Follow this order to satisfy dependencies:

1. **Gallery Data** (`assets/js/gallery/gallery-data.js`)
   - Define categories, subcategories
   - Add initial gallery items
   - Include print and frame options

2. **Gallery CSS** (`assets/css/_components.css`)
   - Add gallery grid styles
   - Add filter toolbar styles
   - Add gallery card styles

3. **Gallery Grid** (`assets/js/gallery/gallery-grid.js`)
   - Render gallery items
   - Implement filtering logic
   - Implement sorting logic
   - Handle session state persistence

4. **Shop Page** (`shop-all.html`)
   - Replace placeholder with gallery structure
   - Add filter/sort controls
   - Import gallery scripts

5. **Detail Page Template** (`product/_template.html`)
   - Create base layout for product pages
   - Include print options display
   - Include frame options preview

6. **Individual Product Pages** (`product/[slug].html`)
   - Generate from template for each item

---

## Key Implementation Details

### Aspect Ratio

Use the existing CSS variable for 3:4 portrait ratio:

```css
.gallery-thumbnail {
  aspect-ratio: var(--hero-frame-aspect); /* 0.75 = 3:4 */
  object-fit: cover;
}
```

### Responsive Grid

Follow mobile-first pattern with existing utilities:

```css
.gallery-grid {
  display: grid;
  gap: var(--space-6);
  grid-template-columns: repeat(2, 1fr); /* Mobile: 2 columns */
}

@media (min-width: 768px) {
  .gallery-grid {
    grid-template-columns: repeat(3, 1fr); /* Tablet: 3 columns */
  }
}

@media (min-width: 1024px) {
  .gallery-grid {
    grid-template-columns: repeat(4, 1fr); /* Desktop: 4 columns */
  }
}
```

### Theme Support

Use CSS variables for colors that adapt to theme:

```css
.gallery-filter-bar {
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--color-neutral-200);
}

.gallery-card:hover {
  border-color: var(--color-accent);
}
```

### Filter State Persistence

Store filter/sort state in sessionStorage:

```javascript
// Save state
sessionStorage.setItem('gallery-filter-type', selectedType);
sessionStorage.setItem('gallery-sort', selectedSort);

// Restore state on page load
const savedType = sessionStorage.getItem('gallery-filter-type') || 'all';
const savedSort = sessionStorage.getItem('gallery-sort') || 'newest';
```

### Keyboard Accessibility

Ensure all interactive elements are keyboard accessible:

```html
<!-- Filter controls with proper labels -->
<label for="type-filter">Filter by Type</label>
<select id="type-filter" class="form-select">
  <option value="all">All</option>
  <option value="art">Art</option>
  <option value="photography">Photography</option>
</select>

<!-- Gallery items are focusable links -->
<a href="product/sunset-landscape.html" class="gallery-card" aria-label="View Sunset Over Mountains">
  <img src="..." alt="Sunset Over Mountains" loading="lazy">
  <span class="gallery-card-title">Sunset Over Mountains</span>
</a>
```

---

## Testing Checklist

### Visual Testing

- [ ] Gallery grid displays correctly at mobile width (320px)
- [ ] Gallery grid displays 3 columns at tablet width (768px)
- [ ] Gallery grid displays 4 columns at desktop width (1024px+)
- [ ] All thumbnails maintain 3:4 aspect ratio
- [ ] Gallery looks correct in light mode
- [ ] Gallery looks correct in dark mode
- [ ] Filter/sort controls are visible and styled correctly

### Functional Testing

- [ ] Type filter shows only matching items
- [ ] Sub-category filter narrows results correctly
- [ ] Sort "Newest" shows most recent first
- [ ] Sort "Title A-Z" orders alphabetically
- [ ] Filter state persists after page reload
- [ ] Clicking thumbnail navigates to detail page
- [ ] Detail page shows correct item information

### Accessibility Testing

- [ ] All form controls have visible labels
- [ ] Gallery items are keyboard focusable
- [ ] Tab order is logical
- [ ] Focus states are visible
- [ ] Images have descriptive alt text

### Edge Cases

- [ ] Empty filter results show "No items found" message
- [ ] Long titles truncate with ellipsis
- [ ] Missing images show placeholder

---

## Common Issues

### Images Not Displaying

- Verify image paths are relative to the HTML file
- Check that images exist in `assets/images/gallery/thumbnails/`
- Ensure file extensions match (case-sensitive on some servers)

### Filter Not Working

- Verify `type` and `subCategory` values in data match filter options exactly
- Check browser console for JavaScript errors
- Ensure gallery-grid.js is loaded after gallery-data.js

### Styling Issues

- Clear browser cache to load updated CSS
- Check CSS import order in `main.css` (utilities must be last)
- Verify you're using CSS variables, not hardcoded values

---

## Next Steps

After completing implementation:

1. Run `/speckit.tasks` to generate detailed task breakdown
2. Test across all breakpoints and themes
3. Validate against specification requirements
4. Update `docs/design-system.md` with new gallery components
