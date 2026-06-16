import { BRAND_NAME } from "./brand";
import { MAX_DEMO_SMS_PER_GUEST } from "./demo-limits";
import { logOutboundMessage, updateMessageStatus } from "./messages";
import { queryOne } from "./db";
import { waitlistProgressUrl } from "./public-url";
import { isTelnyxConfigured, sendSms } from "./telnyx";
import { NOTIFY_UID, sendNotification } from "./vocechat";
import type { WaitlistEntry, WaitlistStatus } from "./types";

async function pollAndUpdateDelivery(messageId: string, telnyxId: string) {
  const apiKey = process.env.TELNYX_API_KEY;
  if (!apiKey) return;

  try {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const response = await fetch(`https://api.telnyx.com/v2/messages/${telnyxId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!response.ok) return;

    const payload = (await response.json()) as {
      data?: { to?: Array<{ status?: string }>; errors?: unknown[] };
    };
    const toStatus = payload.data?.to?.[0]?.status;
    if (toStatus === "delivered") {
      await updateMessageStatus(messageId, "delivered");
    } else if (toStatus === "delivery_failed" || payload.data?.errors?.length) {
      await updateMessageStatus(messageId, "failed");
    }
  } catch {
    // Keep sent status if polling fails.
  }
}

async function deliverToCustomer(entry: WaitlistEntry, message: string) {
  if (!isTelnyxConfigured()) {
    throw new Error("Telnyx SMS is not configured");
  }

  const row = await queryOne(
    `SELECT COUNT(*) AS count FROM sms_messages
     WHERE waitlist_entry_id = ? AND direction = 'outbound'`,
    [entry.id],
  );
  if (Number(row?.count ?? 0) >= MAX_DEMO_SMS_PER_GUEST) {
    throw new Error(
      `Demo limit: maximum ${MAX_DEMO_SMS_PER_GUEST} messages per guest.`,
    );
  }

  const result = await sendSms(entry.phone, message);
  const messageId = await logOutboundMessage({
    waitlist_entry_id: entry.id,
    body: message,
    telnyx_message_id: result.id ?? null,
    status: "sent",
    sent_by: "system",
  });

  if (result.id) {
    void pollAndUpdateDelivery(messageId, result.id);
  }

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
