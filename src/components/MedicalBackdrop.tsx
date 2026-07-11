// Faint medical motif backdrop, a grid of medical crosses plus a heartbeat
// (ECG) line. Inherits colour from the parent via `currentColor`; set colour and
// opacity through the `className` (e.g. "text-white opacity-[0.08]").
// Pass a unique `id` when used more than once on a page (SVG pattern ids must be unique).

export function MedicalBackdrop({
  id = "med",
  className = "",
  withEcg = true,
}: {
  id?: string;
  className?: string;
  withEcg?: boolean;
}) {
  const crossId = `${id}-cross`;

  // Build a repeating heartbeat path across a 1200-wide viewBox.
  let d = "M0 60";
  for (let x = 0; x < 1200; x += 170) {
    d += ` H${x + 78} l13 -38 l13 70 l13 -56 l11 24 H${x + 170}`;
  }

  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {/* crosses (sized in screen pixels so they stay crisp) */}
      <svg className="absolute inset-0 h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={crossId} width="56" height="56" patternUnits="userSpaceOnUse">
            <path d="M28 19v18M19 28h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${crossId})`} />
      </svg>

      {/* heartbeat line through the vertical centre */}
      {withEcg && (
        <svg
          className="absolute left-0 right-0 top-1/2 h-44 w-full -translate-y-1/2"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          fill="none"
        >
          <path d={d} stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
      )}
    </div>
  );
}
