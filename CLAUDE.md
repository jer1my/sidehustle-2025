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
- Sets the active state on the appropriate nav link (or cart icon on the cart page)
- Adjusts hash links (e.g., `#about`) to point back to index.html when on subpages
- Supports pages: index, lab, shop-all, cart, art, digital

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
  gallery/
    gallery-data.js          # AUTO-GENERATED — do not edit
  components/
    navigation-component.js  # Single source of truth for navigation

build/
  build.js                 # Build script — generates gallery-data.js + product pages
  convert-to-webp.js       # Converts PNGs → WebP + generates Lanczos thumbnails
  shared-config.json       # Categories, purchase options, IMAGE_CONFIG

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
- **Manual:** Use `/deploy` slash command (updates cache busting on all assets, rebuilds product pages, commits, merges to main, pushes)
- **Configuration:** `.github/workflows/deploy.yml`

## Important Guidelines

**Always use CSS variables** over inline values when possible.

**Always use utility classes** instead of inline styles for better maintainability.

**All pages must use `--container-max-width` (1200px) as their max-width.** Do not hardcode narrower widths on page containers. Every page (shop, cart, product detail, etc.) should feel the same width. The single source of truth is `--container-max-width` in `_variables.css`.

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
<script src="assets/js/core/config.js?v=TIMESTAMP"></script>
<script src="assets/js/core/theme-system.js?v=TIMESTAMP"></script>

<!-- Utilities (animations.js triggers the page fade-in) -->
<script src="assets/js/utils/helpers.js?v=TIMESTAMP"></script>
<script src="assets/js/utils/animations.js?v=TIMESTAMP"></script>

<!-- Main initialization (calls initPageTransitions) -->
<script src="assets/js/main.js?v=TIMESTAMP"></script>
```

**IMPORTANT:** All `<script src>` and `<link rel="stylesheet" href>` tags for local assets MUST include a `?v=TIMESTAMP` query parameter for cache busting. The `/deploy` command automatically updates these values across all root HTML files. For product pages, use `?v={{CACHE_VERSION}}` in the template — the build script replaces it with `Date.now()`.

**For subpages (in subdirectories like `product/`):** Add `../` prefix to all script paths.

**Inline theme script (REQUIRED in every page):**
Every page must include this script immediately after `<body>` to prevent theme flash during navigation:
```html
<script>
    // Apply theme immediately to prevent flash
    (function() {
        document.documentElement.style.backgroundColor = '#171717';
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.removeAttribute('data-theme');
            document.documentElement.style.backgroundColor = '#fafafa';
        } else {
            document.body.setAttribute('data-theme', 'dark');
        }
    })();
</script>
```
The dark background is set first (before localStorage check) since dark is the default theme. This eliminates any white flash between page transitions.

**How it works:**
1. Inline script sets `<html>` background to dark immediately, then checks localStorage
2. `_base.css` sets `body { opacity: 0 }`
3. `animations.js` defines `initPageTransitions()` which adds `page-transition-in` class
4. `main.js` calls `initPageTransitions()` on DOMContentLoaded
5. CSS animation fades body to `opacity: 1`

**Safety features:**
- `main.js` uses `typeof` checks so missing optional scripts won't break the page
- CSS includes `@media (prefers-reduced-motion: reduce)` fallback that sets `opacity: 1`

**Reference templates:**
- Full page with navigation: See `index.html` or `shop-all.html`
- Minimal page (no navigation): See `product/_template.html`

## Gallery Image System

All gallery images use a standardized folder structure. Each gallery item is fully self-contained in its own folder with an `item.json` file alongside its images.

**Folder Structure:**
```
assets/images/gallery/
  {slug}/
    item.json              # All metadata (title, description, category, etc.)
    main.png               # Primary image — dark/default theme (SOURCE)
    main-light.png         # Primary image — light theme variant (optional SOURCE)
    alt-1.png              # Carousel slide 2 (SOURCE)
    alt-1-light.png        # Carousel slide 2 — light variant (optional SOURCE)
    alt-2.png              # ...more slides
    alt-11.png             # Carousel slide 12
    main.webp              # AUTO-GENERATED — WebP conversion of main.png
    alt-1.webp             # AUTO-GENERATED — WebP conversion of alt-1.png
    thumb-main.webp        # AUTO-GENERATED — 300×400 Lanczos thumbnail
    thumb-alt-1.webp       # AUTO-GENERATED — 300×400 Lanczos thumbnail
    ...
