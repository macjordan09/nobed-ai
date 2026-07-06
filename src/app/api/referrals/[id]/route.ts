import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { colourFromBeds } from "@/lib/status";

const VALID = [
  "Draft", "Submitted", "Accepted", "Declined", "Redirected",
  "InTransit", "Arrived", "Closed", "Escalated",
];

// Hold one bed at a hospital (occupied +1). Returns false if none free.
async function reserveBed(hospitalId: string, bedType: string): Promise<boolean> {
  const bed = await prisma.bedCapacity.findUnique({
    where: { hospitalId_bedType: { hospitalId, bedType } },
  });
  if (!bed || bed.availableBeds <= 0) return false;
  const occupied = Math.min(bed.occupiedBeds + 1, bed.totalBeds);
  const available = bed.totalBeds - occupied;
  await prisma.bedCapacity.update({
    where: { id: bed.id },
    data: { occupiedBeds: occupied, availableBeds: available, statusColour: colourFromBeds(available, bed.totalBeds), lastUpdatedAt: new Date() },
  });
  await prisma.hospital.update({ where: { id: hospitalId }, data: { lastUpdatedAt: new Date() } });
  return true;
}

// Release a previously held bed (occupied -1).
async function releaseBed(hospitalId: string, bedType: string): Promise<void> {
  const bed = await prisma.bedCapacity.findUnique({
    where: { hospitalId_bedType: { hospitalId, bedType } },
  });
  if (!bed) return;
  const occupied = Math.max(0, bed.occupiedBeds - 1);
  const available = bed.totalBeds - occupied;
  await prisma.bedCapacity.update({
    where: { id: bed.id },
    data: { occupiedBeds: occupied, availableBeds: available, statusColour: colourFromBeds(available, bed.totalBeds), lastUpdatedAt: new Date() },
  });
  await prisma.hospital.update({ where: { id: hospitalId }, data: { lastUpdatedAt: new Date() } });
}

// Update referral status (accept / decline / redirect / progress) + log event.
// Accepting HOLDS a bed at the destination; declining/redirecting RELEASES it.
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = getSession();
  if (!session || (!can(session.role, "accept_referral") && !can(session.role, "create_referral"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { status, message } = await req.json().catch(() => ({}));
  if (!status || !VALID.includes(status)) {
    return NextResponse.json({ error: `status must be one of ${VALID.join(", ")}` }, { status: 400 });
  }

  const referral = await prisma.referral.findUnique({ where: { id: params.id } });
  if (!referral) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // --- bed reservation side-effects ---
  let bedReserved = referral.bedReserved;
  let reservedBedType = referral.reservedBedType;
  let resNote = "";
  const dest = referral.destinationFacilityId;

  if (status === "Accepted" && !referral.bedReserved && dest) {
    const ok = await reserveBed(dest, referral.requiredBedType);
    if (ok) {
      bedReserved = true;
      reservedBedType = referral.requiredBedType;
      resNote = ` A ${referral.requiredBedType} bed has been held for this patient.`;
    } else {
      resNote = ` Accepted — but no free ${referral.requiredBedType} bed to hold; destination is creating space.`;
    }
  } else if ((status === "Declined" || status === "Redirected") && referral.bedReserved && referral.reservedBedType && dest) {
    await releaseBed(dest, referral.reservedBedType);
    bedReserved = false;
    resNote = ` The held ${referral.reservedBedType} bed has been released.`;
  }

  const updated = await prisma.referral.update({
    where: { id: params.id },
    data: {
      currentStatus: status,
      bedReserved,
      reservedBedType,
      events: {
        create: {
          eventType: status,
          message: (message || `Status changed to ${status} by ${session.name}.`) + resNote,
          createdBy: session.userId,
        },
      },
    },
    include: { events: { orderBy: { createdAt: "asc" } } },
  });

  await prisma.auditLog.create({
    data: {
      userId: session.userId,
      actorLabel: session.name,
      action: "UPDATE_REFERRAL",
      entityType: "Referral",
      entityId: referral.id,
      oldValue: referral.currentStatus,
      newValue: status + (resNote ? ` ·${resNote}` : ""),
    },
  });

  return NextResponse.json({ ok: true, referral: updated });
}
