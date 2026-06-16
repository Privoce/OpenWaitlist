import { NextResponse } from "next/server";
import { listMessagesForEntry, sendStaffMessage } from "@/lib/messages";
import { getWaitlistEntry } from "@/lib/waitlist";

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

  const messages = await listMessagesForEntry(id);
  return NextResponse.json({ entry, messages });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const entry = await getWaitlistEntry(id);

  if (!entry) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json();
  const text = String(body.text ?? "").trim();

  if (!text) {
    return NextResponse.json({ error: "Message text is required" }, { status: 400 });
  }

  try {
    const message = await sendStaffMessage(entry, text);
    const messages = await listMessagesForEntry(id);
    return NextResponse.json({ message, messages });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to send SMS" },
      { status: 400 },
    );
  }
}
