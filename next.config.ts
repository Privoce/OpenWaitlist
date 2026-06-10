import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";
// Custom domain (openwaitlist.privoce.com) serves from /. Use /OpenWaitlist only for github.io/project URLs.
const basePath = isGithubPages
  ? (process.env.GITHUB_PAGES_BASE_PATH ?? "")
  : "";

const nextConfig: NextConfig = {
  output: isGithubPages ? "export" : undefined,
  basePath,
  assetPrefix: isGithubPages ? `${basePath}/` : undefined,
  trailingSlash: isGithubPages,
  serverExternalPackages: ["better-sqlite3"],
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_STATIC_EXPORT: isGithubPages ? "1" : "0",
  },
};

export default nextConfig;
