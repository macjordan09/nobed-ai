import { STATUS_GLYPH, STATUS_HEX, STATUS_LABELS, STATUS_WORD, type StatusColour } from "@/lib/status";

const BG: Record<StatusColour, string> = {
  available: "bg-green-100 text-green-800",
  limited: "bg-amber-100 text-amber-800",
  full: "bg-red-100 text-red-800",
};

export function StatusDot({ status, size = 10 }: { status: StatusColour; size?: number }) {
  return (
    <span
      className="inline-block rounded-full"
      style={{ width: size, height: size, backgroundColor: STATUS_HEX[status] }}
    />
  );
}

export function StatusBadge({
  status,
  showLabel = true,
}: {
  status: StatusColour;
  showLabel?: boolean;
}) {
  return (
    <span className={`pill ${BG[status]}`}>
      <span aria-hidden className="font-bold">{STATUS_GLYPH[status]}</span>
      {showLabel ? STATUS_LABELS[status] : STATUS_WORD[status]}
    </span>
  );
}
