import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { notifyNewReferral } from "@/lib/push";

export async function GET() {
  const referrals = await prisma.referral.findMany({
    include: {
      referringFacility: { select: { name: true } },
      destinationFacility: { select: { name: true } },
      events: { orderBy: { createdAt: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ count: referrals.length, referrals });
}

function makeCode() {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `REF-${new Date().getFullYear()}-${n}`;
}

export async function POST(req: Request) {
  const session = getSession();
  if (!session || !can(session.role, "create_referral")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const b = await req.json().catch(() => ({}));

  if (!b.emergencyType || !b.requiredBedType || !b.destinationFacilityId) {
    return NextResponse.json(
      { error: "emergencyType, requiredBedType and destinationFacilityId are required" },
      { status: 400 },
    );
  }

  const referral = await prisma.referral.create({
    data: {
      referralCode: makeCode(),
      // anonymized reference only, never identifiable patient data
      patientReference: `ANON-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
      patientAgeRange: b.patientAgeRange ?? "Unknown",
      patientGender: b.patientGender ?? "Unknown",
      emergencyType: String(b.emergencyType),
      urgencyLevel: b.urgencyLevel ?? "Urgent",
      requiredBedType: String(b.requiredBedType),
      currentLocation: b.currentLocation ?? null,
      referringFacilityId: session.hospitalId ?? b.referringFacilityId ?? null,
      destinationFacilityId: String(b.destinationFacilityId),
      ambulanceStatus: b.ambulanceStatus ?? "None",
      eta: b.eta ?? null,
      currentStatus: "Submitted",
      notes: b.notes ?? null,
      createdBy: session.userId,
      events: {
        create: [{ eventType: "Submitted", message: `Referral submitted by ${session.name}.`, createdBy: session.userId }],
      },
    },
    include: { events: true },
  });

  await prisma.auditLog.create({
    data: {
      userId: session.userId,
      actorLabel: session.name,
      action: "CREATE_REFERRAL",
      entityType: "Referral",
      entityId: referral.id,
      newValue: referral.referralCode,
    },
  });

  // Referral alert to registered devices.
  const dest = await prisma.hospital.findUnique({
    where: { id: String(b.destinationFacilityId) },
    select: { name: true },
  });
  await notifyNewReferral({
    referralCode: referral.referralCode,
    destinationName: dest?.name ?? "a hospital",
    urgency: referral.urgencyLevel,
    referralId: referral.id,
  });

  return NextResponse.json({ ok: true, referral });
}
