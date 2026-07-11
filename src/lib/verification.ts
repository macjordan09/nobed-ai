// Data-trust state for a hospital's reported capacity.
//
//   verified:      a verified user confirmed the CURRENT numbers, recently
//   self_reported: entered/changed but not (re)confirmed since
//   stale:         not updated within the freshness window (don't trust)

export type VerificationState = "verified" | "self_reported" | "stale";

export const STALE_MS = 2 * 60 * 60 * 1000; // 2h
export const VERIFY_TTL_MS = 12 * 60 * 60 * 1000; // a confirmation is "fresh" for 12h

export const VERIFICATION_LABELS: Record<VerificationState, string> = {
  verified: "Verified",
  self_reported: "Self-reported",
  stale: "Needs update",
};

export function hospitalVerificationState(opts: {
  lastUpdatedAt: string | Date;
  verifiedAt: string | Date | null | undefined;
}): VerificationState {
  const now = Date.now();
  const updated = new Date(opts.lastUpdatedAt).getTime();
  if (now - updated > STALE_MS) return "stale";
  if (opts.verifiedAt) {
    const v = new Date(opts.verifiedAt).getTime();
    // confirmation must cover the latest update and still be fresh
    if (v >= updated - 1000 && now - v <= VERIFY_TTL_MS) return "verified";
  }
  return "self_reported";
}

export const REPORT_TYPES: Record<string, string> = {
  ACCURATE: "Info was accurate",
  NO_BED_DESPITE_GREEN: "Turned away despite availability",
  OUTDATED: "Status looked outdated",
  OTHER: "Other",
};
