import { NextResponse } from "next/server";
import {
  createWaitlistEntry,
  getActiveWaitlistCount,
  listWaitlistEntries,
  searchWaitlistEntries,
} from "@/lib/waitlist";
import { attachUnreadCounts } from "@/lib/messages";
import { sendQueueConfirmation } from "@/lib/sms";
import type { WaitlistStatus } from "@/lib/types";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const q = searchParams.get("q");

  if (q) {
    return NextResponse.json(await attachUnreadCounts(await searchWaitlistEntries(q)));
  }

  if (status) {
    const statuses = status.split(",") as WaitlistStatus[];
    return NextResponse.json(
      await attachUnreadCounts(await listWaitlistEntries(statuses)),
    );
  }

  const entries = await attachUnreadCounts(
    await listWaitlistEntries(["waiting", "notified", "checked_in"]),
  );
  const count = await getActiveWaitlistCount();

  return NextResponse.json({ entries, count });
}

export async function POST(request: Request) {
  const body = await request.json();

  const smsOptIn = Boolean(body.sms_opt_in);
  const phone = String(body.phone ?? "").trim();

  if (!body.name?.trim() || !body.party_size) {
    return NextResponse.json(
      { error: "Name and party size are required" },
      { status: 400 },
    );
  }

  if (smsOptIn && phone.replace(/\D/g, "").length < 10) {
    return NextResponse.json(
      { error: "A valid phone number is required to receive SMS updates" },
      { status: 400 },
    );
  }

  const entry = await createWaitlistEntry({
    name: body.name,
    phone,
    party_size: Number(body.party_size),
    child_count: body.child_count ? Number(body.child_count) : 0,
    notes: body.notes ?? "",
    source: body.source ?? "kiosk",
    sms_opt_in: smsOptIn,
  });

  if (entry.sms_opt_in && entry.phone) {
    void sendQueueConfirmation(entry).catch((error) => {
      console.error("[Telnyx] Queue confirmation failed:", error);
    });
  }

  return NextResponse.json(entry, { status: 201 });
}
