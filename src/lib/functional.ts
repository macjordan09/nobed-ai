// Functional capacity: a bed only counts if the equipment to use it is free.
// Grounded in the Reach Alliance (2024) finding that "no bed" is frequently an
// equipment constraint (oxygen, ventilators, incubators), not a missing mattress.

export type Equipment = "oxygen" | "ventilators" | "incubators";

export interface EquipmentLevels {
  oxygen: number;
  ventilators: number;
  incubators: number;
}

// Which equipment gates each bed type (null = beds alone, no equipment dependency).
export const BED_EQUIPMENT: Record<string, Equipment | null> = {
  emergency: "oxygen",
  isolation: "oxygen",
  icu: "ventilators",
  maternity: "incubators",
  pediatric: "incubators",
  general: null,
};

export const EQUIPMENT_LABELS: Record<Equipment, string> = {
  oxygen: "Oxygen points",
  ventilators: "Ventilators",
  incubators: "Incubators",
};

/**
 * Functional availability for a bed type: min(beds free, gating equipment free).
 * Indicative per-type (equipment pools are shared), enough to surface when
 * equipment, not beds, is the real bottleneck.
 */
export function functionalAvailable(bedType: string, bedsAvailable: number, equip: EquipmentLevels): number {
  const gate = BED_EQUIPMENT[bedType];
  if (!gate) return bedsAvailable;
  return Math.min(bedsAvailable, equip[gate]);
}
