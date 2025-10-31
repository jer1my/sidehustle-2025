# Project Design System & Guidelines

This document provides design system documentation for AI assistants (like Claude Code) to understand and maintain the codebase.

## Quick Customization Checklist

**Before starting development, customize these:**
- [ ] Brand colors in `assets/css/_variables.css` (lines 11-13)
- [ ] Accent colors in `assets/css/_variables.css` (lines 16-18)
- [ ] Font families in `assets/css/_variables.css` (lines 21-23)
- [ ] Container max-width in `assets/css/_variables.css` (line 26)
- [ ] Project name in `LICENSE` and `README.md`
- [ ] Deployment directory in `.github/workflows/deploy.yml` (line 23)

## Typography

**Font Pairing Strategy:**
This project uses a sophisticated two-font system:
- **Montserrat** (`--font-family-primary`) - Primary sans-serif for body text, UI elements, and h3-h6
- **Playfair Display** (`--font-family-display`) - Display serif for hero titles, h1-h2, and visual impact

**Montserrat (Primary):**
- Usage: Body text, small text, labels, h3-h6 headings, UI components
- Weights: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semi-Bold), 700 (Bold)
- Fallback: `-apple-system, BlinkMacSystemFont, sans-serif`
- Customizable via `--font-family-primary` in `_variables.css:21`

**Playfair Display (Display):**
- Usage: Hero titles (italic), hero subtitles, section titles, h1-h2 headings
- Weights: 400 (Regular), 700 (Bold), plus italic variants
- Provides elegant contrast and visual hierarchy
- OpenType ligature support for professional typography
- Customizable via `--font-family-display` in `_variables.css:22`

**OpenType Ligatures:**
Playfair Display includes professional ligature support (fi, fl, ff, ffi, ffl). Enable with `font-variant-ligatures: common-ligatures`.

**Responsive Typography Scale:**
```css
Font Sizes:
- xs: 12px
- sm: 14px
- base: 16px (body text)
- lg: 18px
- xl: 20px
- 2xl: 24px
- 3xl: 32px
- 4xl: 48px (adjusts to 36px on mobile)
- 5xl: 64px (adjusts to 48px on mobile)
- hero: 96px (adjusts to 64px on mobile)
- hero-subtitle: 40px (adjusts to 24px on mobile)
```

**Complete Typography Variable System:**
The design system includes granular typography variables for precise control over every text element. Each typography level has individual variables for size, weight, spacing, and line-height:

```css
/* Hero Title */
--typo-hero-title-size: clamp(48px, 8vw, 96px)
--typo-hero-title-weight: 300 (Light)
--typo-hero-title-spacing: -0.02em
--typo-hero-title-line-height: 0.9

/* Hero Subtitle */
--typo-hero-subtitle-size: clamp(24px, 3.5vw, 40px)
--typo-hero-subtitle-weight: 400 (Regular)
--typo-hero-subtitle-line-height: 1.3

/* Similar patterns for: section title/subtitle, h1-h6, body, small, type labels */
```

This granular approach provides complete control over typography without editing component classes. See `_variables.css:79-157` for the complete system.

## Typography Sample Classes

**Type Documentation Components:**
The design system includes semantic classes for documenting typography in the lab page:

```css
.type-sample        /* Container for each typography sample */
.type-label         /* Uppercase label (e.g., "HERO TITLE", "H1") */
.type-spec          /* Specification details (usage, font, size, class) */
```

**Typography Sample Classes:**
Pre-styled classes that demonstrate typography styles using the granular variable system. Each class applies the complete typography system (font-family, size, weight, spacing, line-height) for its respective element:

```css
/* Display Typography (Playfair Display) */
.hero-title-sample         /* font-family-display, italic */
.hero-subtitle-sample      /* font-family-display */
.section-title-sample      /* font-family-display */
.section-subtitle-sample   /* font-family-primary */
.h1-sample                 /* font-family-display, italic */
.h2-sample                 /* font-family-display */

/* Body Typography (Montserrat) */
.h3-sample, .h4-sample, .h5-sample, .h6-sample
.body-sample
.small-sample
.type-label-sample

/* Special Elements */
.ligature-example          /* Demonstrates OpenType ligatures in Playfair Display */
```

**Usage Example:**
```html
<div class="type-sample">
    <div class="type-label">Hero Title</div>
    <div class="hero-title-sample">Side Hustle</div>
    <div class="type-spec">
        <strong>Usage:</strong> Primary hero heading<br>
        <strong>Font:</strong> Playfair Display Italic<br>
        <strong>Size:</strong> clamp(48px, 8vw, 96px)<br>
        <strong>Class:</strong> <code>.hero-title</code>
    </div>
</div>
```