```

**Source images are PNG.** The build pipeline converts them to WebP and generates pre-rendered thumbnails. Only PNGs need to be created manually — all `.webp` and `thumb-*.webp` files are auto-generated by `npm run convert`.

The carousel supports up to 12 slides (main + 11 alts). If a `-light` variant exists, it is shown when the site is in light mode; otherwise the base image is used for both themes.

**Aspect Ratio Images** control which purchase options appear:
- `main-square.png` → enables "Square" option
- `main-portrait.png` → enables "Portrait" option
- `main-landscape.png` → enables "Landscape" option
- If none are provided, all three ratios show by default

**Image Specifications:**
- **Aspect ratio:** 3:4 (portrait) for all images
- **Main image:** 1200×1600px recommended
- **Alternate images:** 600×800px recommended
- **Source format:** PNG (drop into gallery folders)
- **Served format:** WebP (auto-converted by `npm run convert`)
- **Thumbnails:** 300×400px WebP, generated with Lanczos3 resampling for high-quality downscaling (used on shop grid cards and carousel thumbnail strip)

**item.json structure:**
```json
{
  "id": "gal-001",
  "title": "Sunset Over Mountains",
  "slug": "sunset-mountains",
  "type": "photography",
  "subCategory": "landscape",
  "dateCreated": "2024-12-15",
  "description": "Short description for cards.",
  "longDescription": "Longer description for the detail page.",
  "featured": true
}
```

**Build System:**
- `gallery-data.js` and `product/*.html` are auto-generated — **DO NOT EDIT** them directly
- Source of truth: `assets/images/gallery/*/item.json` + `build/shared-config.json`
- Build script: `build/build.js` (run via `npm run build`)
- Categories, purchase options, and image config live in `build/shared-config.json`

**Adding a new gallery item:**
1. Create folder: `assets/images/gallery/{slug}/`
2. Add PNG images: `main.png`, `alt-1.png` through `alt-11.png` (carousel uses all that exist)
3. Optionally add light variants: `main-light.png`, `alt-1-light.png`, etc.
4. Create `item.json` with the metadata above
5. Optionally add aspect ratio images: `main-square.png`, `main-portrait.png`, `main-landscape.png`
6. Run `npm run convert` — generates WebP files + Lanczos thumbnails from PNGs
7. Run `npm run build` — generates `gallery-data.js` and `product/{slug}.html`
8. Done — shop grid uses thumbnails, carousel uses full WebP, detail strip uses thumbnails

**Theme-aware image helpers:**
- `getMainImagePath(slug)` / `getAllImagePaths(slug)` — returns dark/default full-size images
- `getMainImagePathForTheme(slug, theme)` / `getAllImagePathsForTheme(slug, theme)` — returns theme-appropriate full-size images
- `getThumbImagePathForTheme(slug, theme)` — returns pre-rendered thumbnail for main image (used by shop grid cards)
- `getThumbSlidePathsForTheme(slug, theme)` — returns thumbnails for all slides (used by carousel thumbnail strip)
- All thumbnail helpers fall back to full-size images if no thumbnail exists
- Frontend components listen for `themechange` event to swap images live

## Product Detail Page

The product detail page (`product/{slug}.html`) features:

**Image Carousel:**
- Auto-advancing carousel (4.5s interval) with all available images (main + alts)
- Synced thumbnail strip below with active highlight always centered
- Prev/next arrows on thumbnail strip navigate the carousel
- Touch swipe support on mobile; auto-advance pauses on interaction (resumes after 8s)
- Pauses when page is hidden (Visibility API)
- Crossfade transition (0.25s) when theme changes — all slides and thumbnails swap simultaneously

**Frame Color ↔ Theme Sync:**
- Selecting **White Frame** automatically switches the site to light mode
- Selecting **Black Frame** automatically switches to dark mode
- Theme toggle hint below the frame selector reminds users they can preview the other frame color
- All carousel images (slides + thumbnails) crossfade to the theme-appropriate variants
- Carousel auto-navigates to the matching frame slide when a frame color is selected

**Aspect Ratio ↔ Carousel Interaction:**
- Selecting a purchase option (digital, print, framed) pauses auto-advance and navigates to the relevant carousel slide
- Framed orientation options (portrait/landscape) are filtered based on which aspect ratio images actually exist for that item
- If an item has no aspect ratio images, all options show by default

**Cart UX:**
- "Add to Cart" button uses `btn-accent` (primary) styling
- After adding: button briefly shows "Added!" (1.5s), then transitions to persistent state:
  - "This item is in your cart" bold notice appears above the button
  - Button changes to "Add Another" with `btn-secondary` (outlined) styling
  - "Go to Cart" button appears below as `btn-accent` (primary)
- State persists on page load via `isInCart()` check against localStorage

**Key files:**
- `assets/js/gallery/gallery-detail.js` — Carousel logic, purchase options, cart UX
- `assets/js/gallery/gallery-data.js` — Item data, purchase options, image path helpers
- `assets/js/cart/cart.js` — Cart state management (localStorage)

## Active Technologies
- HTML5, CSS3, Vanilla JavaScript (ES6+) + None (static site using existing CSS architecture) (001-shop-gallery-viewer)
- Static JSON data file for gallery items (no server/database) (001-shop-gallery-viewer)

## Recent Changes
- **WebP image format:** Gallery images now served as WebP (converted from PNG sources via `npm run convert`). ~90% filesize reduction. Source PNGs are preserved — configured in `build/shared-config.json`
- **Pre-rendered thumbnails:** All gallery images get 300×400px Lanczos3-resampled thumbnails (`thumb-*.webp`), eliminating browser downscaling artifacts. Used by shop grid cards and carousel thumbnail strip. Carousel thumbnails capped at 300px max-width to prevent upscaling
- **Two-step build pipeline:** `npm run convert` (PNG → WebP + thumbnails) then `npm run build` (generate gallery-data.js + product pages). Both steps needed when adding new images
- **Cache busting:** All local JS/CSS asset references across every page now include `?v=TIMESTAMP` query params, updated automatically by `/deploy`. Product pages use `{{CACHE_VERSION}}` in the template, replaced by `build.js`
- **Build system:** Gallery data and product pages are now auto-generated from `item.json` files via `npm run build`. Requires `sharp` npm dependency for image conversion
- **Light/dark image variants:** Add `-light` suffix images for theme-aware display (e.g., `main-light.png`)
- **`themechange` event:** `theme-system.js` now dispatches a custom event when theme toggles, used by gallery components
- Added 12-slide image carousel with synced thumbnail strip to product detail pages
- Added cart UX flow: "Added!" confirmation → "This item is in your cart" notice → "Add Another" / "Go to Cart" buttons
- Fixed white flash on page transitions by setting `<html>` background in inline theme script (dark-first default)
- Added cart page active state to navigation component (desktop icon + mobile link)
- All pages use `--container-max-width` for consistent widths
