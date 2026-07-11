import { NextResponse } from "next/server";
import { getHospitalViews } from "@/lib/hospitals";

// Always serve live data, never prerender at build time (no DB exists then).
export const dynamic = "force-dynamic";

// Public, read-only national capacity feed.
export async function GET() {
  const hospitals = await getHospitalViews();
  return NextResponse.json({ count: hospitals.length, hospitals });
}
