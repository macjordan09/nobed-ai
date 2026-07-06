import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { can } from "@/lib/rbac";

// Moderate a community report — admins / auditors.
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = getSession();
  if (!session || !can(session.role, "view_analytics")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { status } = await req.json().catch(() => ({}));
  if (!["VERIFIED", "DISMISSED", "PENDING"].includes(status)) {
    return NextResponse.json({ error: "status must be VERIFIED, DISMISSED or PENDING" }, { status: 400 });
  }
  const report = await prisma.communityReport.findUnique({ where: { id: params.id } });
  if (!report) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.communityReport.update({
    where: { id: params.id },
    data: { status, reviewedBy: session.name, reviewedAt: new Date() },
  });
  await prisma.auditLog.create({
    data: {
      userId: session.userId,
      actorLabel: session.name,
      action: "MODERATE_REPORT",
      entityType: "CommunityReport",
      entityId: report.id,
      oldValue: report.status,
      newValue: status,
    },
  });
  return NextResponse.json({ ok: true, report: updated });
}
