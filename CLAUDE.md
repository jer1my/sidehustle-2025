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

**Current Homepage:**
The index page features a horizontal scroll hero gallery (6 slots, fills with placeholders if fewer items exist) with about and contact sections below. A "Shop All" button sits right-aligned under the hero description text. The scroll arrow is `position: absolute; bottom: 24px` inside `.hero` (direct child, not inside `.hero-horizontal-container`). JS adds `.scroll-arrow--hidden` (visibility: hidden + kills bounce animation) when scrolling past 20% of hero height to prevent WebKit compositing ghost artifacts. On mobile, the hero description is truncated to the first sentence only ("I work across digital art, traditional mediums, and photography.") — the rest is wrapped in `.hero-description-desktop` and hidden below 768px.

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
        { text: 'About', href: '#about', id: 'about' },
        { text: 'Contact', href: '#contact', id: 'contact' },
        { text: 'Shop', href: 'shop-all.html', id: 'shop-all' },
        { text: 'Blog', href: 'blog.html', id: 'blog' }
        // { text: 'Lab', href: 'lab.html', id: 'lab' }
    ]
};
```

**Hidden Links:**
- **Lab** - Currently commented out. To restore, uncomment the Lab line and add a comma after the Blog line.

**Page Detection:**
The component auto-detects the current page and:
- Sets the active state on the appropriate nav link (or cart icon on the cart page)
- Adjusts hash links (e.g., `#about`) to point back to index.html when on subpages
- Supports pages: index, lab, shop-all, blog, blog-post, cart, art, digital
- **Blog post pages** (`blog/*.html`) are detected as `blog-post` — all nav links get `../` prefix so they resolve correctly from the subdirectory. The Blog link stays active and points to `../blog.html`.

**Nav pointer-events fix:**
The `.nav` element uses `pointer-events: none` with `pointer-events: auto` on `.nav-container`. This prevents the nav's transparent gradient tail from blocking clicks on content below it.

**Mobile nav breakpoint:**
The hamburger menu activates at `max-width: 1024px` (not 768px), so tablets and smaller all get the mobile navigation.

## File Organization

