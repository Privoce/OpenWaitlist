import { NextResponse } from "next/server";
import {
  createWaitlistEntry,
  getActiveWaitlistCount,
  listWaitlistEntries,
  searchWaitlistEntries,
} from "@/lib/waitlist";
import { sendQueueConfirmation } from "@/lib/sms";
import type { WaitlistStatus } from "@/lib/types";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const q = searchParams.get("q");

  if (q) {
    return NextResponse.json(await searchWaitlistEntries(q));
  }

  if (status) {
    const statuses = status.split(",") as WaitlistStatus[];
    return NextResponse.json(await listWaitlistEntries(statuses));
  }

  const entries = await listWaitlistEntries(["waiting", "notified", "checked_in"]);
  const count = await getActiveWaitlistCount();

  return NextResponse.json({ entries, count });
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.name?.trim() || !body.phone?.trim() || !body.party_size) {
    return NextResponse.json(
      { error: "Name, phone, and party size are required" },
      { status: 400 },
    );
  }

  const entry = await createWaitlistEntry({
    name: body.name,
    phone: body.phone,
    party_size: Number(body.party_size),
    child_count: body.child_count ? Number(body.child_count) : 0,
    notes: body.notes ?? "",
    source: body.source ?? "kiosk",
  });

  const active = await listWaitlistEntries(["waiting", "notified", "checked_in"]);
  const tablesAhead = Math.max(0, active.length - 1);

  void sendQueueConfirmation(entry, tablesAhead).catch((error) => {
    console.error("[VoceChat] Queue confirmation failed:", error);
  });

  return NextResponse.json(entry, { status: 201 });
}