This pattern provides consistent, semantic documentation structure throughout the lab page. See `_components.css:114-257` for implementation.

## Link System

**Link CSS Variables:**
All link styles use standardized CSS custom properties in `_variables.css`:

```css
--link-color: var(--color-accent)
--link-hover-opacity: 0.5
--link-underline-height: 2px
--link-underline-offset: -2px
--link-transition: 0.3s ease
--link-font-weight: var(--font-weight-medium)
```

**Three-Tier Link Components:**

1. **Accent Link (`.accent-link`)** - Standard link with animated underline
   - Color adapts to theme (emerald green in light, jewelry gold in dark)
   - Underline animates from left to right on hover
   - Text fades to 50% opacity on hover
   - Usage: Internal navigation, section links, primary CTAs

2. **Accent Link with Arrow (`.accent-link-arrow`)** - Directional link
   - Same styling as accent link with right-pointing arrow (→)
   - Arrow included in link text
   - Usage: "Read more" links, case study links, directional navigation

3. **External Link (`.external-link`)** - For external resources
   - Same styling as accent link with 45-degree arrow (↗)
   - Arrow included in link text
   - Usage: External websites, documentation, resources opening in new tab

**Usage Examples:**
```html
<!-- Accent Link -->
<a href="#section" class="accent-link">Internal link</a>

<!-- Accent Link with Arrow -->
<a href="/case-study" class="accent-link-arrow">Read the case study →</a>

<!-- External Link -->
<a href="https://example.com" target="_blank" class="external-link">View documentation ↗</a>
```

## Color System

**Primary Colors:**
- Primary: `--color-primary` (main brand color)
- Secondary: `--color-secondary`
- Tertiary: `--color-tertiary`

