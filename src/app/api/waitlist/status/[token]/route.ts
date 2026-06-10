import { NextResponse } from "next/server";
import { getWaitlistProgress } from "@/lib/waitlist";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const progress = await getWaitlistProgress(token);

  if (!progress) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(progress);
}
