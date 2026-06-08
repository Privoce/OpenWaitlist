import { NextResponse } from "next/server";
import { getTable, releaseTable } from "@/lib/waitlist";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const table = await getTable(id);

  if (!table) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(table);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();

  if (body.action === "release") {
    const table = await releaseTable(id);
    if (!table) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(table);
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
