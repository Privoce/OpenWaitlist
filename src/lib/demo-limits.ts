export const MAX_DEMO_SMS_PER_GUEST = 10;
export const MAX_DEMO_SMS_PER_SESSION = 10;

const SESSION_COUNT_KEY = "openwaitlist:session-sms-count";
const NOTICE_DISMISSED_KEY = "openwaitlist:demo-notice-dismissed";

export function getSessionSmsCount(): number {
  if (typeof window === "undefined") return 0;
  return Number(sessionStorage.getItem(SESSION_COUNT_KEY) ?? "0");
}

export function incrementSessionSmsCount(): number {
  const next = getSessionSmsCount() + 1;
  sessionStorage.setItem(SESSION_COUNT_KEY, String(next));
  return next;
}

export function isSessionSmsLimitReached(): boolean {
  return getSessionSmsCount() >= MAX_DEMO_SMS_PER_SESSION;
}

export function isDemoNoticeDismissed(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(NOTICE_DISMISSED_KEY) === "1";
}

export function dismissDemoNotice() {
  sessionStorage.setItem(NOTICE_DISMISSED_KEY, "1");
}

export const DEMO_SMS_LIMIT_MESSAGE = `Demo limit: maximum ${MAX_DEMO_SMS_PER_SESSION} SMS per browser session.`;
