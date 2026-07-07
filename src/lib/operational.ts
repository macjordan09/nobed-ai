// Operational capacity model — the broader reality of "no bed".
//
// Feedback (David): a hospital can have physical beds and still be unable to accept
// patients — oxygen, ICU capacity, physician/nurse coverage, imaging, blood bank,
// theatre and logistics all gate admission. This models capacity as an operational
// and staffing problem, not a bed count. Self-contained demo data (no DB / schema
// change) so it always renders and never breaks the seeded portals or the mobile app.

// ── Status vocabulary ──────────────────────────────────────────────────────
export type CapacityStatus = "available" | "limited" | "full" | "conditional" | "offline";

export interface StatusMeta {
  label: string; // full label
  short: string; // compact chip label
  glyph: string; // colour-independent cue (WCAG 1.4.1)
  hex: string; // pin / chart colour
  text: string; // tailwind text colour
  bg: string; // subtle fill
  border: string;
  dot: string; // status dot fill
  solid: string; // strong fill (badges)
}

export const STATUS_META: Record<CapacityStatus, StatusMeta> = {
  available: {
    label: "Available", short: "Available", glyph: "✓", hex: "#16A34A",
    text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200",
    dot: "bg-emerald-500", solid: "bg-emerald-600",
  },
  limited: {
    label: "Limited", short: "Limited", glyph: "!", hex: "#D97706",
    text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200",
    dot: "bg-amber-500", solid: "bg-amber-600",
  },
  full: {
    label: "Full", short: "Full", glyph: "✕", hex: "#DC2626",
    text: "text-red-700", bg: "bg-red-50", border: "border-red-200",
    dot: "bg-red-500", solid: "bg-red-600",
  },
  conditional: {
    label: "Conditional", short: "Conditional", glyph: "◐", hex: "#7C3AED",
    text: "text-violet-700", bg: "bg-violet-50", border: "border-violet-200",
    dot: "bg-violet-500", solid: "bg-violet-600",
  },
  offline: {
    label: "Offline", short: "Offline", glyph: "○", hex: "#64748B",
    text: "text-slate-600", bg: "bg-slate-100", border: "border-slate-200",
    dot: "bg-slate-400", solid: "bg-slate-500",
  },
};

export const ALL_STATUSES: CapacityStatus[] = [
  "available", "conditional", "limited", "full", "offline",
];

// ── Resources ──────────────────────────────────────────────────────────────
export type ResourceTone = "good" | "warn" | "bad" | "offline" | "neutral";

export interface Resource {
  label: string;
  value: string; // display string: "8 available", "Full", "Sufficient", "Offline"
  tone: ResourceTone;
  hint?: string;
}

export const TONE_META: Record<ResourceTone, { text: string; dot: string }> = {
  good: { text: "text-emerald-700", dot: "bg-emerald-500" },
  warn: { text: "text-amber-700", dot: "bg-amber-500" },
  bad: { text: "text-red-700", dot: "bg-red-500" },
  offline: { text: "text-slate-400", dot: "bg-slate-300" },
  neutral: { text: "text-slate-700", dot: "bg-slate-400" },
};

// ── Service-specific acceptance ────────────────────────────────────────────
export type Acceptance = "yes" | "limited" | "no" | "unknown";

export interface Service {
  label: string;
  acceptance: Acceptance;
  note?: string;
}

