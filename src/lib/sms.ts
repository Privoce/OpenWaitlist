import { BRAND_NAME } from "./brand";
import { waitlistProgressUrl } from "./public-url";
import { isTelnyxConfigured, sendSms } from "./telnyx";
import { NOTIFY_UID, sendNotification } from "./vocechat";
import type { WaitlistEntry, WaitlistStatus } from "./types";

async function deliverToCustomer(entry: WaitlistEntry, message: string) {
  if (!isTelnyxConfigured()) {
    throw new Error("Telnyx SMS is not configured");
  }

  const result = await sendSms(entry.phone, message);
  return { success: true, message, channel: "telnyx" as const, ...result };
}

async function deliverToStaff(message: string) {
  await sendNotification(message);
  return { success: true, message, channel: "vocechat" as const, uid: NOTIFY_UID };
}

export async function sendQueueConfirmation(entry: WaitlistEntry) {
  const progressUrl = waitlistProgressUrl(entry.public_token);
  const message = `${BRAND_NAME} demo: You've been added to the sample waitlist. Your number is ${entry.ticket_number}. Check your place in line here: ${progressUrl} Reply HELP for help. Reply STOP to cancel.`;

  try {
    return await deliverToCustomer(entry, message);
  } catch (error) {
    console.error("[Telnyx] Queue confirmation failed:", error);
    return {
      success: false,
      message,
      channel: "telnyx" as const,
      error: String(error),
    };
  }
}

export async function sendTableReadyNotification(entry: WaitlistEntry) {
  const message = `${BRAND_NAME} demo: Hi ${entry.name}, it's your turn in this sample flow. Show ticket ${entry.ticket_number} to continue the demo. Reply HELP for help. Reply STOP to cancel.`;

  try {
    return await deliverToCustomer(entry, message);
  } catch (error) {
    console.error("[Telnyx] Table ready notification failed:", error);
    return {
      success: false,
      message,
      channel: "telnyx" as const,
      error: String(error),
    };
  }
}

export async function sendStatusNotification(
  entry: WaitlistEntry,
  status: WaitlistStatus,
) {
  const messages: Partial<Record<WaitlistStatus, string>> = {
    checked_in: `${BRAND_NAME}: ${entry.name} (${entry.ticket_number}) has checked in. Party of ${entry.party_size}. Phone: ${entry.phone}`,
    seated: `${BRAND_NAME}: ${entry.name} (${entry.ticket_number}) has been seated. Party of ${entry.party_size}.`,
    cancelled: `${BRAND_NAME}: ${entry.name} (${entry.ticket_number}) was removed from the waitlist.`,
  };

  const message = messages[status];
  if (!message) return { success: true, skipped: true, channel: "vocechat" as const, uid: NOTIFY_UID };

  try {
    return await deliverToStaff(message);
  } catch (error) {
    console.error(`[VoceChat] ${status} notification failed:`, error);
    return {
      success: false,
      message,
      channel: "vocechat" as const,
      uid: NOTIFY_UID,
      error: String(error),
    };
  }
}

export async function sendTestNotification() {
  if (isTelnyxConfigured()) {
    const testTo = process.env.TELNYX_TEST_TO?.trim();
    if (!testTo) {
      throw new Error(
        "Set TELNYX_TEST_TO to a phone number to run the Telnyx SMS test",
      );
    }

    const message = `${BRAND_NAME}: Telnyx test — SMS notifications are working.`;
    const result = await sendSms(testTo, message);
    return { success: true, message, channel: "telnyx" as const, ...result };
  }

  const message = `${BRAND_NAME}: VoceChat test — staff notifications are working.`;
  return deliverToStaff(message);
}
