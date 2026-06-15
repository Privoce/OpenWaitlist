import { BRAND_NAME } from "./brand";
import type { WaitlistProgress } from "./types";

export const SAMPLE_WAITLIST_TOKEN = "aBc12XyZ9k";

export function getSampleWaitlistProgress(): WaitlistProgress {
  return {
    restaurant_name: BRAND_NAME,
    ticket_number: "SE01",
    guest_name: "Jane",
    party_size: 2,
    status: "waiting",
    position: 3,
    parties_ahead: 2,
    status_message: "You're on the sample waitlist",
    wait_time: "12 mins",
  };
}

export function isSampleWaitlistToken(token: string) {
  return token === SAMPLE_WAITLIST_TOKEN;
}