```
assets/css/
  main.css                 # Import file - DO NOT edit directly
  _variables.css           # [CUSTOMIZE HERE] Colors, fonts, spacing
  _base.css                # Reset & base styles
  _typography.css          # Text styles and utilities
  _grid.css                # Grid system and layout
  _components.css          # Buttons, cards, forms, blog styles
  _hero.css                # Hero scroller and placeholder frames
  _navigation.css          # Nav bar (fixed, gradient, pointer-events fix)
  _theme.css               # Light/dark mode styles
  _utilities.css           # Helper classes (loads last)

assets/js/
  main.js                  # Core functionality
  gallery/
    gallery-data.js          # AUTO-GENERATED — do not edit
    gallery-detail.js        # Product detail page (carousel, purchase, cart UX)
    gallery-grid.js          # Shop grid (filtering, sorting, placeholders)
    hero-gallery.js          # Homepage hero scroller (fills placeholders)
    product-card.js          # Shared product card component
  blog/
    blog-data.js             # AUTO-GENERATED — do not edit
    blog-detail.js           # Blog post page (carousel, related item)
    blog-grid.js             # Blog listing (filtering, sorting)
    blog-card.js             # Blog card component
  components/
    navigation-component.js  # Single source of truth for navigation

assets/content/blog/         # Blog posts (folder per post) — post.json, images, and thumbnails all together
assets/images/gallery/       # Gallery images (folder per item)

build/
  build.js                 # Gallery build — generates gallery-data.js + product pages
  build-blog.js            # Blog build — generates blog-data.js + blog post pages
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

### npm Scripts
```
npm run convert     # PNG → WebP + Lanczos thumbnails (gallery + blog images)
npm run build       # Generate gallery-data.js + product pages
npm run build:blog  # Generate blog-data.js + blog post pages
npm run build:all   # Run build + build:blog together
```

### Deployment
- **Automatic:** Push to `main` triggers FTP deployment
- **Manual:** Use `/deploy` slash command (updates cache busting on all assets, rebuilds product pages, commits, merges to main, pushes)
- **Configuration:** `.github/workflows/deploy.yml`

## Important Guidelines

**Always use CSS variables** over inline values when possible.

**Always use utility classes** instead of inline styles for better maintainability.

**All pages must use `--container-max-width` (1200px) as their max-width.** Do not hardcode narrower widths on page containers. Every page (shop, cart, product detail, etc.) should feel the same width. The single source of truth is `--container-max-width` in `_variables.css`.

**`overflow-x: hidden` must be on `html`, NOT `body`.** On iOS WebKit (Chrome and Safari), `overflow-x: hidden` on `body` breaks `position: fixed` elements during address bar animation. This was the root cause of the close button scrolling off screen. The rule lives in `_base.css`.

**When making changes:**
1. Test in both light and dark modes
2. Test on mobile, tablet, and desktop (user tests on **Chrome for iOS** — dev tools mobile emulation may not reproduce iOS-specific bugs)
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

**IMPORTANT:** All `<script src>` and `<link rel="stylesheet" href>` tags for local assets MUST include a `?v=TIMESTAMP` query parameter for cache busting. The `/deploy` command automatically updates these values across all root HTML files and ES module `import` statements in JS files. For product pages, use `?v={{CACHE_VERSION}}` in the template — the build script replaces it with `Date.now()`.

**ES module imports also need `?v=` cache busting.** Files like `gallery-detail.js` import from `./gallery-data.js?v=TIMESTAMP`. Without the version param, browsers serve stale data from immutable cache even after new items are added. The `/deploy` command updates these automatically.

**Critical mobile CSS must be inlined in HTML.** External CSS loaded via `@import` in `main.css` is unreliable on mobile browsers due to aggressive caching that ignores server headers. Any mobile-critical layout overrides (like single-column grid on blog.html) should be placed in the page's inline `<style>` block, not solely in external CSS partials. HTML files are always served fresh (`no-cache`), so inline styles take effect immediately.

**For subpages (in subdirectories like `product/` or `blog/`):** Add `../` prefix to all script and asset paths.

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
- Full page with navigation: See `index.html`, `shop-all.html`, or `blog.html`
- Subpage with navigation: See `blog/_template.html`
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

**Aspect Ratio Images** control which purchase options appear. The build detects available ratios by scanning all dark image filenames for the keywords `square`, `portrait`, or `landscape`:
- Any file containing `square` (e.g., `01-print-square.png`) → enables Square options
- Any file containing `portrait` → enables Portrait options
- Any file containing `landscape` → enables Landscape options
- If no such filenames exist, all three ratios show by default

**Purchase option cards are filtered at render time** based on what's detected:
- `framed-square` card is hidden unless `square` is in the available ratios
- `framed-rect` card is hidden if no frame orientations are available
- Digital/print sub-option pills are filtered to only available ratios

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
  "title": "Piece Title",
  "slug": "piece-slug",
  "type": "art",
  "subCategory": "digital",
  "dateCreated": "2025-03-15",
  "description": "Short description for cards.",
  "longDescription": "First paragraph.\n\nSecond paragraph.",
  "featured": true,
  "aiAssisted": true,
  "tools": "Pen & ink on toned paper"
}
```

- `longDescription` (optional) — longer text for the detail page. Supports paragraph breaks: double newlines (`\n\n`) in the JSON string are rendered as separate `<p>` tags on the detail page.
- `aiAssisted` (optional, default `false`) — when `true`, displays a pill-shaped badge ("AI Assisted") in the accent color on the product card (upper-right corner) and inline next to the category label on the detail page. Use this to transparently label any work that utilized AI in its creation.
- `tools` (optional, free-text string) — describes the medium, materials, software, or gear used to create the piece. Displayed in italic secondary text between the category label and description on the detail page. Works across all types: traditional art ("Toned paper, Microns, & White Jelly Roles"), digital ("Tools: Midjourney & Photoshop"), photography ("Tools: Sony a1 II & Sony FE 600mm f/4 G OSS"). Omit or leave empty to hide.

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
- Touch swipe support on mobile; auto-advance pauses on interaction (resumes after 8s)
- Pauses when page is hidden (Visibility API)
- Crossfade transition (0.25s) when theme changes — all slides and thumbnails swap simultaneously
- **Images column is sticky on desktop** (`position: sticky`) so the carousel pins to the top while product info scrolls. Disabled on mobile (single column).
- **No max-height constraint** — carousel fills the full column width, aspect ratio maintained by `aspect-ratio: 3/4`

