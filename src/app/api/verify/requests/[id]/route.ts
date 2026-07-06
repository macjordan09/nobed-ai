import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { can } from "@/lib/rbac";

// Approve / reject a staff access request. Approving verifies the user account,
// which unlocks capacity updates for them. Super admins (manage_users) or the
// staff member's hospital admin may decide.
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = getSession();
  const allowed = session && (can(session.role, "manage_users") || session.role === "HOSPITAL_ADMIN");
  if (!allowed) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { decision } = await req.json().catch(() => ({}));
  if (!["APPROVED", "REJECTED"].includes(decision)) {
    return NextResponse.json({ error: "decision must be APPROVED or REJECTED" }, { status: 400 });
  }
  const reqRow = await prisma.verificationRequest.findUnique({ where: { id: params.id } });
  if (!reqRow) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.verificationRequest.update({
    where: { id: params.id },
    data: { status: decision, reviewedBy: session!.name, reviewedAt: new Date() },
  });

  if (decision === "APPROVED") {
    await prisma.user.update({
      where: { id: reqRow.userId },
      data: { isVerified: true, verifiedAt: new Date() },
    });
  }

  await prisma.auditLog.create({
    data: {
      userId: session!.userId,
      actorLabel: session!.name,
      action: "REVIEW_STAFF_VERIFICATION",
      entityType: "User",
      entityId: reqRow.userId,
      newValue: decision,
    },
  });

  return NextResponse.json({ ok: true });
}
