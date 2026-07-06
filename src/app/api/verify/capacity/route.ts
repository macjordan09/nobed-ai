import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { can } from "@/lib/rbac";

// A verified hospital user confirms the CURRENT capacity snapshot is accurate.
export async function POST(req: Request) {
  const session = getSession();
  if (!session || !can(session.role, "update_capacity") || !session.hospitalId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!session.isVerified) {
    return NextResponse.json({ error: "Your account is not verified yet." }, { status: 403 });
  }

  const now = new Date();
  await prisma.hospital.update({
    where: { id: session.hospitalId },
    data: { verifiedAt: now, verifiedBy: session.name },
  });
  await prisma.auditLog.create({
    data: {
      userId: session.userId,
      actorLabel: session.name,
      action: "VERIFY_CAPACITY",
      entityType: "Hospital",
      entityId: session.hospitalId,
      newValue: "confirmed current capacity",
      ipAddress: req.headers.get("x-forwarded-for") ?? "local",
    },
  });
  return NextResponse.json({ ok: true, verifiedAt: now.toISOString() });
}
