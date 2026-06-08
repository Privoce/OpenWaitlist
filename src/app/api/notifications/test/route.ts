import { NextResponse } from "next/server";
import { sendTestNotification } from "@/lib/sms";

export const runtime = "nodejs";

export async function POST() {
  try {
    const result = await sendTestNotification();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 },
    );
  }
}
