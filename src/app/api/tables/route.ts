import { NextResponse } from "next/server";
import { listTables } from "@/lib/waitlist";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(listTables());
}
