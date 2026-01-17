# Implementation Plan: Shop Gallery Viewer

**Branch**: `001-shop-gallery-viewer` | **Date**: 2025-01-16 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-shop-gallery-viewer/spec.md`

## Summary

Implement a responsive grid gallery for the shop page (`shop-all.html`) with filtering by type/sub-category, sorting options, and product detail pages. Uses the existing CSS design system with 3:4 portrait aspect ratio thumbnails, supporting both light and dark modes.

## Technical Context

**Language/Version**: HTML5, CSS3, Vanilla JavaScript (ES6+)
**Primary Dependencies**: None (static site using existing CSS architecture)
**Storage**: Static JSON data file for gallery items (no server/database)
**Testing**: Manual browser testing (mobile, tablet, desktop) + visual regression
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge)
**Project Type**: Static web application
**Performance Goals**: Page load under 3 seconds, filter/sort updates under 500ms
**Constraints**: Must work offline-capable once loaded, no external API dependencies
**Scale/Scope**: 50-200 gallery items, 2 main categories, 5-10 sub-categories

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Implementation Approach |
|-----------|--------|------------------------|
| I. CSS Variables First | PASS | Use existing `--hero-frame-aspect: 0.75` for thumbnails, all spacing/colors from `_variables.css` |
| II. Utility Classes Over Inline Styles | PASS | Use existing `.grid`, `.col-span-*`, `.mb-*`, `.card` classes |
| III. Theme Compatibility | PASS | Follow temperature-based theming, test light/dark modes |
| IV. Responsive Design | PASS | Mobile-first with 4→3→2 column grid using existing breakpoints |
| V. Design System Compliance | PASS | Reference `docs/design-system.md`, use existing card/button components |

**Additional Governance:**
- Navigation changes via `navigation-component.js` (already configured for shop-all.html)
- New CSS utilities added to `_utilities.css` if needed
- Documentation updates to `docs/design-system.md` for new gallery components

## Project Structure

### Documentation (this feature)

```text
specs/001-shop-gallery-viewer/
├── plan.md              # This file
├── research.md          # Phase 0 output - technology decisions
├── data-model.md        # Phase 1 output - entity definitions
├── quickstart.md        # Phase 1 output - developer guide
├── contracts/           # Phase 1 output - data schemas
│   └── gallery-data.schema.json
├── checklists/
│   └── requirements.md  # Specification quality checklist
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
# Static Website Structure (existing)
assets/
├── css/
│   ├── main.css              # Import file
│   ├── _variables.css        # Design tokens (add gallery-specific vars)
│   ├── _components.css       # Components (add gallery grid, filters)
│   └── _utilities.css        # Helpers (add any needed utilities)
├── js/
│   ├── main.js               # Core functionality
│   ├── theme.js              # Theme switching
│   ├── components/
│   │   └── navigation-component.js
│   └── gallery/              # NEW: Gallery module
│       ├── gallery-data.js   # Static gallery item data
│       ├── gallery-grid.js   # Grid rendering and filtering
│       └── gallery-detail.js # Detail page functionality
└── images/
    └── gallery/              # NEW: Gallery thumbnails and full images

# Pages
shop-all.html                 # Gallery page (replace placeholder)
product/                      # NEW: Detail pages directory
└── [slug].html              # Individual product detail pages

# Testing
tests/                        # NEW: Manual test checklist
└── gallery-tests.md         # Visual regression checklist
```

**Structure Decision**: Extends existing static site structure. Gallery JavaScript is modular within `assets/js/gallery/`. Product detail pages use a template pattern with static HTML files.

## Complexity Tracking

> No constitution violations requiring justification.

| Decision | Rationale |
|----------|-----------|
| Static JSON vs API | Matches existing static site pattern, enables offline use |
| Vanilla JS vs framework | Consistency with existing codebase, no build step needed |
| File-based detail pages | SEO-friendly, works with existing GitHub Pages/FTP deployment |