**Carousel Arrow Styling (shared across product detail and blog):**
- Half-moon positioned — arrow circle center aligns with the image edge, half overlapping the image and half outside. Uses `position: absolute` with negative offset so no layout shift occurs
- Solid opaque background matching page color (`var(--bg-primary)`) — no transparency
- On hover: background changes to `var(--color-accent)`, arrow stroke inverts to `var(--bg-primary)`
- Thumbnail strip arrows use the same style but smaller (28px vs 40px), also half-moon positioned on the strip edges
- Arrows hidden on mobile (touch swipe used instead)
- Blog carousel hides arrows entirely when only 1 image exists

**Frame Color ↔ Theme Sync:**
- Selecting **White Frame** automatically switches the site to light mode
- Selecting **Black Frame** automatically switches to dark mode
- Theme toggle hint below the frame selector reminds users they can preview the other frame color
- All carousel images (slides + thumbnails) crossfade to the theme-appropriate variants
- Carousel auto-navigates to the matching frame slide when a frame color is selected
- **Mobile:** Smooth-scrolls to carousel on every frame color switch so user sees the change

**Theme Preview Toggle:**
- All purchase option types (digital, print, framed) include a light/dark mode toggle so users can preview the artwork in either theme
- For framed options: text says "Preview updates automatically with frame selection" (since frame color auto-switches theme)
- For digital/print: text says "Preview in light/dark mode" with a clickable sun/moon icon
- Icon and text update dynamically when theme changes

**Aspect Ratio ↔ Carousel Interaction:**
- Selecting a purchase option (digital, print, framed) pauses auto-advance and navigates to the relevant carousel slide
- Digital slides match by ratio keyword, excluding "print" and "frame" filenames
- Print slides match by ratio keyword + "print" in filename, excluding "frame" filenames
- Frame slides match by "frame" + shape keyword in filename
- Default aspect ratio order: Portrait → Landscape → Square (portrait is default selection)
- Framed orientation options (portrait/landscape) are filtered based on which aspect ratio images actually exist for that item
- If an item has no aspect ratio images, all options show by default
- Carousel navigates to matching slide on initial page load (not just on click)

**Cart UX:**
- "Add to Cart" button uses `btn-accent` (primary) styling
- After adding: button briefly shows "Added!" (1.5s), then transitions to persistent state:
  - "This item is in your cart" bold notice appears above the button
  - Button changes to "Add Another" with `btn-secondary` (outlined) styling
  - **"Checkout"** button (bold) appears below as `btn-accent` (primary), links to cart
- State persists on page load via `isInCart()` check against localStorage

**Close Button:**
- Lives inside a `.product-close-overlay` wrapper div (zero-size, `position: fixed`, `pointer-events: none`)
- Button itself is `position: absolute` inside the overlay with `pointer-events: auto`
- **Why the overlay pattern:** On iOS Chrome, `position: fixed` elements break during address bar collapse animation when scrolling down. Wrapping in a fixed overlay container avoids this. Do NOT move the button out of the overlay or make it directly `position: fixed`.
- On scroll (>20px): transitions to accent-colored circle with inverted X color (`gallery-detail.js` adds `product-close-btn--scrolled` class)
- JS listener uses passive scroll event with a boolean gate to avoid redundant class toggles

**Key files:**
- `assets/js/gallery/gallery-detail.js` — Carousel logic, purchase options, cart UX, close button scroll
- `assets/js/gallery/gallery-data.js` — Item data, purchase options, image path helpers
- `assets/js/cart/cart.js` — Cart state management (localStorage)

## Cart Page

The cart page (`cart.html`) shows all items added to the cart with option-specific images.

**Cart item images:**
- Images match the selected purchase option — framed items show the frame slide, digital/print show the aspect ratio variant
- Uses pre-rendered thumbnails (not full-size images) for crisp display at cart image size
- Aspect ratio of the image adapts: square selections show 1:1, landscape 4:3, portrait 3:4
- Theme-aware — images swap on theme toggle

**Cart summary:**
- "Shipping & Tax" line with **"Calculated at checkout"** in bold accent color, pulsing indefinitely (3s cycle) to draw attention
- Subtotal shows item count and total price

