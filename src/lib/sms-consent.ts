import { BRAND_NAME } from "./brand";

export const PRIVACY_URL = "https://app.openwaitlist.privoce.com/privacy/";
export const TERMS_URL = "https://app.openwaitlist.privoce.com/terms/";

export function smsOptInLabel() {
  return `I agree to receive automated waitlist text messages from ${BRAND_NAME} at the phone number above. Message frequency varies. Message and data rates may apply. Consent is not required to dine. Reply STOP to cancel. Reply HELP for help.`;
}
