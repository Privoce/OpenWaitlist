import { BRAND_NAME } from "./brand";
import { execute, queryAll, queryOne } from "./db";
import { MAX_DEMO_SMS_PER_GUEST } from "./demo-limits";
import { isTelnyxConfigured, sendSms } from "./telnyx";
import { findWaitlistEntryByPhone, optOutSmsByPhone } from "./waitlist";
import { LIVE_APP_URL } from "./site";
import type {
  SmsMessage,
  SmsMessageDirection,
  SmsMessageSender,
  SmsMessageStatus,
  WaitlistEntry,
} from "./types";

const STOP_KEYWORDS = new Set(["STOP", "STOPALL", "UNSUBSCRIBE", "CANCEL", "END", "QUIT"]);
const HELP_KEYWORDS = new Set(["HELP", "INFO"]);

async function assertGuestMessageLimit(waitlistEntryId: string) {
  const row = await queryOne(
    `SELECT COUNT(*) AS count FROM sms_messages
     WHERE waitlist_entry_id = ? AND direction = 'outbound'`,
    [waitlistEntryId],
  );
  const count = Number(row?.count ?? 0);
  if (count >= MAX_DEMO_SMS_PER_GUEST) {
    throw new Error(
      `Demo limit: maximum ${MAX_DEMO_SMS_PER_GUEST} messages per guest.`,
    );
  }
}

function rowToMessage(row: Record<string, unknown>): SmsMessage {
  return {
    id: row.id as string,
    waitlist_entry_id: row.waitlist_entry_id as string,
    direction: row.direction as SmsMessageDirection,
    body: row.body as string,
    status: row.status as SmsMessageStatus,
    telnyx_message_id: (row.telnyx_message_id as string | null) ?? null,
    sent_by: row.sent_by as SmsMessageSender,
    created_at: row.created_at as string,
  };
}

