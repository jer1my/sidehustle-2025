# Project Design System & Guidelines

This document provides design system documentation for AI assistants (like Claude Code) to understand and maintain the codebase.

## Quick Customization Checklist

**Before starting development, customize these:**
- [ ] Colors in `assets/css/_variables.css` (lines 13-20)
- [ ] Font family in `assets/css/_variables.css` (line 23)
- [ ] Container max-width in `assets/css/_variables.css` (line 26)
- [ ] Project name in `LICENSE` and `README.md`
- [ ] Deployment directory in `.github/workflows/deploy.yml` (line 23)

## Typography

**Primary Font:** Customizable via `--font-family-primary`
- Default: Inter with system font fallback
- Weights: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semi-Bold), 700 (Bold)
- Fallback: `-apple-system, BlinkMacSystemFont, sans-serif`

**Responsive Typography Scale:**
```css
Font Sizes (rem-based):
- xs: 12px
- sm: 14px
- base: 16px (body text)
- lg: 18px
- xl: 20px
- 2xl: 24px
- 3xl: 32px
- 4xl: 48px (adjusts to 36px on mobile)
- 5xl: 56px (adjusts to 44px on mobile)
```

## Color System

**Primary Colors:**
- Primary: `--color-primary` (main brand color)
- Secondary: `--color-secondary`
- Tertiary: `--color-tertiary`

**Accent Colors (Temperature-based theming):**
- Accent Cool: `--color-accent-cool` (light mode - default: cool blue)
- Accent Warm: `--color-accent-warm` (dark mode - default: warm orange)
- Active Accent: `--color-accent` (switches based on theme)

**Color Theory:**
Temperature-based theming provides optimal contrast:
- Cool accents (blue) for light mode - creates depth, prevents eye strain
- Warm accents (orange) for dark mode - comfortable in low light, maintains accessibility

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

## Theme System

**Light Mode (Default):**
- Background: White
- Text: Dark gray (#1a1a1a)
- Accent: Cool blue

**Dark Mode:**
- Background: Near-black (#0a0a0a)
- Text: Light gray (#e0e0e0)
- Accent: Warm orange
- Enhanced shadows for depth

**Theme Toggle:**
- Fixed position (top-right)
- Circular button with glass effect
- Icons: 🌙 (light mode), ☀️ (dark mode)
- Persistent via localStorage

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
