import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { clampBeds, colourFromBeds } from "@/lib/status";
import { getHospitalView } from "@/lib/hospitals";
import { notifyCapacityCritical } from "@/lib/push";

// Update one bed type for the signed-in user's hospital.
export async function POST(req: Request) {
  const session = getSession();
  if (!session || !can(session.role, "update_capacity") || !session.hospitalId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  // Unverified staff accounts may view but not submit capacity data.
  if (!session.isVerified) {
    return NextResponse.json(
      { error: "Account pending verification. You cannot update capacity yet." },
      { status: 403 },
    );
  }

  const body = await req.json().catch(() => ({}));
  const {
    bedType, total, occupied, ambulanceAccept, theatreAvailable, referralNotes,
    oxygenAvailable, ventilatorsAvailable, incubatorsAvailable,
  } = body;

  const num = (v: unknown) => Math.max(0, Math.floor(Number(v)));

  // Capture status before changes so we can detect a transition to "full".
  const before = await getHospitalView(session.hospitalId);

  // Hospital-level flags + equipment (functional capacity)
  if (
    ambulanceAccept !== undefined ||
    theatreAvailable !== undefined ||
    referralNotes !== undefined ||
    oxygenAvailable !== undefined ||
    ventilatorsAvailable !== undefined ||
    incubatorsAvailable !== undefined
  ) {
    await prisma.hospital.update({
      where: { id: session.hospitalId },
      data: {
        ...(ambulanceAccept !== undefined ? { ambulanceAccept: !!ambulanceAccept } : {}),
        ...(theatreAvailable !== undefined ? { theatreAvailable: !!theatreAvailable } : {}),
        ...(referralNotes !== undefined ? { referralNotes: String(referralNotes) } : {}),
        ...(oxygenAvailable !== undefined ? { oxygenAvailable: num(oxygenAvailable) } : {}),
        ...(ventilatorsAvailable !== undefined ? { ventilatorsAvailable: num(ventilatorsAvailable) } : {}),
        ...(incubatorsAvailable !== undefined ? { incubatorsAvailable: num(incubatorsAvailable) } : {}),
        lastUpdatedAt: new Date(),
      },
    });
  }

  if (bedType) {
    const existing = await prisma.bedCapacity.findUnique({
      where: { hospitalId_bedType: { hospitalId: session.hospitalId, bedType: String(bedType) } },
    });
    if (!existing) {
      return NextResponse.json({ error: "Unknown bed type" }, { status: 400 });
    }
    const t = total !== undefined ? Number(total) : existing.totalBeds;
    const o = occupied !== undefined ? Number(occupied) : existing.occupiedBeds;
    const { total: tt, occupied: oo, available } = clampBeds(t, o);

    await prisma.bedCapacity.update({
      where: { id: existing.id },
      data: {
        totalBeds: tt,
        occupiedBeds: oo,
        availableBeds: available,
        statusColour: colourFromBeds(available, tt),
        lastUpdatedBy: session.userId,
        lastUpdatedAt: new Date(),
      },
    });
    await prisma.hospital.update({
      where: { id: session.hospitalId },
      data: { lastUpdatedAt: new Date() },
    });
    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        actorLabel: session.name,
        action: "UPDATE_CAPACITY",
        entityType: "BedCapacity",
        entityId: session.hospitalId,
        oldValue: `${bedType}: ${existing.availableBeds} free`,
        newValue: `${bedType}: ${available} free`,
        ipAddress: req.headers.get("x-forwarded-for") ?? "local",
      },
    });
  }

  // Capacity-red alert: notify when a hospital newly becomes "full".
  const after = await getHospitalView(session.hospitalId);
  if (before && after && before.status !== "full" && after.status === "full") {
    await notifyCapacityCritical(after.name, after.id);
  }

  return NextResponse.json({ ok: true });
}
