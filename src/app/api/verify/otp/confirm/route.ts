import { NextResponse } from "next/server";
import { verifyOtp } from "@/lib/otp";

export async function POST(req: Request) {
  const { target, code, purpose } = await req.json().catch(() => ({}));
  if (!target || !code) {
    return NextResponse.json({ error: "target and code required" }, { status: 400 });
  }
  const result = await verifyOtp(String(target), String(code), purpose || "report");
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
