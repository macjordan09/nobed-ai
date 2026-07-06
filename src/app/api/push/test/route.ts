import { NextResponse } from "next/server";
import { broadcast } from "@/lib/push";

// Send a test alert to all registered devices (used by the app's Alerts screen).
export async function POST() {
  const result = await broadcast({
    title: "🔔 NoBed.ai test alert",
    body: "Alerts are working. You'll be notified of capacity-red and referral events.",
    data: { type: "test" },
  });
  return NextResponse.json({ ok: true, ...result });
}
