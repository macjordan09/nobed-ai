import { prisma } from "./prisma";
import { getHospitalViews } from "./hospitals";
import type { StatusColour } from "./status";

export interface RegionStat {
  region: string;
  hospitals: number;
  emergencyFree: number;
  icuFree: number;
  available: number;
  limited: number;
  full: number;
  pressure: number; // 0-100, higher = worse
}

export async function getAnalytics() {
  const hospitals = await getHospitalViews();
  const now = Date.now();

  // National status distribution
  const statusDist: Record<StatusColour, number> = { available: 0, limited: 0, full: 0 };
  let emergencyFree = 0;
  let icuFree = 0;
  let maternityFree = 0;
  const bedTotals: Record<string, { available: number; total: number }> = {};

  for (const h of hospitals) {
    statusDist[h.status]++;
    emergencyFree += h.emergencyAvailable;
    icuFree += h.icuAvailable;
    maternityFree += h.beds.maternity?.available ?? 0;
    for (const [type, b] of Object.entries(h.beds)) {
      bedTotals[type] ??= { available: 0, total: 0 };
      bedTotals[type].available += b.available;
      bedTotals[type].total += b.total;
    }
  }

  // Regional pressure
  const regionMap = new Map<string, RegionStat>();
  for (const h of hospitals) {
    const r =
      regionMap.get(h.region) ??
      { region: h.region, hospitals: 0, emergencyFree: 0, icuFree: 0, available: 0, limited: 0, full: 0, pressure: 0 };
    r.hospitals++;
    r.emergencyFree += h.emergencyAvailable;
    r.icuFree += h.icuAvailable;
    r[h.status]++;
    regionMap.set(h.region, r);
  }
  const regions = Array.from(regionMap.values()).map((r) => {
    // pressure weights critical facilities heavily
    r.pressure = Math.round(((r.full * 100 + r.limited * 50) / (r.hospitals * 100)) * 100);
    return r;
  });
  regions.sort((a, b) => b.pressure - a.pressure);

  // Stale updates (not updated in 2h): update compliance
  const STALE_MS = 2 * 60 * 60 * 1000;
  const stale = hospitals.filter((h) => now - new Date(h.lastUpdatedAt).getTime() > STALE_MS);
  const compliance = Math.round(((hospitals.length - stale.length) / Math.max(1, hospitals.length)) * 100);

  // Referral funnel + emergency categories + response
  const referrals = await prisma.referral.findMany();
  const funnel: Record<string, number> = {};
  const emergencyCategories: Record<string, number> = {};
  for (const r of referrals) {
    funnel[r.currentStatus] = (funnel[r.currentStatus] ?? 0) + 1;
    emergencyCategories[r.emergencyType] = (emergencyCategories[r.emergencyType] ?? 0) + 1;
  }
  const accepted = (funnel.Accepted ?? 0) + (funnel.Arrived ?? 0) + (funnel.InTransit ?? 0) + (funnel.Closed ?? 0);
  const acceptanceRate = referrals.length ? Math.round((accepted / referrals.length) * 100) : 0;

  // SMS volume
  const smsTotal = await prisma.smsLog.count();
  const smsUnauthorized = await prisma.smsLog.count({ where: { status: "UNAUTHORIZED" } });

  return {
    totals: {
      hospitals: hospitals.length,
      regions: regions.length,
      emergencyFree,
      icuFree,
      maternityFree,
      referrals: referrals.length,
      smsQueries: smsTotal,
    },
    statusDist,
    bedTotals,
    regions,
    stale: stale.map((h) => ({ id: h.id, name: h.name, region: h.region, lastUpdatedAt: h.lastUpdatedAt })),
    compliance,
    funnel,
    emergencyCategories,
    acceptanceRate,
    smsUnauthorized,
  };
}
