import { prisma } from "./prisma";
import type { ReferralDTO } from "@/components/ReferralList";

const include = {
  referringFacility: { select: { name: true } },
  destinationFacility: { select: { name: true } },
  events: { orderBy: { createdAt: "asc" as const } },
};

type Row = Awaited<ReturnType<typeof prisma.referral.findMany<{ include: typeof include }>>>[number];

function toDTO(r: Row): ReferralDTO {
  return {
    id: r.id,
    referralCode: r.referralCode,
    patientReference: r.patientReference,
    patientAgeRange: r.patientAgeRange,
    patientGender: r.patientGender,
    emergencyType: r.emergencyType,
    urgencyLevel: r.urgencyLevel,
    requiredBedType: r.requiredBedType,
    currentLocation: r.currentLocation,
    ambulanceStatus: r.ambulanceStatus,
    eta: r.eta,
    currentStatus: r.currentStatus,
    notes: r.notes,
    bedReserved: r.bedReserved,
    createdAt: r.createdAt.toISOString(),
    referringFacility: r.referringFacility,
    destinationFacility: r.destinationFacility,
    events: r.events.map((e) => ({
      id: e.id,
      eventType: e.eventType,
      message: e.message,
      createdAt: e.createdAt.toISOString(),
    })),
  };
}

export async function getAllReferrals(): Promise<ReferralDTO[]> {
  const rows = await prisma.referral.findMany({ include, orderBy: { createdAt: "desc" } });
  return rows.map(toDTO);
}

export async function getReferralsForHospital(hospitalId: string) {
  const rows = await prisma.referral.findMany({
    where: { OR: [{ destinationFacilityId: hospitalId }, { referringFacilityId: hospitalId }] },
    include,
    orderBy: { createdAt: "desc" },
  });
  const all = rows.map(toDTO);
  return {
    incoming: rows.filter((r) => r.destinationFacilityId === hospitalId).map(toDTO),
    outgoing: rows.filter((r) => r.referringFacilityId === hospitalId).map(toDTO),
    all,
  };
}
