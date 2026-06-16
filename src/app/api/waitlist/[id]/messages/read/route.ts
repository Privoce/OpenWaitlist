import { NextResponse } from "next/server";
import { markInboundMessagesRead } from "@/lib/messages";
import { getWaitlistEntry } from "@/lib/waitlist";

export const runtime = "nodejs";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const entry = await getWaitlistEntry(id);

  if (!entry) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const marked = await markInboundMessagesRead(id);
  return NextResponse.json({ ok: true, marked });
}
