import { SAMPLE_WAITLIST_TOKEN } from "./demo-progress";

export const GITHUB_REPO_URL = "https://github.com/Privoce/OpenWaitlist";
export const APP_DOMAIN = "app.openwaitlist.privoce.com";
export const MARKETING_DOMAIN = "openwaitlist.privoce.com";
export const LIVE_APP_URL = `https://${APP_DOMAIN}`;
export const SAMPLE_WAITLIST_URL = `${LIVE_APP_URL}/p/waitlist/${SAMPLE_WAITLIST_TOKEN}/`;
export const SITE_DOMAIN = APP_DOMAIN;
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? `https://${APP_DOMAIN}`;
export const CALENDLY_URL =
  "https://calendly.com/hansu-privoce/han-meeting?month=2025-04";
