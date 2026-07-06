import { NextResponse } from "next/server";
import { handleSms } from "@/lib/sms";

export async function POST(req: Request) {
  const { phone, command } = await req.json().catch(() => ({}));
  if (!phone || !command) {
    return NextResponse.json({ error: "phone and command required" }, { status: 400 });
  }
  const result = await handleSms(String(phone), String(command));
  return NextResponse.json(result);
}