**Payment notice (temporary):**
- Below the summary, a notice explains that online payments are coming soon
- "Email Your Order" button opens the user's email client with a pre-filled mailto link to `sidehustle.purchases@gmail.com` containing all order details (items, options, sizes, frame colors, quantities, prices, subtotal)
- Notes that payment can be arranged through PayPal, Venmo, or Zelle
- This section should be removed once payment processing is integrated

**Key files:**
- `assets/js/cart/cart-page.js` — Cart page rendering, order mailto builder
- `assets/js/cart/cart.js` — Cart state management (localStorage)
- `cart.html` — Cart page HTML

## Blog System

The blog follows the same folder-based, template-driven pattern as the gallery. Each post is a self-contained folder with metadata JSON (including inline content) and images all together.

**Folder Structure:**
```
assets/content/blog/
  _template/              # Example post for reference (skipped by build)
    post.json
  {slug}/                 # One folder per blog post — everything in one place
    post.json             # Post metadata + content (HTML in "content" field)
    cover.png             # Featured image (optional, SOURCE)
    cover-light.png       # Light theme variant (optional SOURCE)
    img-1.png             # Additional carousel image (optional SOURCE)
    img-2.png             # ...more images
    *.webp / thumb-*.webp # AUTO-GENERATED by npm run convert
```

**post.json structure:**
```json
{
  "id": "blog-001",
  "title": "Post Title",
  "slug": "post-slug",
  "datePublished": "2026-03-20",
  "category": "process",
  "excerpt": "Summary for listing page.",
  "relatedItem": "hairy-styles",
  "coverPosition": "center 25%",
  "content": "<p>Article body as an HTML string.</p><h2>Section</h2><p>More content...</p>"
}
```

- `content` — HTML string of the post body (h2/h3 for sections, no h1). Inlined into the generated page at build time (no runtime fetch, SEO-friendly). Replaces the former separate `content.html` file
- `relatedItem` (optional) — slug of a gallery item. When images exist, shows a full-width "View in Shop" button below the carousel. When no images, shows a related card in the content column
- `category` — for filtering (e.g., "process", "inspiration", "technique")
- `coverPosition` (optional, default `"center"`) — controls `background-position` of the cover image on the blog listing card. Use this to frame the important part of the image within the card's 16:9 crop. Values:
  - `"center 0%"` — shows the very top of the image
  - `"center 25%"` — shows upper quarter (good for faces/subjects near top)
  - `"center"` or `"center 50%"` — centered (default)
  - `"center 75%"` — shows lower portion
  - `"center 100%"` — shows the very bottom
  - Any valid CSS `background-position` value works (e.g., `"left top"`, `"right center"`)

**Build System:**
- `blog-data.js` and `blog/*.html` are auto-generated — **DO NOT EDIT** them directly
- Build script: `build/build-blog.js` (run via `npm run build:blog`)
- Content is inlined at build time from the `content` field in `post.json` (no runtime fetch)

**Adding a new blog post:**
1. Create folder: `assets/content/blog/{slug}/`
2. Add `post.json` with metadata and `content` field (HTML body, h2/h3 for sections, no h1)
3. Optionally drop `cover.png` and any `img-*.png` into the same folder
4. Run `npm run convert` (if images added)
5. Run `npm run build:blog`

**Blog post page layout:**
- Full-width header (title, category pill, date) at top
- Two-column layout when images exist: article content on left, sticky carousel on right (380px max)
- Single column when no images — carousel column hidden entirely
- Carousel reuses the same product carousel component (auto-advance, thumbnails, swipe, theme switching)
- Carousel arrows hidden when only 1 image (no prev/next needed)
- Thumbnail strip only appears when 2+ images exist
- Thumbnail strip height constrained within blog posts (80px max)
- "View in Shop" button appears below carousel when `relatedItem` is set

**Blog listing page (`blog.html`):**
- Card grid using `.gallery-grid` (2/3/4 column responsive)
- Category filter + sort (newest/oldest)
- Cards: cover image (if exists) + category pill + title + excerpt + date
- Cards have subtle background (`--color-neutral-100` light / `--color-neutral-800` dark), no border until hover
- Equal height cards (flexbox column, date pushed to bottom)
- Filter state persisted in sessionStorage

