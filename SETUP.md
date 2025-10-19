# Setup Guide - Customize Your Project

Follow these steps to customize this template for your project.

## ✅ Quick Customization Checklist

- [ ] Update colors in `assets/css/_variables.css`
- [ ] Change font in `assets/css/_variables.css`
- [ ] Update LICENSE with your name and year
- [ ] Update README.md with your project details
- [ ] Configure FTP deployment (if using)
- [ ] Update meta tags in `index.html`
- [ ] Customize content in `index.html`

---

## 1. Customize Colors & Branding

**File:** `assets/css/_variables.css`

### Change Brand Colors
```css
/* Line 13-15: Update your brand colors */
--color-primary: #0f0f0f;      /* Your main brand color */
--color-secondary: #525252;     /* Secondary color */
--color-tertiary: #737373;      /* Tertiary color */
```

### Change Accent Colors
```css
/* Line 18-20: Update accent colors */
--color-accent-cool: #15B5FF;   /* Light mode accent */
--color-accent-warm: #ea580c;   /* Dark mode accent */
```

**Tip:** Use a color picker or palette generator to find complementary colors.

---

## 2. Change Typography

**File:** `assets/css/_variables.css`

### Update Font
```css
/* Line 23: Change the font family */
--font-family-primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
```

**Steps:**
1. Choose a font from [Google Fonts](https://fonts.google.com)
2. Add the font link to `<head>` in `index.html`:
   ```html
   <link href="https://fonts.googleapis.com/css2?family=YourFont:wght@300;400;500;600;700&display=swap" rel="stylesheet">
   ```
3. Update `--font-family-primary` with your font name

---

## 3. Update Container Width

**File:** `assets/css/_variables.css`

```css
/* Line 26: Adjust max content width */
--container-max-width: 1200px;
```

Options:
- `1200px` - Standard (recommended)
- `1400px` - Wider for more content
- `1600px` - Very wide for large screens

---

## 4. Configure Deployment

### Option A: FTP Deployment (Default)

**File:** `.github/workflows/deploy.yml`

**Step 1:** Add GitHub Secrets
1. Go to your repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add these secrets:
   - `FTP_HOST` - Your FTP server (e.g., `ftp.yourdomain.com`)
   - `FTP_USERNAME` - Your FTP username
   - `FTP_PASSWORD` - Your FTP password

**Step 2:** Update Deployment Directory
```yaml
# Line 23: Change to your directory
server-dir: /yourproject/    # Update this!
```

Examples:
- `/public_html/yourproject/`
- `/www/yourproject/`
- `/yourproject.com/`

### Option B: GitHub Pages

If you prefer GitHub Pages instead:

1. Delete `.github/workflows/deploy.yml`
2. Go to repo Settings → Pages
3. Source: Deploy from branch `main`
4. Save

---

## 5. Update Project Information

### LICENSE
**File:** `LICENSE`

Replace placeholders:
- `[YEAR]` → Current year (e.g., `2025`)
- `[YOUR NAME]` → Your name or organization
- `[YOUR NAME/EMAIL]` → Your contact info

### README.md
**File:** `README.md`

Update:
- Project name and description
- Live demo URL
- Features specific to your project
- Installation/usage instructions

### Meta Tags
**File:** `index.html`

```html
<!-- Update these in <head> -->
<title>Your Project Name</title>
<meta name="description" content="Your project description">
<meta name="author" content="Your Name">
```

---

## 6. Customize Content

**File:** `index.html`

1. Replace placeholder headings with your content
2. Update navigation links
3. Add your own sections
4. Replace example cards/components

**Look for `[CUSTOMIZE]` comments** throughout the file for guidance.

---

## 7. Branch Strategy & Git Workflow

This template uses a two-branch workflow:

- **`main`** - Production branch (auto-deploys via FTP)
- **`development`** - Working branch (use daily)

### Workflow:
1. Work on `development` branch
2. Commit changes: `/quick-commit` (slash command)
3. Ready to deploy: `/deploy` (merges to main, pushes both)

### Slash Commands:
- `/status` - Show git status and recent commits
- `/quick-commit` - Quick commit on current branch
- `/deploy` - Full deployment (commit → merge → push)

---

## 8. Optional: Remove Dark Mode

If you don't want dark mode:

1. **Delete** `assets/css/_theme.css`
2. **Remove** theme import from `assets/css/main.css`:
   ```css
   /* Remove this line: */
   @import '_theme.css';
   ```
3. **Remove** theme toggle from `index.html`:
   ```html
   <!-- Remove this button: -->
   <button class="theme-toggle">...</button>
   ```
4. **Delete** `assets/js/theme.js`
5. **Remove** theme script from `index.html`:
   ```html
   <!-- Remove this: -->
   <script src="assets/js/theme.js"></script>
   ```

---

## 9. Test Your Changes

1. **Local Testing:**
   ```bash
   # Start a local server
   python3 -m http.server 8000
   # Visit http://localhost:8000
   ```

2. **Check:**
   - Colors look correct
   - Fonts load properly
   - Theme toggle works (if using)
   - Responsive design on mobile
   - Links work correctly

3. **Deploy:**
   ```bash
   # Use the deploy slash command
   /deploy
   ```

---

## 📚 Additional Resources

- [CSS Variables Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Google Fonts](https://fonts.google.com)
- [Color Palette Generators](https://coolors.co)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

## ❓ Need Help?

- Check `CLAUDE.md` for design system documentation
- Review `README.md` for project structure
- Look for `[CUSTOMIZE]` comments in files

Happy coding! 🚀
