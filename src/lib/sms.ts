import { NOTIFY_UID, sendNotification } from "./vocechat";
import type { WaitlistEntry, WaitlistStatus } from "./types";
import { getSettings } from "./waitlist";

async function deliver(message: string) {
  await sendNotification(message);
  return { success: true, message, uid: NOTIFY_UID };
}

export async function sendQueueConfirmation(
  entry: WaitlistEntry,
  tablesAhead: number,
) {
  const { restaurant_name } = await getSettings();
  const message = `${restaurant_name}: Congrats ${entry.name}, you are on the queue! Your number is ${entry.ticket_number}, there are ${tablesAhead} tables waiting ahead. We will text you asap...`;

  try {
    return await deliver(message);
  } catch (error) {
    console.error("[VoceChat] Queue confirmation failed:", error);
    return { success: false, message, uid: NOTIFY_UID, error: String(error) };
  }
}

export async function sendTableReadyNotification(entry: WaitlistEntry) {
  const { restaurant_name } = await getSettings();
  const message = `${restaurant_name}: Hi ${entry.name}, it's your turn now! Please show the number ${entry.ticket_number} to the host when you have arrived. [powered by OpenWaitlist]`;

  try {
    return await deliver(message);
  } catch (error) {
    console.error("[VoceChat] Table ready notification failed:", error);
    return { success: false, message, uid: NOTIFY_UID, error: String(error) };
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
  if (!message) return { success: true, skipped: true, uid: NOTIFY_UID };

  try {
    return await deliver(message);
  } catch (error) {
    console.error(`[VoceChat] ${status} notification failed:`, error);
    return { success: false, message, uid: NOTIFY_UID, error: String(error) };
  }
}

export async function sendTestNotification() {
  const { restaurant_name } = await getSettings();
  const message = `${restaurant_name}: OpenWaitlist VoceChat test — notifications are working.`;
  return deliver(message);
}
