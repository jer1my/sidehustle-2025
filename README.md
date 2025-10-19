# GitHub Template Repo 2025

A modern, production-ready web project template with modular CSS architecture, light/dark theme support, and automated FTP deployment via GitHub Actions.

Perfect for quickly starting new web projects with a solid foundation and Claude Code integration.

## ✨ Features

- **Modular CSS Architecture** - Organized, maintainable stylesheet system
- **12-Column Grid System** - Responsive CSS Grid with utilities
- **Light/Dark Theme** - Automatic theme switching with localStorage persistence
- **Temperature-based Theming** - Cool blues for light mode, warm oranges for dark
- **Component Library** - Pre-built buttons, cards, forms, badges, alerts
- **Claude Code Integration** - Slash commands for streamlined git workflow
- **Auto-Deployment** - GitHub Actions workflow for FTP deployment
- **Dual License** - MIT for code, customizable for content
- **Mobile-First** - Responsive design with mobile, tablet, desktop breakpoints

## 🚀 Quick Start

### 1. Use This Template

Click the **"Use this template"** button on GitHub to create a new repository.

### 2. Clone Your New Repository

```bash
git clone https://github.com/your-username/your-project-name.git
cd your-project-name
```

### 3. Customize

Follow the [**SETUP.md**](SETUP.md) guide for step-by-step customization:
- Update colors and fonts
- Configure deployment
- Update LICENSE and README
- Customize content

### 4. Test Locally

```bash
# Start a local server
python3 -m http.server 8000

# Visit http://localhost:8000
```

### 5. Deploy

```bash
# Use Claude Code slash command
/deploy
```

## 📁 Project Structure

```
├── .github/
│   └── workflows/
│       └── deploy.yml           # [CUSTOMIZE] FTP deployment
├── .claude/
│   ├── commands/                # Slash commands (/deploy, /status)
│   └── settings.local.json
├── assets/
│   ├── css/
│   │   ├── main.css             # Import file
│   │   ├── _variables.css       # [CUSTOMIZE] Colors, fonts, spacing
│   │   ├── _base.css            # Reset & fundamentals
│   │   ├── _typography.css      # Text styles
│   │   ├── _grid.css            # 12-column grid
│   │   ├── _components.css      # Buttons, cards, forms
│   │   ├── _theme.css           # Light/dark mode
│   │   └── _utilities.css       # Helper classes
│   ├── js/
│   │   ├── main.js              # Core functionality
│   │   └── theme.js             # Theme switcher
│   └── images/
├── .gitignore
├── index.html                   # [CUSTOMIZE] Main page
├── LICENSE                      # [CUSTOMIZE] Dual license
├── CLAUDE.md                    # Design system docs
├── README.md                    # This file
└── SETUP.md                     # Customization guide
```

## 🎨 Customization Points

### Colors
**File:** `assets/css/_variables.css`
```css
--color-primary: #0f0f0f;        /* Brand color */
--color-accent-cool: #15B5FF;    /* Light mode accent */
--color-accent-warm: #ea580c;    /* Dark mode accent */
```

### Typography
**File:** `assets/css/_variables.css`
```css
--font-family-primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
```

### Container Width
**File:** `assets/css/_variables.css`
```css
--container-max-width: 1200px;   /* Max content width */
```

See [**SETUP.md**](SETUP.md) for complete customization guide.

## 🚀 Deployment

### FTP Deployment (Default)

**Setup:**
1. Add GitHub Secrets (Settings → Secrets → Actions):
   - `FTP_HOST`
   - `FTP_USERNAME`
   - `FTP_PASSWORD`

2. Update deployment directory in `.github/workflows/deploy.yml`:
   ```yaml
   server-dir: /yourproject/    # Change this
   ```

**Deploy:**
- Automatic on push to `main` branch
- Or use `/deploy` slash command

### GitHub Pages (Alternative)

1. Delete `.github/workflows/deploy.yml`
2. Settings → Pages → Deploy from `main` branch

## 🔧 Development Workflow

### Branch Strategy
- **`main`** - Production (auto-deploys)
- **`development`** - Working branch

### Slash Commands (Claude Code)
```bash
/status         # Show git status and commits
/quick-commit   # Commit on current branch
/deploy         # Commit → merge → push both branches
```

## 🎯 Component Library

### Buttons
```html
<button class="btn btn-primary">Primary Button</button>
<button class="btn btn-secondary">Secondary Button</button>
<button class="btn btn-outline">Outline Button</button>
```

### Cards
```html
<div class="card">Standard Card</div>
<div class="glass-card">Glass Card (Glassmorphism)</div>
```

### Grid System
```html
<div class="grid grid-cols-3 gap-4">
    <div class="col-span-1">Column 1</div>
    <div class="col-span-1">Column 2</div>
    <div class="col-span-1">Column 3</div>
</div>
```

See `index.html` for complete component examples.

## 📐 Grid System

12-column responsive grid with breakpoints:
- **Mobile:** < 768px (stacks to 1 column)
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

**Example:**
```html
<!-- 3 columns on desktop, 1 on mobile -->
<div class="grid grid-cols-3 sm:grid-cols-1 gap-4">
    <div>Item 1</div>
    <div>Item 2</div>
    <div>Item 3</div>
</div>
```

## 🌐 Browser Support

- Chrome 76+
- Firefox 103+
- Safari 14+
- Edge 79+

## 📄 License

This repository is dual-licensed:

- **Code & Implementation:** MIT License (freely usable with attribution)
- **Project Content:** All Rights Reserved (customizable per project)

See [LICENSE](LICENSE) for details.

## 🤝 Contributing

This is a template repository. To contribute:

1. Fork this repo
2. Make improvements to the template itself
3. Submit a pull request

## 🙏 Acknowledgments

- Modern CSS architecture patterns
- Temperature-based theming for accessibility
- Claude Code integration for streamlined workflow

---

**Ready to build something awesome?** Follow [SETUP.md](SETUP.md) to get started! 🚀
