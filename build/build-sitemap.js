#!/usr/bin/env node

/**
 * Sitemap Build Script
 *
 * Generates sitemap.xml by scanning gallery and blog folders.
 * Run after build and build:blog so all pages are accounted for.
 *
 * Usage: npm run build:sitemap
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const GALLERY_DIR = path.join(ROOT, 'assets', 'images', 'gallery');
const BLOG_DIR = path.join(ROOT, 'assets', 'content', 'blog');
const OUTPUT = path.join(ROOT, 'sitemap.xml');
const BASE_URL = 'https://www.sidehustle.llc';

function readJSON(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function toXmlDate(dateString) {
    // Accepts YYYY-MM-DD or ISO string
    return dateString.slice(0, 10);
}

function url(loc, lastmod, priority = '0.8', changefreq = 'monthly') {
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

function build() {
    const today = new Date().toISOString().slice(0, 10);
    const entries = [];

    // Static pages
    entries.push(url(`${BASE_URL}/`, today, '1.0', 'weekly'));
    entries.push(url(`${BASE_URL}/shop-all.html`, today, '0.9', 'weekly'));
    entries.push(url(`${BASE_URL}/blog.html`, today, '0.9', 'weekly'));

    // Gallery / product pages
    const galleryFolders = fs.readdirSync(GALLERY_DIR, { withFileTypes: true })
        .filter(d => d.isDirectory() && !d.name.startsWith('_'))
        .map(d => d.name)
        .sort();

    for (const folder of galleryFolders) {
        const itemPath = path.join(GALLERY_DIR, folder, 'item.json');
        if (!fs.existsSync(itemPath)) continue;
        const item = readJSON(itemPath);
        const lastmod = toXmlDate(item.dateCreated || today);
        entries.push(url(`${BASE_URL}/product/${folder}.html`, lastmod, '0.8', 'monthly'));
    }

    // Blog post pages
    const blogFolders = fs.readdirSync(BLOG_DIR, { withFileTypes: true })
        .filter(d => d.isDirectory() && !d.name.startsWith('_'))
        .map(d => d.name)
        .sort();

    for (const folder of blogFolders) {
        const postPath = path.join(BLOG_DIR, folder, 'post.json');
        if (!fs.existsSync(postPath)) continue;
        const post = readJSON(postPath);
        const lastmod = toXmlDate(post.datePublished || today);
        entries.push(url(`${BASE_URL}/blog/${folder}.html`, lastmod, '0.7', 'monthly'));
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`;

    fs.writeFileSync(OUTPUT, xml, 'utf-8');
    console.log(`  Generated: sitemap.xml (${entries.length} URLs)`);
}

build();
