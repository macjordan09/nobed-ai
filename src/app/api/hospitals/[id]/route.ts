import { NextResponse } from "next/server";
import { getHospitalView } from "@/lib/hospitals";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const hospital = await getHospitalView(params.id);
  if (!hospital) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(hospital);
}
