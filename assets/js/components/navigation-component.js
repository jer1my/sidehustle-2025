/**
 * Navigation Component
 * Single source of truth for site navigation
 */

// Navigation configuration
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

/**
 * Generate navigation HTML
 * @param {string} currentPage - Current page identifier ('index', 'lab', 'art', or 'digital')
 * @returns {object} Navigation HTML components
 */
function generateNavigation(currentPage = 'index') {
    const isLab = currentPage === 'lab';
    const isShopAll = currentPage === 'shop-all';
    const isArt = currentPage === 'art';
    const isDigital = currentPage === 'digital';
    const logoHref = 'index.html';

    // Check if we're on lab page and determine referrer
    let labReferrer = 'index';
    if (isLab) {
        const urlParams = new URLSearchParams(window.location.search);
        const fromParam = urlParams.get('from');
        if (fromParam === 'art' || fromParam === 'digital') {
            labReferrer = fromParam;
        }
    }

    // Adjust links based on current page
    const links = NAV_CONFIG.links.map(link => {
        let href = link.href;
        let isActive = false;

        if (isLab) {
            // On lab page
            if (link.id === 'lab') {
                isActive = true;
            } else if (link.href.startsWith('#')) {
                // Point hash links back to referrer page
                const referrerPage = labReferrer === 'art' ? 'art.html' :
                                     labReferrer === 'digital' ? 'digital.html' :
                                     'index.html';
                href = `${referrerPage}${link.href}`;
            }
        } else if (isShopAll) {
            // On shop-all page
            if (link.id === 'shop-all') {
                isActive = true;
            } else if (link.href.startsWith('#')) {
                // Point hash links back to index
                href = `index.html${link.href}`;
            }
        } else if (isArt || isDigital) {
            // On art or digital pages
            if (link.href.startsWith('#')) {
                // Keep hash links on current page
                const pageName = isArt ? 'art.html' : 'digital.html';
                href = `${pageName}${link.href}`;

                // Make Shop link active by default on page load
                // if (link.id === 'top') {
                //     isActive = true;
                // }
            } else if (link.id === 'lab') {
                // Add referrer parameter to lab link
                const fromPage = isArt ? 'art' : 'digital';
                href = `lab.html?from=${fromPage}`;
            }
        } else {
            // On index page
            if (link.id === 'home') {
                isActive = true;
                href = '#'; // On index, home just scrolls to top
            }
        }

        return { ...link, href, isActive };
    });

    // Generate desktop nav links
    const desktopLinks = links.map(link =>
        `<li><a href="${link.href}"${link.isActive ? ' class="active"' : ''}><span class="link-text">${link.text}</span></a></li>`
    ).join('\n                    ');

    // Generate mobile nav links
    const mobileLinks = links.map(link =>
        `<a href="${link.href}"${link.href.startsWith('#') || link.href.includes('.html#') ? ' onclick="toggleMobileMenu(event)"' : ''}><span class="mobile-link-text">${link.text}</span></a>`
    ).join('\n                ');

    // Theme toggle SVG
    const themeToggleSVG = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M9.98038 2.73135C9.79117 2.67374 9.59078 2.67397 9.40415 2.72944C7.79045 3.18158 6.32264 4.04719 5.14599 5.24078C3.96517 6.4386 3.11882 7.92491 2.69124 9.55165C2.26365 11.1784 2.26977 12.8888 2.70898 14.5124C3.14819 16.136 4.00515 17.6163 5.19451 18.8056C6.38386 19.995 7.86409 20.8519 9.48773 21.2911C11.1114 21.7303 12.8218 21.7364 14.4485 21.3088C16.0752 20.8812 17.5615 20.0348 18.7593 18.854C19.9525 17.6778 20.8179 16.2106 21.2702 14.5976C21.324 14.4177 21.3265 14.2247 21.275 14.041C21.1538 13.6089 20.7597 13.3102 20.311 13.3106C20.2099 13.3107 20.1116 13.326 20.0186 13.3546C18.7246 13.7093 17.3598 13.7164 16.0619 13.3751C14.7554 13.0314 13.5636 12.347 12.6083 11.3918C11.6531 10.4365 10.9686 9.24468 10.625 7.93818C10.2834 6.63949 10.2908 5.27379 10.6461 3.9791C10.6732 3.89024 10.6881 3.79655 10.6893 3.70018C10.6947 3.25564 10.4057 2.86084 9.98038 2.73135ZM6.57028 6.64485C7.11058 6.09677 7.72838 5.63598 8.40126 5.27566C8.32141 6.33717 8.41781 7.40898 8.69079 8.44689C9.12451 10.096 9.98839 11.6003 11.1941 12.806C12.3998 14.0117 13.9041 14.8756 15.5532 15.3093C16.5911 15.5822 17.6629 15.6786 18.7244 15.5988C18.3641 16.2717 17.9033 16.8894 17.3553 17.4297C16.4063 18.3652 15.2288 19.0357 13.9401 19.3745C12.6513 19.7133 11.2963 19.7084 10.01 19.3605C8.72365 19.0125 7.55096 18.3336 6.60871 17.3914C5.66647 16.4492 4.98755 15.2765 4.63959 13.9902C4.29163 12.7039 4.28679 11.3488 4.62553 10.0601C4.96428 8.77132 5.63479 7.59381 6.57028 6.64485Z" fill="currentColor"/>
                    </svg>`;

    // Cart icon SVG
    const cartIconSVG = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="15" y="19" width="4" height="4" rx="2" fill="currentColor"/>
                        <rect x="7" y="19" width="4" height="4" rx="2" fill="currentColor"/>
                        <path d="M3 2H3.26541C4.26071 2 5.10455 2.73186 5.24531 3.71716L6.75469 14.2828C6.89545 15.2681 7.73929 16 8.73459 16H19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                        <path d="M6 5H18.5C18.7761 5 19 5.22386 19 5.5V10C19 11.1046 18.1046 12 17 12H7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>`;

    return {
        nav: `<!-- Navigation -->
    <nav class="nav">
        <div class="nav-container">
            <a href="${logoHref}" class="logo">
                <div class="logo-container">
                    <div class="logo-svg"></div>
                    <span class="logo-text">Side Hustle</span>
                </div>
            </a>
            <div class="nav-right">
                <ul class="nav-links">
                    ${desktopLinks}
                </ul>
                <a href="cart.html" class="cart-icon" aria-label="Shopping cart">
                    ${cartIconSVG}
                    <span class="cart-icon__badge" data-count="0"></span>
                </a>
                <button class="nav-theme-toggle" onclick="toggleTheme()">
                    ${themeToggleSVG}
                </button>
            </div>
        </div>
    </nav>`,

        mobileToggle: `<!-- Mobile Menu Toggle Button -->
    <button class="nav-mobile-toggle" onclick="toggleMobileMenu()" aria-label="Toggle mobile menu">
        <span class="hamburger-bar"></span>
        <span class="hamburger-bar"></span>
        <span class="hamburger-bar"></span>
    </button>`,

        mobileMenu: `<!-- Mobile Menu Overlay -->
    <div class="mobile-menu-overlay" id="mobileMenuOverlay">
        <div class="mobile-menu-content">
            <nav class="mobile-nav">
                ${mobileLinks}
                <a href="cart.html" class="mobile-cart-link">
                    <span class="mobile-link-text">Cart</span>
                    <span class="cart-icon__badge cart-icon__badge--mobile" data-count="0"></span>
                </a>
            </nav>
            <button class="mobile-theme-toggle" onclick="toggleTheme()">
                ${themeToggleSVG}
            </button>
        </div>
    </div>`
    };
}

/**
 * Initialize navigation on page load
 */
function initNavigation() {
    // Determine current page
    const pathname = window.location.pathname;
    let currentPage = 'index';

    if (pathname.includes('lab')) {
        currentPage = 'lab';
    } else if (pathname.includes('shop-all')) {
        currentPage = 'shop-all';
    } else if (pathname.includes('art')) {
        currentPage = 'art';
    } else if (pathname.includes('digital')) {
        currentPage = 'digital';
    }

    // Generate navigation HTML
    const navHTML = generateNavigation(currentPage);

    // Insert navigation elements
    const navPlaceholder = document.getElementById('nav-placeholder');
    if (navPlaceholder) {
        navPlaceholder.innerHTML = navHTML.nav + '\n\n    ' + navHTML.mobileToggle + '\n\n    ' + navHTML.mobileMenu;

        // Dispatch custom event to notify that navigation has been inserted
        window.dispatchEvent(new CustomEvent('navigationLoaded'));
    }
}

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigation);
} else {
    initNavigation();
}