**Key files:**
- `build/build-blog.js` — Blog build script
- `blog/_template.html` — Post page template
- `blog.html` — Blog listing page
- `assets/js/blog/blog-data.js` — AUTO-GENERATED post data
- `assets/js/blog/blog-grid.js` — Listing page (cards, filters, sort)
- `assets/js/blog/blog-card.js` — Blog card component
- `assets/js/blog/blog-detail.js` — Post page (header, carousel, related item)

## Placeholder System (Hero & Shop Grid)

When fewer than 6 gallery items exist, both the homepage hero scroller and shop grid fill remaining slots with placeholder frames.

- **Placeholder appearance:** Subtle background color offset from page background (`--color-neutral-200` light / `--color-neutral-800` dark)
- **"More Coming Soon"** text centered in each placeholder, colored `--color-neutral-400` (light) / `--color-neutral-600` (dark)
- **Hero scroller** always shows 6 slots (real items + placeholders)
- **Shop grid** always shows at least 6 slots
- **Hero uses full-size images** (`useFullImage: true` on product cards) — not thumbnails, since the scroller displays them large
- Placeholders automatically disappear as real gallery items are added

## AI Assisted Badge

Items with `"aiAssisted": true` in their `item.json` display a pill-shaped badge for transparency.

- **Product cards:** Badge appears in upper-right corner, absolutely positioned
- **Detail page:** Badge appears inline next to the category label (e.g., "Digital Art `AI Assisted`")
- **Styling:** Uses `--color-accent` (emerald green in light mode, gold in dark mode), `--bg-primary` text, fully rounded (`border-radius: var(--radius-full)`)
- **CSS class:** `.ai-assisted-badge` (card), `.ai-assisted-badge--inline` (detail page)

## Active Technologies
- HTML5, CSS3, Vanilla JavaScript (ES6+) + None (static site using existing CSS architecture) (001-shop-gallery-viewer)
- Static JSON data file for gallery items (no server/database) (001-shop-gallery-viewer)

## SEO Setup

**Files:**
- `robots.txt` — allows all crawlers, disallows cart/checkout/lab, points to sitemap
- `sitemap.xml` — AUTO-GENERATED by `npm run build:sitemap` (included in `build:all`)
- `assets/images/og-preview.jpg` — sitewide social preview image (2400×1260px)

**What's in place on every page:**
- `<meta name="description">` — unique per page
- `<meta property="og:*">` — Open Graph for Facebook/LinkedIn/iMessage
- `<meta name="twitter:*">` — Twitter Card tags
- `<link rel="canonical">` — prevents duplicate content indexing
- `<meta name="robots" content="noindex, nofollow">` — on cart.html and checkout-success.html

**Structured data (JSON-LD):**
- `index.html` — `Organization` schema (name, URL, logo, founder)
- `product/*.html` — `Product` schema (name, description, image, price range, availability) — injected by `build/build.js`
- `blog/*.html` — `BlogPosting` schema (headline, author, publisher, datePublished) — injected by `build/build-blog.js`

**Sitemap generation:**
- Run automatically as part of `npm run build:all`
- Also available standalone: `npm run build:sitemap`
- Includes: homepage, shop, blog listing, all product pages, all blog post pages
- Uses `dateCreated` from `item.json` and `datePublished` from `post.json` as `<lastmod>`
- Submit `https://www.sidehustle.llc/sitemap.xml` to Google Search Console