**Accent Colors (Temperature-based theming):**
- Accent Cool: `--color-accent-cool` (light mode - emerald green #059669)
- Accent Warm: `--color-accent-warm` (dark mode - jewelry gold #B8860B)
- Active Accent: `--color-accent` (switches based on theme)

**Color Theory:**
Temperature-based theming provides optimal contrast:
- Cool accents (emerald green) for light mode - creates depth, prevents eye strain
- Warm accents (jewelry gold) for dark mode - comfortable in low light, maintains accessibility

**Neutral Scale:**
10-step neutral scale from white to near-black:
- `--color-neutral-50` to `--color-neutral-900`
- Use for backgrounds, borders, and subtle UI elements

## Layout & Spacing

**Container:**
- Max-width: `--container-max-width` (default: 1200px)
- Padding: 40px (desktop), 24px (mobile)
- Behavior: Fluid until max-width, then centers with whitespace

**Spacing Scale (4px base):**
```css
--space-1: 4px
--space-2: 8px
--space-4: 16px
--space-6: 24px
--space-8: 32px
--space-12: 48px
--space-16: 64px
--space-20: 80px
```

**Grid System:**
- 12-column CSS Grid
- Responsive: Mobile (1 col) → Tablet (2-4 cols) → Desktop (up to 12 cols)
- Gap utilities: `.gap-1` through `.gap-16`
- Column spanning: `.col-span-1` through `.col-span-12`

**Grid Toggle Variables:**
The grid overlay toggle in the lab page uses a comprehensive set of CSS variables for complete customization:

```css
/* Dimensions */
--grid-toggle-width: 56px
--grid-toggle-height: 24px
--grid-toggle-pill-size: 18px
--grid-toggle-pill-offset: 3px
--grid-toggle-translate: 32px       /* Distance pill moves when active */

/* Light Mode Colors */
--grid-toggle-bg-inactive: rgba(193, 193, 193, 0.3)
--grid-toggle-bg-active: var(--color-accent-cool)     /* Emerald green */
--grid-toggle-bg-hover: rgba(193, 193, 193, 0.15)
--grid-toggle-bg-active-hover: rgba(5, 150, 105, 0.4)
--grid-toggle-pill-bg: #1a1a1a
--grid-toggle-text-color: var(--text-secondary)

/* Dark Mode Colors */
--grid-toggle-bg-inactive: rgba(124, 124, 124, 0.4)
--grid-toggle-bg-active: var(--color-accent-warm)     /* Jewelry gold */
--grid-toggle-bg-hover: rgba(124, 124, 124, 0.2)
--grid-toggle-bg-active-hover: rgba(184, 134, 11, 0.4)
--grid-toggle-pill-bg: #fafafa
--grid-toggle-text-color: #fafafa
```

Grid toggle colors follow the temperature-based theming system, using accent colors that adapt to each theme. See `_variables.css:217-230` (light mode) and `_variables.css:272-278` (dark mode overrides).

## Utility Classes

**IMPORTANT:** Always use utility classes instead of inline styles for better maintainability and consistency.

**Spacing Utilities:**
```css
/* Margin utilities */
.m-0              /* margin: 0 */
.mt-3, .mt-6, .mt-8, .mt-12    /* margin-top */
.mb-3, .mb-4, .mb-6, .mb-8, .mb-12, .mb-16   /* margin-bottom */
```

**Layout Utilities:**
```css
/* Flexbox utilities */
.flex-center          /* Centers content horizontally and vertically */
.flex-column-gap-6    /* Vertical flex column with 24px gap, left-aligned */
.flex-wrap-gap-6      /* Horizontal flex with 24px gap and wrapping */
```

**Typography Utilities:**
```css
.text-xs, .text-sm, .text-base, .text-lg, .text-xl
.font-weight-300, .font-weight-400, .font-weight-500, .font-weight-600, .font-weight-700
.text-secondary       /* Secondary text color */
```

**Best Practice:** Replace inline styles like `style="margin-bottom: 24px"` with `.mb-6` for consistency and easier maintenance.

## Component Library

**Buttons:**
```css
.btn-primary: Solid background, white text
.btn-secondary: Glass effect with backdrop blur
.btn-outline: Transparent with border
Sizes: .btn-sm, default, .btn-lg
```

**Cards:**
```css
.card: Standard card with shadow
.glass-card: Glassmorphism effect with backdrop blur
Interactive: Adds hover-lift effect
```

**Forms:**
```css
.form-input: Text inputs
.form-textarea: Multi-line text
.form-select: Dropdown selects
Focus states use accent color
```

**Badges & Alerts:**
```css
.badge: Small pill-shaped labels
.alert-info/success/warning/error: Colored notification boxes
```

## Lab Page Structure

The `lab.html` page serves as a comprehensive design system showcase and documentation hub.

**Overall Layout:**
- Two-column responsive grid (1 column on mobile, 2 columns on desktop)
- Consistent section spacing using `.mb-12` (48px) between major sections
- User controls at the top: Theme toggle, Grid overlay toggle, Opacity controls

**Typography Section Organization:**

*Left Column:*
1. Font Families - Documentation of Montserrat + Playfair Display pairing strategy
2. OpenType Ligatures - Demonstration of professional ligature support
3. Type Label - Uppercase label style demonstration
4. Hero Title - Primary hero heading style
5. Hero Subtitle - Secondary hero heading style
6. Section Title - Major section heading style
7. Section Subtitle - Section description style

*Right Column:*
1. H1-H6 - All heading levels with semantic usage
2. Body Text - Standard paragraph text
3. Small Text - Reduced size text

Each typography element follows the `.type-sample` component pattern with `.type-label` and `.type-spec`.

**Color System Section:**
- Brand Colors (Primary, Secondary, Tertiary)
- Accent Colors (Cool/Warm with temperature-based theming)
- Neutral Scale (11-step grayscale from white to near-black)
- All color swatches display both hex values and CSS variable names

**Components Section Organization:**

*Left Column:*
1. Buttons - Primary, secondary, outline, and accent variants
2. Interactive Elements - Three-tier link system and checkbox
   - Links: .accent-link, .accent-link-arrow, .external-link
   - Checkbox: Form input demonstration

*Right Column:*
1. Arrow Buttons - Directional navigation buttons (up, down, left, right)
2. Selectors - Toggle switches and range sliders

**User Controls:**
- Theme Toggle - Switches between light and dark modes
- Grid Overlay Toggle - Shows/hides 12-column grid overlay for layout debugging
- Opacity Controls - Adjusts content opacity for easier screenshot composition

All sections use semantic utility classes (.mb-6, .mb-12, .flex-column-gap-6) instead of inline styles for consistency and maintainability.

## Theme System

**Light Mode (Default):**
- Background: Off-white (#fafafa)
- Text: Dark gray (#1a1a1a)
- Accent: Emerald green (#059669)

**Dark Mode:**
- Background: Near-black (#171717)
- Text: Light gray (#e0e0e0)
- Accent: Jewelry gold (#B8860B)
- Enhanced shadows for depth

**Theme Toggle:**
- Fixed position (top-right)
- Circular button with glass effect
- Icons: 🌙 (light mode), ☀️ (dark mode)
- Persistent via localStorage

## CSS Variable Architecture & Theme Switching

**CRITICAL: Understanding Variable Cascading**

CSS variables that reference other variables do NOT automatically re-evaluate when the referenced variable changes. This is fundamental to how theme switching works in this project.

**Correct Implementation (✅):**
```css
/* _variables.css */
:root {
  --color-accent-cool: #059669;
  --color-accent-warm: #B8860B;
  --color-accent: var(--color-accent-cool);  /* Default light mode */
  --link-color: var(--color-accent);          /* References accent */
}

[data-theme="dark"] {
  --color-accent: var(--color-accent-warm);
  --link-color: var(--color-accent-warm);    /* ✅ MUST override again */
}
```

**Why This Matters:**
When `--link-color: var(--color-accent)` is defined in `:root`, it captures the VALUE of `--color-accent` at that moment. Changing `--color-accent` in `[data-theme="dark"]` does NOT update `--link-color` automatically. You MUST explicitly override `--link-color` again.

**Incorrect Implementation (❌):**
```css
/* _variables.css */
:root {
  --color-accent: var(--color-accent-cool);
  --link-color: var(--color-accent);
}

[data-theme="dark"] {
  --color-accent: var(--color-accent-warm);
  /* ❌ Missing: --link-color override */
}
/* Result: Links will stay light mode color in dark mode */
```

**Theme Variable Override Locations:**
Variables must be overridden in BOTH locations for proper theme switching:

1. **`_variables.css`** - Main theme overrides in `[data-theme="dark"]` block
2. **`_utilities.css`** - Additional overrides at the top of the file for higher specificity

This dual-override pattern ensures theme-dependent variables update correctly across all components.

**Common Variables Requiring Dual Override:**
- `--color-accent` (switches between cool/warm)
- `--link-color` (follows accent color)
- `--text-primary`, `--text-secondary`, `--text-tertiary`
- `--bg-primary`, `--bg-secondary`
- All grid toggle color variables

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
```

## Technical Architecture

### Modular CSS System
Stylesheets are organized as modules imported into `main.css`:
1. Variables - Colors, fonts, spacing tokens
2. Base - Reset and foundational styles
3. Typography - Text styles
4. Grid - Layout system
5. Components - UI components
6. Theme - Light/dark mode
7. Utilities - Helper classes (must load last for specificity)

**Important:** Do not rearrange import order - specificity matters!

### Container Strategy
Max-width containers prevent excessive content spread on large displays:
- Default: 1200px (customizable via `--container-max-width`)
- Applied via `.container` class
- Centers content with whitespace on sides

### Known Best Practices

**Avoid:**
- Changing CSS import order in `main.css`
- Using `!important` (use specificity instead)
- Inline styles (use utility classes)
- Fixed px values (use CSS variables)

**Prefer:**
- CSS variables for all customizable values
- Utility classes over custom CSS
- Mobile-first responsive design
- Semantic HTML structure

## Development Workflow

### Branch Strategy
- `main` - Production branch (auto-deploys to FTP)
- `development` - Working branch (use daily)

### Slash Commands
Available via `.claude/commands/`:
- `/status` - Show git status and recent commits
- `/quick-commit` - Commit on current branch
- `/deploy` - Commit → merge to main → push both branches

### Deployment
- **Automatic:** Push to `main` triggers FTP deployment
- **Manual:** Use `/deploy` slash command
- **Configuration:** `.github/workflows/deploy.yml`

## Customization Guidelines

**When customizing colors:**
1. Update `_variables.css` first
2. Test in both light and dark modes
3. Check contrast ratios for accessibility
4. Verify glassmorphism effects still work

**When adding components:**
1. Add to `_components.css`
2. Use existing CSS variables
3. Support both themes
4. Add mobile responsive styles

**When modifying layout:**
1. Use grid utilities first
2. Add custom classes only if needed
3. Test on mobile, tablet, desktop
4. Maintain container max-width strategy

## Performance Considerations

- CSS modules load once via `@import`
- Theme switching uses CSS variables (no page reload)
- Backdrop blur can be expensive (use sparingly)
- Images should be optimized and lazy-loaded

## Accessibility

- High contrast ratios in both themes
- Focus states clearly visible
- Semantic HTML structure
- Keyboard navigation support
- `prefers-reduced-motion` respected

---

This design system provides a solid foundation for modern web projects with professional styling, accessibility, and maintainability.
