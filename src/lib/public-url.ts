export function getSiteUrl() {
  const url =
    process.env.SITE_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://openwaitlist.vercel.app";
  return url.replace(/\/$/, "");
}

export function waitlistProgressUrl(publicToken: string) {
  return `${getSiteUrl()}/p/waitlist/${publicToken}/`;
}

export function generatePublicToken(length = 10) {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(bytes, (byte) => chars[byte % chars.length]).join("");
}
