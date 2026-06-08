import { NextResponse } from "next/server";
import { getWaitlistEntry, updateWaitlistStatus } from "@/lib/waitlist";
import { sendStatusNotification, sendTableReadyNotification } from "@/lib/sms";
import type { WaitlistStatus } from "@/lib/types";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const entry = await getWaitlistEntry(id);

  if (!entry) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(entry);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const status = body.status as WaitlistStatus;

  if (!status) {
    return NextResponse.json({ error: "Status is required" }, { status: 400 });
  }

  const entry = await updateWaitlistStatus(id, status, body.table_id);

  if (!entry) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (status === "notified") {
    void sendTableReadyNotification(entry).catch((error) => {
      console.error("[Telnyx] Table ready notification failed:", error);
    });
  } else {
    void sendStatusNotification(entry, status).catch((error) => {
      console.error(`[VoceChat] ${status} notification failed:`, error);
    });
  }

  return NextResponse.json(entry);
}
