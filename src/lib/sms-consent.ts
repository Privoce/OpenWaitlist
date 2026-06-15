import { BRAND_NAME } from "./brand";

export const PRIVACY_URL = "https://app.openwaitlist.privoce.com/privacy/";
export const TERMS_URL = "https://app.openwaitlist.privoce.com/terms/";

export function smsOptInLabel() {
  return `I agree to receive automated demo waitlist text messages from ${BRAND_NAME} at the phone number above, to see how guest SMS notifications work in this product demo. Message frequency varies. Message and data rates may apply. This is not a live restaurant waitlist. Reply STOP to cancel. Reply HELP for help.`;
}
