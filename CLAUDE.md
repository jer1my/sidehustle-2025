# Side Hustle Project

Project documentation for AI assistants (like Claude Code) to understand and maintain the codebase.

## Key Resources

- **Design System:** See [docs/design-system.md](docs/design-system.md) for typography, colors, components, and styling guidelines
- **Lab Page:** `lab.html` serves as a live design system showcase

## Quick Customization Checklist

**Before starting development, customize these:**
- [ ] Brand colors in `assets/css/_variables.css` (lines 11-13)
- [ ] Accent colors in `assets/css/_variables.css` (lines 16-18)
- [ ] Font families in `assets/css/_variables.css` (lines 21-23)
- [ ] Container max-width in `assets/css/_variables.css` (line 26)
- [ ] Project name in `LICENSE` and `README.md`
- [ ] Deployment directory in `.github/workflows/deploy.yml` (line 23)

## Site Architecture & Page History

**Current Homepage (January 2025):**
The index page features a horizontal scroll hero gallery with products, about, and contact sections on a single page.

**Previous Split-Screen Homepage:**
The original design featured a split-screen landing page where users could swipe/click left for "Art & Photography" (`art.html`) or right for "Digital Assets" (`digital.html`). Each side had separate landing pages with their own product galleries.

**Backup Files (untracked):**
- `index-backup.html` - Original split-screen homepage
- `art-backup.html` - Original art landing page

**Related Pages Still in Use:**
- `art.html` - Art & Photography landing page (may still be linked/accessible)
- `digital.html` - Digital Assets landing page (may still be linked/accessible)
- `shop-all.html` - Combined shop page (current Shop nav link destination)

**To Restore Split-Screen Homepage:**
1. Replace `index.html` with contents of `index-backup.html`
2. Update navigation in `navigation-component.js` to link Shop back to `#top` instead of `shop-all.html`
3. The art.html and digital.html pages should still work as destinations

**Git History:**
The split-screen design was replaced in commit `ccd7b9a` ("Redesign index page and add shop-all navigation"). Use `git show ccd7b9a` to see the full diff or `git checkout ccd7b9a~1 -- index.html` to restore the previous version.

## Navigation Component

The site navigation is managed by a single component that serves as the source of truth for all pages.

**Configuration File:** `assets/js/components/navigation-component.js`

**Current Navigation Order:**
```javascript
const NAV_CONFIG = {
    links: [
        { text: 'Home', href: 'index.html', id: 'home' },
        { text: 'Info', href: '#products', id: 'products' },
        { text: 'About', href: '#about', id: 'about' },
        { text: 'Contact', href: '#contact', id: 'contact' },
        { text: 'Shop', href: 'shop-all.html', id: 'shop-all' }
        // { text: 'Lab', href: 'lab.html', id: 'lab' }
    ]
};
```

**Hidden Links:**
- **Lab** - Currently commented out. To restore, uncomment the Lab line and add a comma after the Shop line.

**To Restore Lab Link:**
```javascript
{ text: 'Shop', href: 'shop-all.html', id: 'shop-all' },
{ text: 'Lab', href: 'lab.html', id: 'lab' }
```

**Page Detection:**
The component auto-detects the current page and:
- Sets the active state on the appropriate nav link
- Adjusts hash links (e.g., `#about`) to point back to index.html when on subpages
- Supports pages: index, lab, shop-all, art, digital

## File Organization

```
assets/css/
  main.css                 # Import file - DO NOT edit directly
  _variables.css           # [CUSTOMIZE HERE] Colors, fonts, spacing
  _base.css                # Reset & base styles
  _typography.css          # Text styles and utilities
  _grid.css                # Grid system and layout
  _components.css          # Buttons, cards, forms
  _theme.css               # Light/dark mode styles
  _utilities.css           # Helper classes (loads last)

assets/js/
  main.js                  # Core functionality
  theme.js                 # Theme switching system
  components/
    navigation-component.js  # Single source of truth for navigation

docs/
  design-system.md         # Detailed design system documentation
```

## Development Workflow

### Branch Strategy
- `main` - Production branch (auto-deploys to FTP)
- `development` - Working branch (use daily)

