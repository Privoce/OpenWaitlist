# Enable GitHub Pages (required — site will 404 until this is done)

Your DNS is already correct (`openwaitlist.privoce.com` → `privoce.github.io`).

The deploy workflow **builds successfully** but **cannot publish** until Pages is enabled in the repo. Every deploy has failed with:

> Failed to create deployment (status: 404) — Ensure GitHub Pages has been enabled

## Fix (about 30 seconds)

You need **admin access** on the `Privoce/OpenWaitlist` repository.

1. Open: **https://github.com/Privoce/OpenWaitlist/settings/pages**

2. Under **Build and deployment**, set **Source** to **GitHub Actions**  
   (Do **not** choose “Deploy from a branch”.)

3. Under **Custom domain**, enter: `openwaitlist.privoce.com`  
   Click **Save**. Wait for the DNS check to pass (your CNAME is already set).

4. Re-run the deploy:  
   **https://github.com/Privoce/OpenWaitlist/actions/workflows/deploy-pages.yml** → **Run workflow**

5. When the workflow shows green, visit: **https://openwaitlist.privoce.com**

## Verify it worked

- Actions run: both **build** and **deploy** jobs should be green
- Settings → Pages should show: “Your site is live at `https://openwaitlist.privoce.com`”

## Alternate URL

Without a custom domain, the site would be at `https://privoce.github.io/OpenWaitlist/` (requires `GITHUB_PAGES_BASE_PATH=/OpenWaitlist` in the workflow). The current setup targets the custom domain at the root.