## Recent Changes
- **Mobile nav breakpoint:** Hamburger menu now activates at `max-width: 1024px` (was 768px) so tablets get mobile nav
- **Scroll arrow positioning:** Arrow is `position: absolute; bottom: 24px` inside `.hero` (direct child, not inside `.hero-horizontal-container`). `.scroll-arrow--hidden` class toggled by `navigation.js` at 20% hero scroll — uses `visibility: hidden` and `animation: none !important` to prevent WebKit compositing ghost artifacts on iOS Chrome/Safari
- **Cache control (.htaccess):** HTML files served with `no-cache, must-revalidate` so users always get fresh content. Static assets (JS/images) cached for 1 year with `immutable` — `?v=` cache busting handles versioning. CSS files and auto-generated data files (`gallery-data.js`, `blog-data.js`) are excluded from immutable caching (`no-cache`) because `@import` and ES module `import` paths can't reliably carry `?v=` params on mobile browsers
- **Shop All button on homepage:** `btn-accent` button right-aligned under hero description text inside `.hero-content`. Uses `.hero-shop-btn.button` selector for specificity over `.button { margin-right: 16px }` in `_components.css`
- **Mobile hero text truncation:** Hero description shortened on mobile — only first sentence shown. Extended text wrapped in `.hero-description-desktop` span, hidden below 768px
- **Sticky product images column:** `.product-images-column` uses `position: sticky; top: 64px; align-self: start` on desktop so carousel pins while product info scrolls. Reset to `position: static` on mobile
- **Carousel max-height removed:** `--product-image-max-height: 70vh` constraint removed from `.product-carousel__container` so images fill full column width
- **Detail page paragraph breaks:** `longDescription` now splits on double newlines (`\n\n`) into separate `<p class="product-description">` tags via `gallery-detail.js`
- **Who's Looking at Hoo:** New wildlife photography piece (juvenile barn owl, Sony a1 II & 600mm f/4)
- **Tools field prefix:** Existing items updated to include "Tools:" prefix in the `tools` field value
- **Tools field:** Added `tools` (optional free-text string) to `item.json` for describing medium, materials, software, or gear. Displayed in italic secondary text (`.product-tools`) between category and description on detail page. Build passes it through to `gallery-data.js`.
- **Product cards — details below image:** Card overlay removed. Title and category always visible below the image in normal document flow. "View Details" CTA hidden (`display: none`). On mobile (`hover: none`), overlay is fully hidden. Hero scroller cards use `overflow: visible` on `.gallery-frame.product-card` with details absolutely positioned below via `top: 100%`.
- **Close button overlay pattern:** Close button wrapped in `.product-close-overlay` (fixed, zero-size, pointer-events none) to survive iOS Chrome address bar animation. Button is `position: absolute` inside with `pointer-events: auto`. Transitions to accent circle on scroll via JS class toggle.
- **Mobile carousel fixes:** Thumbnail items use explicit `width: 60px; height: 80px` with `aspect-ratio: unset` on mobile to prevent iOS Safari/Chrome collapsing them to zero. Thumbnail strip has `min-height: 70px` and `overflow: visible`. Carousel container `max-height` removed on mobile so it fills full width.
- **Frame color mobile scroll:** On mobile, switching frame color (black/white) smooth-scrolls to the carousel so user sees the change.
- **iOS fixed positioning fix:** `overflow-x: hidden` moved from `body` to `html` in `_base.css` — prevents iOS WebKit from breaking `position: fixed` during address bar collapse.
- **Hero overflow fix:** `.hero-horizontal-container` uses `overflow-x: hidden; overflow-y: visible` so card details below frames aren't clipped.
- **SEO foundation:** Added `robots.txt`, auto-generated `sitemap.xml` (`npm run build:sitemap`, part of `build:all`), canonical tags on all pages, `noindex` on cart/checkout, Organization JSON-LD on homepage, Product JSON-LD on product pages, BlogPosting JSON-LD on blog posts. Submit sitemap to Google Search Console.
- **Blog unified folder structure:** Blog images moved back into `assets/content/blog/{slug}/` alongside `post.json`. Content HTML now stored in the `content` field of `post.json` instead of a separate `content.html` file. Single folder per post for simpler workflow.
- **Purchase option filtering:** `framed-square` card is hidden when no square images exist for an item; `framed-rect` hidden when no frame orientations available. Detection is based on filenames containing `square`/`portrait`/`landscape` keywords — no separate `main-square.png` files required.
- **Same-day gallery sort order:** Build script captures `item.json` mtime as `dateAdded` and stores it in `gallery-data.js`. Gallery grid uses it as a tiebreaker when two items share the same `dateCreated` date, preserving the order items were added even within a single day.
- **Theme preview on all purchase options:** Digital/print options now include a light/dark mode toggle ("Preview in light/dark mode") alongside the aspect ratio pills, matching the existing frame color theme hint
- **Aspect ratio slide matching:** Digital, print, and frame slides now correctly distinguished by filename keywords — digital excludes "print" and "frame", print requires "print", frame requires "frame"
- **Default aspect ratio:** Portrait is now the default selection for digital/print (order: Portrait → Landscape → Square)
- **Initial carousel navigation:** Carousel now jumps to the correct slide on page load, not just on user interaction
- **Image swap on theme change:** Removed crossfade opacity animation that caused white flash when switching themes on product detail; images now swap instantly
- **White flash fix:** Added early `<script>` in `<head>` of all pages to set `<html>` background color before CSS loads. Fixed stray character before `<!DOCTYPE html>` in shop-all.html that caused quirks mode
- **Dark-first critical CSS:** All pages' inline critical styles (nav gradient, logo SVG) now default to dark and override for light via `body:not([data-theme="dark"])`, matching the site's dark-first approach
- **Carousel arrows redesigned:** Solid opaque background matching page color, half-moon positioned on image edges (no layout shift). Hover turns accent color with inverted stroke. Thumbnail strip arrows match but smaller (28px). Applies to both product detail and blog carousels
- **Blog system:** Full blog with folder-per-post pattern, build-time content inlining, category filtering, optional carousel (right column), related item links. See Blog System section above
- **Blog cover position:** `coverPosition` field in post.json controls how the cover image is framed within the 16:9 card crop on the listing page (e.g., `"center 25%"` to show more of the top)
- **Blog carousel:** Single-image posts hide carousel arrows; "View in Shop" button appears below carousel when `relatedItem` is set
- **AI Assisted badge:** Pill-shaped accent-colored badge on product cards and detail pages for items with `"aiAssisted": true`. Transparent labeling of AI-created work
- **Cart page images:** Cart now shows the correct image for each purchase option (framed, square, portrait, landscape) using thumbnails, with proper aspect ratios
- **Cart payment notice:** Temporary "Email Your Order" mailto button with pre-filled order details, Venmo/Zelle/PayPal messaging. Remove once payment processing is live
- **Cart "Calculated at checkout":** Shipping & Tax line pulses indefinitely in accent color to highlight additional costs
- **Contact email:** Updated to `sidehustle.purchases@gmail.com` site-wide
- **Placeholder system:** Hero scroller and shop grid fill remaining slots (up to 6) with "More Coming Soon" placeholder frames when fewer gallery items exist
- **Hero uses full-size images:** Hero scroller product cards use `getMainImagePathForTheme` (not thumbnails) for crisp display at large sizes
- **Nav pointer-events fix:** `.nav` uses `pointer-events: none` with `auto` on `.nav-container` so the gradient tail doesn't block clicks on content below
- **Blog post nav routing:** Blog posts in `blog/` subdirectory get `../` prefix on all nav links (Home, Shop, Cart, etc.) so they resolve correctly
- **Removed Info section:** Info nav link and products section removed from index page; scroll arrow now points to #about
- **Removed placeholder gallery items:** All 10 placeholder items deleted; only real artwork (hairy-styles) remains
- **Hairy Styles recategorized:** Changed from photography → art (type: "art", subCategory: "digital")
- **Checkout button:** "Go to Cart" renamed to bold "Checkout" on product detail page after adding to cart
- **Convert script:** Scans `assets/images/gallery/` and `assets/content/blog/` for PNGs to convert
- **WebP image format:** Gallery images served as WebP (~90% filesize reduction). Source PNGs preserved
- **Pre-rendered thumbnails:** 300×400px Lanczos3 thumbnails for shop grid, carousel strip, and cart. Blog carousel thumbnails capped at 80px height
- **Build pipeline:** `npm run convert` → `npm run build` → `npm run build:blog`. All three needed for full rebuild
- **Cache busting:** `?v=TIMESTAMP` on all HTML asset refs and JS module `import` statements, auto-updated by `/deploy`
- **ES module import cache busting:** All `import from './gallery-data.js?v=TIMESTAMP'` paths in gallery and blog JS modules include version params. Without these, mobile browsers serve stale data files from immutable cache after new items are added
- **Mobile blog grid:** Blog listing uses single-column layout on phones (<640px). Override is inlined in `blog.html` `<style>` block (not external CSS) because mobile browsers aggressively cache CSS `@import` partials. Shop grid intentionally stays 2-column on mobile
- **CSS no-cache headers:** All `.css` files served with `no-cache, must-revalidate` via `.htaccess` because CSS `@import` partials can't carry `?v=` cache busters reliably on mobile
- **Light/dark image variants:** `-light` suffix images for theme-aware display
- **`themechange` event:** Custom event dispatched on theme toggle, used by all image components