### Slash Commands
Available via `.claude/commands/`:
- `/status` - Show git status and recent commits
- `/quick-commit` - Commit on current branch
- `/deploy` - Commit → merge to main → push both branches

### Spec Kit Commands
For spec-driven development:
- `/speckit.constitution` - Establish project principles
- `/speckit.specify` - Create baseline specification
- `/speckit.plan` - Create implementation plan
- `/speckit.tasks` - Generate actionable tasks
- `/speckit.implement` - Execute implementation

### Deployment
- **Automatic:** Push to `main` triggers FTP deployment
- **Manual:** Use `/deploy` slash command
- **Configuration:** `.github/workflows/deploy.yml`

## Important Guidelines

**Always use CSS variables** over inline values when possible.

**Always use utility classes** instead of inline styles for better maintainability.

**When making changes:**
1. Test in both light and dark modes
2. Test on mobile, tablet, and desktop
3. Use existing CSS variables and utility classes
4. Refer to [docs/design-system.md](docs/design-system.md) for styling details

## Page Visibility System (IMPORTANT)

The site uses a page transition system where `body` starts with `opacity: 0` and fades in via JavaScript. **All new pages must include the minimum required scripts** or the page will appear blank/invisible.

**Why this exists:** Prevents flash of unstyled content during page load.

**Minimum required scripts for any new page:**
```html
<!-- Core modules -->
<script src="assets/js/core/config.js"></script>
<script src="assets/js/core/theme-system.js"></script>

<!-- Utilities (animations.js triggers the page fade-in) -->
<script src="assets/js/utils/helpers.js"></script>
<script src="assets/js/utils/animations.js"></script>

<!-- Main initialization (calls initPageTransitions) -->
<script src="assets/js/main.js"></script>
```

**For subpages (in subdirectories like `product/`):** Add `../` prefix to all script paths.

**How it works:**
1. `_base.css` sets `body { opacity: 0 }`
2. `animations.js` defines `initPageTransitions()` which adds `page-transition-in` class
3. `main.js` calls `initPageTransitions()` on DOMContentLoaded
4. CSS animation fades body to `opacity: 1`

**Safety features:**
- `main.js` uses `typeof` checks so missing optional scripts won't break the page
- CSS includes `@media (prefers-reduced-motion: reduce)` fallback that sets `opacity: 1`

**Reference templates:**
- Full page with navigation: See `index.html` or `shop-all.html`
- Minimal page (no navigation): See `product/_template.html`

## Gallery Image System

All gallery images use a standardized folder structure. Images are served from a single location per item, eliminating duplication.

**Folder Structure:**
```
assets/images/gallery/
  {slug}/
    main.jpg      # Primary image (hero, grid thumbnail, detail main)
    alt-1.jpg     # Alternate view 1
    alt-2.jpg     # Alternate view 2
    alt-3.jpg     # Alternate view 3
    alt-4.jpg     # Alternate view 4
```

**Image Specifications:**
- **Aspect ratio:** 3:4 (portrait) for all images
- **Main image:** 1200×1600px recommended
- **Alternate images:** 600×800px recommended
- **Format:** JPG (configured in `gallery-data.js`)

**How it works:**
- Image paths are generated from the item's `slug` field in `gallery-data.js`
- Helper functions: `getMainImagePath(slug)`, `getAltImagePaths(slug)`, `getAllImagePaths(slug)`
- No hardcoded image paths in gallery item data

**Adding a new gallery item:**
1. Create folder: `assets/images/gallery/{slug}/`
2. Add images: `main.jpg`, `alt-1.jpg`, `alt-2.jpg`, `alt-3.jpg`, `alt-4.jpg`
3. Add item to `galleryItems` array in `gallery-data.js` (only needs slug, no image paths)
4. Create product page: Copy `product/_template.html` to `product/{slug}.html`

**Configuration:** `assets/js/gallery/gallery-data.js` → `IMAGE_CONFIG` object

## Active Technologies
- HTML5, CSS3, Vanilla JavaScript (ES6+) + None (static site using existing CSS architecture) (001-shop-gallery-viewer)
- Static JSON data file for gallery items (no server/database) (001-shop-gallery-viewer)

## Recent Changes
- 001-shop-gallery-viewer: Added HTML5, CSS3, Vanilla JavaScript (ES6+) + None (static site using existing CSS architecture)
