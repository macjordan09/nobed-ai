// Colour-coded capacity logic — shared by API, seed and dashboards.
//
// Three tiers (down from four) for clarity + accessibility: yellow and amber were
// too close to distinguish on a small pin or for colour-blind users. Status is
// always paired with a glyph/label so it never relies on colour alone (WCAG 1.4.1).

export type StatusColour = "available" | "limited" | "full";

export const STATUS_LABELS: Record<StatusColour, string> = {
  available: "Beds available",
  limited: "Limited capacity",
  full: "Full / critical",
};

// Short word for SMS and compact UI.
export const STATUS_WORD: Record<StatusColour, string> = {
  available: "Available",
  limited: "Limited",
  full: "Full",
};

export const STATUS_HEX: Record<StatusColour, string> = {
  available: "#16A34A", // green
  limited: "#D97706", // amber-600 — distinct hue + darker for AA contrast
  full: "#DC2626", // red
};

// Redundant, colour-independent cue (shown inside pins / badges).
export const STATUS_GLYPH: Record<StatusColour, string> = {
  available: "✓",
  limited: "!",
  full: "✕",
};

// Rank for sorting / "worst status wins" rollups (higher = more critical).
export const STATUS_RANK: Record<StatusColour, number> = {
  available: 0,
  limited: 1,
  full: 2,
};

/**
 * Capacity tier from available bed count:
 *   Full:      0 beds available
 *   Limited:   1–5 beds available, or >= 70% occupancy
 *   Available: more than 5 beds and < 70% occupancy
 */
export function colourFromBeds(available: number, total: number): StatusColour {
  const occupancy = total > 0 ? (total - available) / total : 1;
  if (available <= 0) return "full";
  if (available <= 5 || occupancy >= 0.7) return "limited";
  return "available";
}

/**
 * Overall hospital tier is driven by EMERGENCY bed availability, with a hard
 * override to "full" when the facility is not accepting ambulances.
 */
export function overallStatus(opts: {
  emergencyAvailable: number;
  emergencyTotal: number;
  ambulanceAccept: boolean;
}): StatusColour {
  if (!opts.ambulanceAccept) return "full";
  return colourFromBeds(opts.emergencyAvailable, opts.emergencyTotal);
}

export function clampBeds(total: number, occupied: number) {
  const t = Math.max(0, Math.floor(total));
  const o = Math.min(Math.max(0, Math.floor(occupied)), t);
  return { total: t, occupied: o, available: t - o };
}

export const ALL_TIERS: StatusColour[] = ["available", "limited", "full"];
