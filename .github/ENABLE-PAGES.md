# Enable GitHub Pages (one-time setup)

The deploy workflow **builds successfully** but cannot publish until Pages is turned on for this repo.

## Steps

1. Open **Settings → Pages** for this repository:  
   https://github.com/Privoce/OpenWaitlist/settings/pages

2. Under **Build and deployment → Source**, choose **GitHub Actions** (not “Deploy from a branch”).

3. Re-run the latest workflow:  
   **Actions → Deploy GitHub Pages → Run workflow**  
   Or push any commit to `main`.

4. After it succeeds, the site will be at:  
   **https://privoce.github.io/OpenWaitlist/**

## Custom domain (optional)

To use **openwaitlist.privoce.com**:

1. In **Settings → Pages**, enter `openwaitlist.privoce.com` under **Custom domain** and save.
2. Add a DNS **CNAME** record: `openwaitlist` → `privoce.github.io`
3. When using a custom domain, update `next.config.ts` to use an empty `basePath` for GitHub Pages builds.

The `public/CNAME` file is already included in the build artifact.