export const ACCEPTANCE_META: Record<Acceptance, { label: string; text: string; bg: string; border: string }> = {
  yes: { label: "Accepting", text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  limited: { label: "Limited", text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
  no: { label: "Not accepting", text: "text-red-700", bg: "bg-red-50", border: "border-red-200" },
  unknown: { label: "Unconfirmed", text: "text-slate-500", bg: "bg-slate-100", border: "border-slate-200" },
};

// ── Trust & freshness ──────────────────────────────────────────────────────
export type Confidence = "High" | "Medium" | "Low";

export interface Trust {
  updatedMinutesAgo: number;
  updatedByRole: string; // "Charge Nurse", "Hospital Admin", "ED Coordinator"
  confidence: Confidence;
  source: string; // "On-ground hospital staff"
}

export const CONFIDENCE_META: Record<Confidence, { text: string; dot: string }> = {
  High: { text: "text-emerald-700", dot: "bg-emerald-500" },
  Medium: { text: "text-amber-700", dot: "bg-amber-500" },
  Low: { text: "text-red-700", dot: "bg-red-500" },
};

// ── Hospital record ────────────────────────────────────────────────────────
export interface OperationalHospital {
  id: string; // slug
  name: string;
  shortName: string;
  region: string;
  district: string;
  facilityType: string;
  photo: string;
  status: CapacityStatus; // overall operational status
  summary: string; // one-line headline
  resources: Resource[];
  services: Service[];
  constraints: string[]; // reasons for limited / restricted capacity
  referralGuidance: string;
  trust: Trust;
}

// ── Helpers ────────────────────────────────────────────────────────────────
export function formatAgo(minutes: number): string {
  if (minutes < 1) return "just now";
  if (minutes === 1) return "1 minute ago";
  if (minutes < 60) return `${minutes} minutes ago`;
  const h = Math.floor(minutes / 60);
  if (h === 1) return "1 hour ago";
  if (h < 24) return `${h} hours ago`;
  const d = Math.floor(h / 24);
  return d === 1 ? "1 day ago" : `${d} days ago`;
}

export function getHospital(id: string): OperationalHospital | undefined {
  return HOSPITALS.find((h) => h.id === id);
}

export function statusCounts(): Record<CapacityStatus, number> {
  const base: Record<CapacityStatus, number> = {
    available: 0, conditional: 0, limited: 0, full: 0, offline: 0,
  };
  for (const h of HOSPITALS) base[h.status] += 1;
  return base;
}

// ── Demo data — 6 hospitals, all five statuses represented ─────────────────
export const HOSPITALS: OperationalHospital[] = [
  {
    id: "korle-bu",
    name: "Korle Bu Teaching Hospital",
    shortName: "Korle Bu",
    region: "Greater Accra",
    district: "Ablekuma South",
    facilityType: "Teaching Hospital",
    photo: "/hospitals/photos/korle-bu.jpg",
    status: "conditional",
    summary:
      "Accepting medical and pediatric emergencies. ICU is full and CT imaging is offline — avoid trauma and ICU referrals for now.",
    resources: [
      { label: "Available beds", value: "8 available", tone: "good" },
      { label: "ICU capacity", value: "Full", tone: "bad", hint: "0 of 25 beds free" },
      { label: "Emergency physicians", value: "Available", tone: "good" },
      { label: "Nurses on duty", value: "Limited", tone: "warn", hint: "Night-shift coverage reduced" },
      { label: "Oxygen supply", value: "Sufficient", tone: "good" },
      { label: "Ventilators", value: "3 available", tone: "good" },
      { label: "Blood bank", value: "Available", tone: "good" },
      { label: "Operating theatre", value: "2 theatres open", tone: "good" },
      { label: "CT / imaging", value: "Offline", tone: "offline", hint: "Scanner down since 02:10" },
      { label: "Ambulance acceptance", value: "Selective", tone: "warn" },
    ],
    services: [
      { label: "Medical emergencies", acceptance: "yes" },
      { label: "Trauma", acceptance: "no", note: "No CT imaging; ICU full" },
      { label: "Pediatrics", acceptance: "yes" },
      { label: "Obstetrics", acceptance: "limited", note: "Uncomplicated cases only" },
      { label: "ICU cases", acceptance: "no", note: "No ICU beds free" },
    ],
    constraints: [
      "CT scanner offline",
      "ICU at full capacity",
      "Nursing coverage limited on night shift",
    ],
    referralGuidance:
      "Accepting medical emergencies and pediatric cases. Avoid trauma and ICU referrals until CT imaging is restored.",
    trust: {
      updatedMinutesAgo: 4,
      updatedByRole: "Charge Nurse",
      confidence: "High",
      source: "On-ground hospital staff",
    },
  },
  {
    id: "ridge",
    name: "Greater Accra Regional Hospital (Ridge)",
    shortName: "Greater Accra Regional",
    region: "Greater Accra",
    district: "Korle Klottey",
    facilityType: "Regional Hospital",
    photo: "/hospitals/photos/ridge.jpg",
    status: "available",
    summary:
      "Open across all major services with full staffing and supplies. Accepting trauma, medical, obstetric, pediatric and ICU referrals.",
    resources: [
      { label: "Available beds", value: "22 available", tone: "good" },
      { label: "ICU capacity", value: "3 beds free", tone: "good" },
      { label: "Emergency physicians", value: "Full team", tone: "good" },
      { label: "Nurses on duty", value: "Full coverage", tone: "good" },
      { label: "Oxygen supply", value: "Sufficient", tone: "good" },
      { label: "Ventilators", value: "5 available", tone: "good" },
      { label: "Blood bank", value: "Well stocked", tone: "good" },
      { label: "Operating theatre", value: "3 theatres open", tone: "good" },
      { label: "CT / imaging", value: "Online", tone: "good" },
      { label: "Ambulance acceptance", value: "Accepting", tone: "good" },
    ],
    services: [
      { label: "Medical emergencies", acceptance: "yes" },
      { label: "Trauma", acceptance: "yes" },
      { label: "Pediatrics", acceptance: "yes" },
      { label: "Obstetrics", acceptance: "yes" },
      { label: "ICU cases", acceptance: "yes" },
    ],
    constraints: [],
    referralGuidance:
      "Accepting all emergency categories, including trauma, obstetric, pediatric and ICU referrals.",
    trust: {
      updatedMinutesAgo: 6,
      updatedByRole: "Hospital Admin",
      confidence: "High",
      source: "On-ground hospital staff",
    },
  },
  {
    id: "komfo-anokye",
    name: "Komfo Anokye Teaching Hospital",
    shortName: "Komfo Anokye",
    region: "Ashanti",
    district: "Bantama",
    facilityType: "Teaching Hospital",
    photo: "/hospitals/photos/kath.jpg",
    status: "limited",
    summary:
      "Under pressure — oxygen supply is low and ICU is near capacity. Stabilise oxygen-dependent patients and call ahead before transfer.",
    resources: [
      { label: "Available beds", value: "5 available", tone: "warn" },
      { label: "ICU capacity", value: "1 bed", tone: "warn" },
      { label: "Emergency physicians", value: "Available", tone: "good" },
      { label: "Nurses on duty", value: "Adequate", tone: "good" },
      { label: "Oxygen supply", value: "Low", tone: "warn", hint: "~4 hours at current use" },
      { label: "Ventilators", value: "1 available", tone: "warn" },
      { label: "Blood bank", value: "Available", tone: "good" },
      { label: "Operating theatre", value: "1 theatre open", tone: "warn" },
      { label: "CT / imaging", value: "Online", tone: "good" },
      { label: "Ambulance acceptance", value: "Accepting", tone: "good" },
    ],
    services: [
      { label: "Medical emergencies", acceptance: "limited", note: "Non oxygen-dependent" },
      { label: "Trauma", acceptance: "yes" },
      { label: "Pediatrics", acceptance: "yes" },
      { label: "Obstetrics", acceptance: "yes" },
      { label: "ICU cases", acceptance: "limited", note: "1 bed, ventilator-dependent only" },
    ],
    constraints: [
      "Oxygen supply low — resupply expected in ~4 hours",
      "ICU near capacity (1 bed free)",
      "Only one operating theatre open",
    ],
    referralGuidance:
      "Trauma, obstetric and pediatric cases accepted. Call ahead for ICU and oxygen-dependent patients — supply is constrained.",
    trust: {
      updatedMinutesAgo: 11,
      updatedByRole: "ED Coordinator",
      confidence: "Medium",
      source: "On-ground hospital staff",
    },
  },
  {
    id: "ugmc",
    name: "University of Ghana Medical Centre",
    shortName: "UGMC",
    region: "Greater Accra",
    district: "Ayawaso West",
    facilityType: "Teaching Hospital",
    photo: "/hospitals/photos/ugmc.jpg",
    status: "conditional",
    summary:
      "Accepting most emergencies. No orthopedic surgeon on call until morning — divert complex fractures and orthopedic trauma.",
    resources: [
      { label: "Available beds", value: "14 available", tone: "good" },
      { label: "ICU capacity", value: "2 beds free", tone: "good" },
      { label: "Emergency physicians", value: "Available", tone: "good" },
      { label: "Nurses on duty", value: "Full coverage", tone: "good" },
      { label: "Oxygen supply", value: "Sufficient", tone: "good" },
      { label: "Ventilators", value: "4 available", tone: "good" },
      { label: "Blood bank", value: "Available", tone: "good" },
      { label: "Operating theatre", value: "General open · Ortho closed", tone: "warn" },
      { label: "CT / imaging", value: "Online", tone: "good" },
      { label: "Ambulance acceptance", value: "Accepting", tone: "good" },
    ],
    services: [
      { label: "Medical emergencies", acceptance: "yes" },
      { label: "Trauma", acceptance: "limited", note: "No ortho cover — stable / soft-tissue only" },
      { label: "Pediatrics", acceptance: "yes" },
      { label: "Obstetrics", acceptance: "yes" },
      { label: "ICU cases", acceptance: "yes" },
    ],
    constraints: [
      "No orthopedic surgeon on call until 07:00",
      "Orthopedic theatre unavailable overnight",
    ],
    referralGuidance:
      "Accepting medical, obstetric, pediatric and ICU cases. Divert orthopedic trauma and complex fractures — no ortho cover until morning.",
    trust: {
      updatedMinutesAgo: 15,
      updatedByRole: "Hospital Admin",
      confidence: "Medium",
      source: "On-ground hospital staff",
    },
  },
  {
    id: "tamale",
    name: "Tamale Teaching Hospital",
    shortName: "Tamale",
    region: "Northern",
    district: "Tamale Metropolis",
    facilityType: "Teaching Hospital",
    photo: "/hospitals/photos/tamale.jpg",
    status: "full",
    summary:
      "Emergency department saturated and blood bank depleted. Diverting non-critical referrals — confirm by phone for life-threatening cases only.",
    resources: [
      { label: "Available beds", value: "0 available", tone: "bad" },
      { label: "ICU capacity", value: "Full", tone: "bad" },
      { label: "Emergency physicians", value: "Stretched", tone: "warn" },
      { label: "Nurses on duty", value: "Limited", tone: "warn" },
      { label: "Oxygen supply", value: "Sufficient", tone: "good" },
      { label: "Ventilators", value: "0 available", tone: "bad" },
      { label: "Blood bank", value: "Depleted", tone: "bad", hint: "O-negative unavailable" },
      { label: "Operating theatre", value: "Emergency-only", tone: "warn" },
      { label: "CT / imaging", value: "Online", tone: "good" },
      { label: "Ambulance acceptance", value: "Diverting", tone: "bad" },
    ],
    services: [
      { label: "Medical emergencies", acceptance: "no" },
      { label: "Trauma", acceptance: "no", note: "Blood bank depleted" },
      { label: "Pediatrics", acceptance: "limited", note: "Life-threatening only" },
      { label: "Obstetrics", acceptance: "limited", note: "Life-threatening only" },
      { label: "ICU cases", acceptance: "no" },
    ],
    constraints: [
      "Emergency department at full capacity",
      "Blood bank depleted — O-negative unavailable",
      "No ventilators free",
    ],
    referralGuidance:
      "Diverting all non-critical referrals. Life-threatening obstetric or pediatric cases only, after phone confirmation. Redirect trauma to the nearest alternative facility.",
    trust: {
      updatedMinutesAgo: 8,
      updatedByRole: "Charge Nurse",
      confidence: "High",
      source: "On-ground hospital staff",
    },
  },
  {
    id: "cape-coast",
    name: "Cape Coast Teaching Hospital",
    shortName: "Cape Coast",
    region: "Central",
    district: "Cape Coast Metropolis",
    facilityType: "Teaching Hospital",
    photo: "/hospitals/photos/cape-coast.jpg",
    status: "offline",
    summary:
      "No live update received in over 3 hours. Status is unverified — call the facility directly before routing any referral.",
    resources: [
      { label: "Available beds", value: "No live data", tone: "offline" },
      { label: "ICU capacity", value: "No live data", tone: "offline" },
      { label: "Emergency physicians", value: "Unknown", tone: "offline" },
      { label: "Nurses on duty", value: "Unknown", tone: "offline" },
      { label: "Oxygen supply", value: "Unknown", tone: "offline" },
      { label: "Ventilators", value: "Unknown", tone: "offline" },
      { label: "Blood bank", value: "Unknown", tone: "offline" },
      { label: "Operating theatre", value: "Unknown", tone: "offline" },
      { label: "CT / imaging", value: "Unknown", tone: "offline" },
      { label: "Ambulance acceptance", value: "Unconfirmed", tone: "offline" },
    ],
    services: [
      { label: "Medical emergencies", acceptance: "unknown" },
      { label: "Trauma", acceptance: "unknown" },
      { label: "Pediatrics", acceptance: "unknown" },
      { label: "Obstetrics", acceptance: "unknown" },
      { label: "ICU cases", acceptance: "unknown" },
    ],
    constraints: [
      "No live update in over 3 hours",
      "Automated feed offline — awaiting manual confirmation",
    ],
    referralGuidance:
      "Do not rely on this status. Call Cape Coast Teaching Hospital directly to confirm capacity before referral.",
    trust: {
      updatedMinutesAgo: 193,
      updatedByRole: "System (last sync)",
      confidence: "Low",
      source: "Awaiting on-ground update",
    },
  },
];
