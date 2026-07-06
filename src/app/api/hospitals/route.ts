import { NextResponse } from "next/server";
import { getHospitalViews } from "@/lib/hospitals";

// Public, read-only national capacity feed.
export async function GET() {
  const hospitals = await getHospitalViews();
  return NextResponse.json({ count: hospitals.length, hospitals });
}
