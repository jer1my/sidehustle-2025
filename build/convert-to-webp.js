/**
 * convert-to-webp.js
 * Converts all PNG gallery images to WebP format.
 * PNGs are preserved as source files.
 *
 * Usage: npm run convert
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const GALLERY_DIR = path.join(__dirname, '..', 'assets', 'images', 'gallery');
const BLOG_DIR = path.join(__dirname, '..', 'assets', 'images', 'blog');
const QUALITY = 82; // Good balance of quality and filesize
const THUMB_WIDTH = 300;
const THUMB_HEIGHT = 400;

async function convertImage(pngPath) {
    const webpPath = pngPath.replace(/\.png$/, '.webp');
    const relativePath = path.relative(path.join(__dirname, '..'), pngPath);

    try {
        const pngStats = fs.statSync(pngPath);
        await sharp(pngPath)
            .webp({ quality: QUALITY })
            .toFile(webpPath);
        const webpStats = fs.statSync(webpPath);

        const savings = ((1 - webpStats.size / pngStats.size) * 100).toFixed(1);
        console.log(`  ✓ ${path.basename(webpPath)} (${formatSize(pngStats.size)} → ${formatSize(webpStats.size)}, ${savings}% smaller)`);
        return { png: pngStats.size, webp: webpStats.size };
    } catch (err) {
        console.error(`  ✗ Failed: ${relativePath} — ${err.message}`);
        return null;
    }
}

async function generateThumbnail(pngPath, thumbPath) {
    try {
        await sharp(pngPath)
            .resize(THUMB_WIDTH, THUMB_HEIGHT, {
                kernel: sharp.kernel.lanczos3,
                fit: 'cover'
            })
            .webp({ quality: QUALITY })
            .toFile(thumbPath);
        const thumbStats = fs.statSync(thumbPath);
        console.log(`  ✓ ${path.basename(thumbPath)} (${THUMB_WIDTH}×${THUMB_HEIGHT}, ${formatSize(thumbStats.size)})`);
        return true;
    } catch (err) {
        console.error(`  ✗ Thumbnail failed: ${path.basename(thumbPath)} — ${err.message}`);
        return false;
    }
}

function formatSize(bytes) {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

/**
 * Scan a directory for subfolders containing PNGs, convert + generate thumbnails
 */
async function processDirectory(baseDir, label) {
    let dirFolders;
    try {
        dirFolders = fs.readdirSync(baseDir, { withFileTypes: true })
            .filter(d => d.isDirectory() && !d.name.startsWith('_'))
            .map(d => d.name)
            .sort();
    } catch (e) {
        return { png: 0, webp: 0, files: 0, thumbs: 0 };
    }

    let totalPng = 0, totalWebp = 0, totalFiles = 0, totalThumbs = 0;

    for (const folder of dirFolders) {
        const folderPath = path.join(baseDir, folder);
        const pngFiles = fs.readdirSync(folderPath)
            .filter(f => f.endsWith('.png'))
            .sort();

        if (pngFiles.length === 0) continue;

        console.log(`${label}/${folder}/`);

        for (const file of pngFiles) {
            const result = await convertImage(path.join(folderPath, file));
            if (result) {
                totalPng += result.png;
                totalWebp += result.webp;
                totalFiles++;
            }
        }

        for (const file of pngFiles) {
            const baseName = file.replace(/\.png$/, '');
            const thumbPath = path.join(folderPath, `thumb-${baseName}.webp`);
            if (await generateThumbnail(path.join(folderPath, file), thumbPath)) totalThumbs++;
        }

        console.log('');
    }

    return { png: totalPng, webp: totalWebp, files: totalFiles, thumbs: totalThumbs };
}

async function main() {
    console.log(`Converting PNG → WebP (quality: ${QUALITY})\n`);

    // Process gallery images
    const gallery = await processDirectory(GALLERY_DIR, 'gallery');

    // Process blog images
    const blog = await processDirectory(BLOG_DIR, 'blog');

    const totalFiles = gallery.files + blog.files;
    const totalThumbs = gallery.thumbs + blog.thumbs;
    const totalPng = gallery.png + blog.png;
    const totalWebp = gallery.webp + blog.webp;

    if (totalPng > 0) {
        const totalSavings = ((1 - totalWebp / totalPng) * 100).toFixed(1);
        console.log(`Done! ${totalFiles} images converted, ${totalThumbs} thumbnails generated.`);
        console.log(`Total: ${formatSize(totalPng)} → ${formatSize(totalWebp)} (${totalSavings}% smaller)`);
    } else {
        console.log('No PNG images found to convert.');
    }
}

main().catch(err => {
    console.error('Conversion failed:', err);
    process.exit(1);
});
