import { VERIFICATION_LABELS, type VerificationState } from "@/lib/verification";

// Verification state uses icon + text + colour (never colour alone) so it stays
// readable for colour-blind users — important on an emergency platform.
const STYLE: Record<VerificationState, { cls: string; glyph: string }> = {
  verified: { cls: "bg-green-100 text-green-800", glyph: "✓" },
  self_reported: { cls: "bg-slate-100 text-slate-600", glyph: "•" },
  stale: { cls: "bg-amber-100 text-amber-800", glyph: "!" },
};

export function VerificationBadge({
  state,
  label,
}: {
  state: VerificationState;
  label?: string;
}) {
  const s = STYLE[state];
  return (
    <span className={`pill ${s.cls}`} title="Data-trust status">
      <span aria-hidden className="font-bold">{s.glyph}</span>
      {label ?? VERIFICATION_LABELS[state]}
    </span>
  );
}
