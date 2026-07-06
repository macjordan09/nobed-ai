import { NextResponse } from "next/server";
import { requestOtp } from "@/lib/otp";

export async function POST(req: Request) {
  const { target, channel, purpose } = await req.json().catch(() => ({}));
  if (!target) return NextResponse.json({ error: "target required" }, { status: 400 });
  const result = await requestOtp(String(target), channel || "phone", purpose || "report");
  // devCode is included in non-production so the demo can be completed without SMS.
  return NextResponse.json(result);
}
