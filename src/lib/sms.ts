import { isTelnyxConfigured, sendSms } from "./telnyx";
import { NOTIFY_UID, sendNotification } from "./vocechat";
import type { WaitlistEntry, WaitlistStatus } from "./types";
import { getSettings } from "./waitlist";

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

export async function sendQueueConfirmation(
  entry: WaitlistEntry,
  tablesAhead: number,
) {
  const { restaurant_name } = await getSettings();
  const message = `${restaurant_name}: Congrats ${entry.name}, you are on the queue! Your number is ${entry.ticket_number}, there are ${tablesAhead} tables waiting ahead. We will text you asap...`;

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
  const { restaurant_name } = await getSettings();
  const message = `${restaurant_name}: Hi ${entry.name}, it's your turn now! Please show the number ${entry.ticket_number} to the host when you have arrived. [powered by OpenWaitlist]`;

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
  const { restaurant_name } = await getSettings();

  const messages: Partial<Record<WaitlistStatus, string>> = {
    checked_in: `${restaurant_name}: ${entry.name} (${entry.ticket_number}) has checked in. Party of ${entry.party_size}. Phone: ${entry.phone}`,
    seated: `${restaurant_name}: ${entry.name} (${entry.ticket_number}) has been seated. Party of ${entry.party_size}.`,
    cancelled: `${restaurant_name}: ${entry.name} (${entry.ticket_number}) was removed from the waitlist.`,
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
  const { restaurant_name } = await getSettings();

  if (isTelnyxConfigured()) {
    const testTo = process.env.TELNYX_TEST_TO?.trim();
    if (!testTo) {
      throw new Error(
        "Set TELNYX_TEST_TO to a phone number to run the Telnyx SMS test",
      );
    }

    const message = `${restaurant_name}: OpenWaitlist Telnyx test — SMS notifications are working.`;
    const result = await sendSms(testTo, message);
    return { success: true, message, channel: "telnyx" as const, ...result };
  }

  const message = `${restaurant_name}: OpenWaitlist VoceChat test — staff notifications are working.`;
  return deliverToStaff(message);
}
