import { prisma } from "./prisma";
import { colourFromBeds, overallStatus, type StatusColour } from "./status";
import { hospitalVerificationState, type VerificationState } from "./verification";
import { functionalAvailable, type EquipmentLevels } from "./functional";

export const BED_TYPES = [
  "emergency",
  "icu",
  "maternity",
  "pediatric",
  "isolation",
  "general",
] as const;
export type BedType = (typeof BED_TYPES)[number];

export interface BedSummary {
  bedType: string;
  total: number;
  occupied: number;
  available: number; // beds free (physical)
  functional: number; // beds free AND equipped/staffed to use
  equipmentBound: boolean; // true when equipment, not beds, is the bottleneck
  status: StatusColour; // reflects functional availability
}

export interface HospitalView {
  id: string;
  name: string;
  facilityType: string;
  ownershipType: string;
  region: string;
  district: string;
  address: string;
  latitude: number;
  longitude: number;
  emergencyContact: string;
  referralContact: string | null;
  ambulanceAccept: boolean;
  theatreAvailable: boolean;
  staffAvailable: boolean;
  referralNotes: string | null;
  lastUpdatedAt: string;
  verifiedAt: string | null;
  verification: VerificationState;
  status: StatusColour;
  beds: Record<string, BedSummary>;
  equipment: EquipmentLevels;
  emergencyAvailable: number; // physical beds free
  icuAvailable: number;
  emergencyFunctional: number; // beds free AND equipped (drives status)
  icuFunctional: number;
}

type HospitalWithBeds = Awaited<ReturnType<typeof fetchRaw>>[number];

function fetchRaw() {
  return prisma.hospital.findMany({
    where: { activeStatus: true },
    include: { beds: true },
    orderBy: { name: "asc" },
  });
}

export function toView(h: HospitalWithBeds): HospitalView {
  const equipment: EquipmentLevels = {
    oxygen: h.oxygenAvailable,
    ventilators: h.ventilatorsAvailable,
    incubators: h.incubatorsAvailable,
  };
  const beds: Record<string, BedSummary> = {};
  for (const b of h.beds) {
    const functional = functionalAvailable(b.bedType, b.availableBeds, equipment);
    beds[b.bedType] = {
      bedType: b.bedType,
      total: b.totalBeds,
      occupied: b.occupiedBeds,
      available: b.availableBeds,
      functional,
      equipmentBound: functional < b.availableBeds,
      // colour reflects what's actually usable (functional), not just mattresses
      status: colourFromBeds(functional, b.totalBeds),
    };
  }
  const emergency = beds.emergency ?? { available: 0, total: 0, functional: 0 };
  const icu = beds.icu ?? { available: 0, total: 0, functional: 0 };
  return {
    id: h.id,
    name: h.name,
    facilityType: h.facilityType,
    ownershipType: h.ownershipType,
    region: h.region,
    district: h.district,
    address: h.address,
    latitude: h.latitude,
    longitude: h.longitude,
    emergencyContact: h.emergencyContact,
    referralContact: h.referralContact,
    ambulanceAccept: h.ambulanceAccept,
    theatreAvailable: h.theatreAvailable,
    staffAvailable: h.staffAvailable,
    referralNotes: h.referralNotes,
    lastUpdatedAt: h.lastUpdatedAt.toISOString(),
    verifiedAt: h.verifiedAt ? h.verifiedAt.toISOString() : null,
    verification: hospitalVerificationState({
      lastUpdatedAt: h.lastUpdatedAt,
      verifiedAt: h.verifiedAt,
    }),
    // status is driven by FUNCTIONAL emergency capacity (beds + oxygen + staff)
    status: overallStatus({
      emergencyAvailable: emergency.functional,
      emergencyTotal: emergency.total,
      ambulanceAccept: h.ambulanceAccept,
    }),
    beds,
    equipment,
    emergencyAvailable: emergency.available,
    icuAvailable: icu.available,
    emergencyFunctional: emergency.functional,
    icuFunctional: icu.functional,
  };
}

export async function getHospitalViews(): Promise<HospitalView[]> {
  const rows = await fetchRaw();
  return rows.map(toView);
}

export async function getHospitalView(id: string): Promise<HospitalView | null> {
  const h = await prisma.hospital.findUnique({ where: { id }, include: { beds: true } });
  return h ? toView(h) : null;
}
