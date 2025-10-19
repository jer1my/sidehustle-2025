---
description: Commit changes, merge to main, push both branches, return to dev
---

Please follow these steps:

1. **Auto-update cache busting version**: Generate a Unix timestamp and update index.html to use `?v={timestamp}` for main.css.

   Use this bash command:
   ```bash
   TIMESTAMP=$(date +%s) && sed -i '' "s|main\.css?v=[0-9]*\"|main.css?v=$TIMESTAMP\"|g" index.html && echo "Cache version updated to: $TIMESTAMP"
   ```

2. Review the current changes with git status and git diff
3. Create a commit with an appropriate commit message (include the Claude Code footer)
4. Merge the development branch to main
5. Push both development and main branches to origin
6. Return to the development branch

Make sure to check for any conflicts during the merge and handle them appropriately.