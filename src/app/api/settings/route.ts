import { NextResponse } from "next/server";
import { getSettings, updateSettings } from "@/lib/waitlist";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(getSettings());
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const settings = updateSettings(body);
  return NextResponse.json(settings);
}
