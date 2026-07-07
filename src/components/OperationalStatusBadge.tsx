import { STATUS_META, type CapacityStatus } from "@/lib/operational";

/**
 * Operational capacity status pill — colour + glyph + label (never colour alone).
 * Used on cards, the dashboard and the hospital detail view.
 */
export function OperationalStatusBadge({
  status,
  size = "md",
}: {
  status: CapacityStatus;
  size?: "sm" | "md" | "lg";
}) {
  const m = STATUS_META[status];
  const pad =
    size === "lg" ? "px-3.5 py-1.5 text-sm" : size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-xs";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold ${m.bg} ${m.text} ${m.border} ${pad}`}
    >
      <span className={`inline-block h-1.5 w-1.5 rounded-full ${m.dot}`} aria-hidden />
      {m.label}
    </span>
  );
}