async function pollTelnyxDelivery(messageId: string): Promise<SmsMessageStatus> {
  const apiKey = process.env.TELNYX_API_KEY;
  if (!apiKey) return "sent";

  try {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const response = await fetch(`https://api.telnyx.com/v2/messages/${messageId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!response.ok) return "sent";

    const payload = (await response.json()) as {
      data?: { to?: Array<{ status?: string }>; errors?: unknown[] };
    };
    const toStatus = payload.data?.to?.[0]?.status;
    if (toStatus === "delivered") return "delivered";
    if (toStatus === "delivery_failed" || payload.data?.errors?.length) return "failed";
    return "sent";
  } catch {
    return "sent";
  }
}

async function messageExistsByTelnyxId(telnyxMessageId: string): Promise<boolean> {
  const row = await queryOne(
    "SELECT id FROM sms_messages WHERE telnyx_message_id = ?",
    [telnyxMessageId],
  );
  return Boolean(row);
}

export async function logOutboundMessage(input: {
  waitlist_entry_id: string;
  body: string;
  telnyx_message_id?: string | null;
  status?: SmsMessageStatus;
  sent_by?: SmsMessageSender;
}) {
  const id = crypto.randomUUID();
  await execute(
    `INSERT INTO sms_messages (id, waitlist_entry_id, direction, body, status, telnyx_message_id, sent_by)
     VALUES (?, ?, 'outbound', ?, ?, ?, ?)`,
    [
      id,
      input.waitlist_entry_id,
      input.body,
      input.status ?? "sent",
      input.telnyx_message_id ?? null,
      input.sent_by ?? "system",
    ],
  );
  return id;
}

export async function logInboundMessage(input: {
  waitlist_entry_id: string;
  body: string;
  telnyx_message_id?: string | null;
}) {
  const id = crypto.randomUUID();
  await execute(
    `INSERT INTO sms_messages (id, waitlist_entry_id, direction, body, status, telnyx_message_id, sent_by)
     VALUES (?, ?, 'inbound', ?, 'received', ?, 'guest')`,
    [id, input.waitlist_entry_id, input.body, input.telnyx_message_id ?? null],
  );
  return id;
}

export async function updateMessageStatus(id: string, status: SmsMessageStatus) {
  await execute("UPDATE sms_messages SET status = ? WHERE id = ?", [status, id]);
}

export async function listMessagesForEntry(waitlistEntryId: string): Promise<SmsMessage[]> {
  const rows = await queryAll(
    `SELECT id, waitlist_entry_id, direction, body, status, telnyx_message_id, sent_by, created_at
     FROM sms_messages
     WHERE waitlist_entry_id = ?
     ORDER BY created_at ASC`,
    [waitlistEntryId],
  );
  return rows.map(rowToMessage);
}

function normalizeKeyword(text: string) {
  return text.trim().toUpperCase().replace(/[^\w]/g, "");
}

function isStopKeyword(text: string) {
  return STOP_KEYWORDS.has(normalizeKeyword(text));
}

function isHelpKeyword(text: string) {
  return HELP_KEYWORDS.has(normalizeKeyword(text));
}

async function sendAutoReply(entry: WaitlistEntry, body: string) {
  if (!isTelnyxConfigured() || !entry.phone?.trim()) return;

  const result = await sendSms(entry.phone, body);
  await logOutboundMessage({
    waitlist_entry_id: entry.id,
    body,
    telnyx_message_id: result.id ?? null,
    status: "sent",
    sent_by: "system",
  });
}

export async function processInboundSms(input: {
  from: string;
  text: string;
  telnyxMessageId: string;
}) {
  const { from, text, telnyxMessageId } = input;
  const trimmed = text.trim();

  if (!trimmed || !telnyxMessageId) {
    return { handled: false, reason: "empty" as const };
  }

  if (await messageExistsByTelnyxId(telnyxMessageId)) {
    return { handled: true, reason: "duplicate" as const };
  }

  const entry = await findWaitlistEntryByPhone(from);

  if (isStopKeyword(trimmed)) {
    await optOutSmsByPhone(from);
    if (entry) {
      await logInboundMessage({
        waitlist_entry_id: entry.id,
        body: trimmed,
        telnyx_message_id: telnyxMessageId,
      });
      await sendAutoReply(
        entry,
        `${BRAND_NAME} demo: You are unsubscribed and will not receive more demo texts. Reply HELP for help.`,
      );
    }
    return { handled: true, reason: "stop" as const };
  }

  if (isHelpKeyword(trimmed)) {
    if (entry) {
      await logInboundMessage({
        waitlist_entry_id: entry.id,
        body: trimmed,
        telnyx_message_id: telnyxMessageId,
      });
      await sendAutoReply(
        entry,
        `${BRAND_NAME} demo: Product demo for restaurant waitlist software. Visit ${LIVE_APP_URL} Reply STOP to cancel.`,
      );
    } else {
      await sendSms(
        from,
        `${BRAND_NAME} demo: Product demo for restaurant waitlist software. Visit ${LIVE_APP_URL} Reply STOP to cancel.`,
      );
    }
    return { handled: true, reason: "help" as const };
  }

  if (!entry) {
    return { handled: false, reason: "unknown_sender" as const };
  }

  await logInboundMessage({
    waitlist_entry_id: entry.id,
    body: trimmed,
    telnyx_message_id: telnyxMessageId,
  });

  return { handled: true, reason: "message" as const, entryId: entry.id };
}

export async function sendStaffMessage(
  entry: WaitlistEntry,
  text: string,
): Promise<SmsMessage> {
  if (!entry.phone?.trim()) {
    throw new Error("This guest has no phone number on file.");
  }
  if (!entry.sms_opt_in) {
    throw new Error("This guest has opted out of SMS.");
  }
  if (!isTelnyxConfigured()) {
    throw new Error("Telnyx SMS is not configured.");
  }

  await assertGuestMessageLimit(entry.id);

  const trimmed = text.trim();
  if (!trimmed) {
    throw new Error("Message cannot be empty.");
  }
  if (trimmed.length > 320) {
    throw new Error("Message must be 320 characters or fewer.");
  }

  const body = `${BRAND_NAME} demo: ${trimmed} Reply HELP for help. Reply STOP to cancel.`;
  const result = await sendSms(entry.phone, body);

  const messageId = await logOutboundMessage({
    waitlist_entry_id: entry.id,
    body,
    telnyx_message_id: result.id ?? null,
    status: "sent",
    sent_by: "staff",
  });

  if (result.id) {
    const deliveryStatus = await pollTelnyxDelivery(result.id);
    if (deliveryStatus !== "sent") {
      await updateMessageStatus(messageId, deliveryStatus);
    }
  }

  const messages = await listMessagesForEntry(entry.id);
  const saved = messages.find((message) => message.id === messageId);
  if (!saved) {
    throw new Error("Message was sent but could not be loaded.");
  }
  return saved;
}
