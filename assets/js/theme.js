/* ==========================================
   Theme System (Light/Dark Mode)
   ========================================== */

class ThemeManager {
    constructor() {
        this.themeKey = 'site-theme';
        this.init();
    }

    init() {
        // Get saved theme or default to light
        const savedTheme = localStorage.getItem(this.themeKey) || 'light';
        this.setTheme(savedTheme, false);

        // Set up toggle button
        const toggleBtn = document.querySelector('.theme-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggle());
        }
    }

    setTheme(theme, save = true) {
        document.body.setAttribute('data-theme', theme);

        if (save) {
            localStorage.setItem(this.themeKey, theme);
        }
    }

    toggle() {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }

    getTheme() {
        return document.body.getAttribute('data-theme') || 'light';
    }
}

// Initialize theme system when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.themeManager = new ThemeManager();
    });
} else {
    window.themeManager = new ThemeManager();
}
