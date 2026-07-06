import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { verifyOtp } from "@/lib/otp";
import { REPORT_TYPES } from "@/lib/verification";

// List reports — admins / auditors only.
export async function GET() {
  const session = getSession();
  if (!session || !can(session.role, "view_analytics")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const reports = await prisma.communityReport.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  return NextResponse.json({ count: reports.length, reports });
}

// Submit a report — public. Optional OTP phone verification raises trust.
export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  if (!b.hospitalId || !b.reportType || !REPORT_TYPES[b.reportType]) {
    return NextResponse.json({ error: "hospitalId and a valid reportType are required" }, { status: 400 });
  }
  const hospital = await prisma.hospital.findUnique({ where: { id: String(b.hospitalId) } });
  if (!hospital) return NextResponse.json({ error: "Unknown hospital" }, { status: 404 });

  // If a phone is supplied it must be OTP-verified to be marked trusted.
  let reporterVerified = false;
  if (b.phone) {
    if (!b.code) return NextResponse.json({ error: "OTP code required for phone verification" }, { status: 400 });
    const otp = await verifyOtp(String(b.phone), String(b.code), "report");
    if (!otp.ok) return NextResponse.json({ error: otp.reason || "OTP failed" }, { status: 400 });
    reporterVerified = true;
  }

  const report = await prisma.communityReport.create({
    data: {
      hospitalId: hospital.id,
      hospitalName: hospital.name,
      reporterPhone: b.phone ? String(b.phone) : null,
      reporterVerified,
      reportType: String(b.reportType),
      message: b.message ? String(b.message) : null,
    },
  });
  return NextResponse.json({ ok: true, report });
}
