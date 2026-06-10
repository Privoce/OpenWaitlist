# GitHub Pages setup

**Live site:** https://openwaitlist.privoce.com

## Which workflow to use

Use **only** `.github/workflows/deploy-pages.yml`. It is customized for OpenWaitlist:

- Static export with `GITHUB_PAGES=true`
- Strips API routes (not supported on Pages)
- Builds for custom domain at `/` (not `/OpenWaitlist`)
- Adds `.nojekyll` for Next.js assets

Do **not** use GitHub’s generic `nextjs.yml` template — it fails on this project (API routes, custom domain).

## If you need to re-enable Pages

1. **Settings → Pages** → Source: **GitHub Actions**
2. Custom domain: `openwaitlist.privoce.com`
3. Run **Actions → Deploy GitHub Pages**
