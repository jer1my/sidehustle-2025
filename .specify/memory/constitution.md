# Side Hustle Constitution

## Core Principles

### I. CSS Variables First
Always use CSS variables over inline or hardcoded values. All customizable values are defined in `_variables.css`. Theme-dependent variables must be overridden in both `:root` and `[data-theme="dark"]` selectors to ensure proper theming support.

### II. Utility Classes Over Inline Styles
Use utility classes (`.mb-6`, `.flex-center`, etc.) instead of inline styles. This promotes maintainability and consistency across the codebase. Reference the design system documentation for available utilities before creating new ones.

### III. Theme Compatibility
All UI changes must work in both light and dark modes. Test theme toggle behavior after making changes. Follow the temperature-based theming approach: cool accents (cyan/blue) for light mode, warm accents (orange/gold) for dark mode.

### IV. Responsive Design
Follow a mobile-first approach. Test all changes on mobile, tablet, and desktop breakpoints. Use the existing grid system and responsive utilities rather than creating custom media queries.

### V. Design System Compliance
Reference `docs/design-system.md` for all styling decisions. Follow established typography, color, and component patterns. The lab page (`lab.html`) serves as living documentation and a visual reference for all design system elements.

### VI. Clean Up Unused Code
When refactoring or replacing functionality, always remove obsolete code, files, and folders unless explicitly asked to keep a backup. Dead code creates confusion and maintenance burden. If backup is needed, clearly document it in CLAUDE.md under "Backup Files."

## Sources of Truth

- **CLAUDE.md** - Project-level instructions, site architecture, navigation configuration, development workflow
- **docs/design-system.md** - Typography, colors, components, themes, CSS architecture documentation
- **assets/css/_variables.css** - All customizable design tokens (colors, fonts, spacing, container widths)

## Development Workflow

- **Branch Strategy**: `development` (daily work) → `main` (production, auto-deploys via FTP)
- **Deployment**: Use `/deploy` slash command for releases (commits, merges to main, pushes both branches)
- **Spec Kit Commands**: Available for spec-driven development (`/speckit.specify`, `/speckit.plan`, `/speckit.tasks`, `/speckit.implement`)
- **Testing**: Verify changes in both light and dark modes across mobile, tablet, and desktop

## Governance

- This constitution supersedes ad-hoc styling decisions
- Design system changes require corresponding documentation updates in `docs/design-system.md`
- Navigation changes must go through `assets/js/components/navigation-component.js` (single source of truth)
- New CSS utilities should be added to `_utilities.css` and documented in the design system

**Version**: 1.1.0 | **Ratified**: 2025-01-16 | **Last Amended**: 2025-01-16
