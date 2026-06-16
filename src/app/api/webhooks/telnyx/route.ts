import { NextResponse } from "next/server";
import { processInboundSms } from "@/lib/messages";

interface TelnyxWebhookPayload {
  from?: { phone_number?: string };
  text?: string;
  id?: string;
}

interface TelnyxWebhookBody {
  data?: {
    event_type?: string;
    payload?: TelnyxWebhookPayload;
  };
}

function extractInboundEvent(body: TelnyxWebhookBody) {
  const eventType = body.data?.event_type;
  if (eventType !== "message.received") {
    return null;
  }

  const payload = body.data?.payload;
  const from = payload?.from?.phone_number?.trim();
  const text = payload?.text ?? "";
  const telnyxMessageId = payload?.id?.trim();

  if (!from || !telnyxMessageId) {
    return null;
  }

  return { from, text, telnyxMessageId };
}

export async function POST(request: Request) {
  let body: TelnyxWebhookBody;

  try {
    body = (await request.json()) as TelnyxWebhookBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const event = extractInboundEvent(body);
  if (!event) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  try {
    const result = await processInboundSms(event);
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error("[Telnyx] Inbound webhook failed:", error);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
