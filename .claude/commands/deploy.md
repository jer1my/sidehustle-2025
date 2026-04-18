---
description: Commit changes, merge to main, push both branches, return to dev
---

Please follow these steps:

1. **Auto-update cache busting version**: Generate a Unix timestamp and update ALL root HTML files to use the new `?v={timestamp}` on every local `.js` and `.css` asset reference. Also update ES module `import` statements in JS files that reference data files and inter-module imports (these use single quotes with `?v=`). Then rebuild product pages and blog pages.

   Use this bash command:
   ```bash
   TIMESTAMP=$(date +%s) && for f in index.html shop-all.html cart.html checkout-success.html lab.html art.html digital.html blog.html; do sed -i '' -E "s|(\\.js)\?v=[0-9]+\"|\1?v=$TIMESTAMP\"|g" "$f" && sed -i '' -E "s|(\\.css)\?v=[0-9]+\"|\1?v=$TIMESTAMP\"|g" "$f"; done && for f in assets/js/gallery/gallery-detail.js assets/js/gallery/gallery-grid.js assets/js/gallery/hero-gallery.js assets/js/gallery/product-card.js assets/js/blog/blog-detail.js assets/js/blog/blog-grid.js assets/js/blog/blog-card.js; do sed -i '' -E "s|(\\.js)\?v=[0-9]+'|\1?v=$TIMESTAMP'|g" "$f"; done && sed -i '' -E "s|(\\.css)\?v=[0-9]+'|\1?v=$TIMESTAMP'|g" assets/css/main.css && npm run build:all && echo "Cache version updated to: $TIMESTAMP"
   ```

2. Review the current changes with git status and git diff
3. Create a commit with an appropriate commit message (include the Claude Code footer)
4. Merge the development branch to main
5. Push both development and main branches to origin
6. Return to the development branch

Make sure to check for any conflicts during the merge and handle them appropriately.
