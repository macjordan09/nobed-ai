import { HOSPITALS, STATUS_META } from "@/lib/operational";

// Stylised "command-centre" Ghana map. Pins are projected from real lat/lng so
// their relative positions are geographically honest (not decorative). Pure SVG,
// no map tiles, light, offline, and consistent with the demo's zero-cost rule.

const BOUNDS = { lngMin: -3.28, lngMax: 1.22, latMin: 4.55, latMax: 11.22 };
const VB = { w: 320, h: 440, pad: 18 };

function project(lng: number, lat: number) {
  const x = ((lng - BOUNDS.lngMin) / (BOUNDS.lngMax - BOUNDS.lngMin)) * (VB.w - 2 * VB.pad) + VB.pad;
  const y = ((BOUNDS.latMax - lat) / (BOUNDS.latMax - BOUNDS.latMin)) * (VB.h - 2 * VB.pad) + VB.pad;
  return { x, y };
}

// Coarse Ghana boundary (lng, lat), clockwise from the north-west.
const OUTLINE: [number, number][] = [
  [-2.83, 11.0], [-1.6, 11.0], [-0.63, 10.9], [0.02, 11.0], [0.4, 11.1],
  [0.5, 10.4], [0.36, 9.5], [0.58, 8.5], [0.2, 7.4], [0.52, 6.6], [1.19, 6.1],
  [0.55, 5.75], [-0.02, 5.55], [-0.95, 5.05], [-1.55, 5.02], [-2.1, 4.78],
  [-2.75, 4.95], [-3.11, 5.12], [-2.6, 6.6], [-2.94, 7.6], [-2.7, 8.5], [-2.83, 9.6],
];
const OUTLINE_D =
  OUTLINE.map(([lng, lat], i) => {
    const { x, y } = project(lng, lat);
    return `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ") + " Z";

// Tiny pixel nudges so the Accra cluster reads as distinct pins.
const NUDGE: Record<string, [number, number]> = {
  "korle-bu": [-7, 5],
  ridge: [8, -1],
  ugmc: [4, -13],
};

export function MapPreview({
  variant = "mini",
  className = "",
}: {
  variant?: "hero" | "mini";
  className?: string;
}) {
  const hero = variant === "hero";
  // Incident + route to nearest available ICU (Ridge), shown on the hero only.
  const incident = project(-0.45, 5.55);
  const ridge = HOSPITALS.find((h) => h.id === "ridge")!;
  const dest = (() => {
    const { x, y } = project(ridge.lng, ridge.lat);
    const [nx, ny] = NUDGE["ridge"] ?? [0, 0];
    return { x: x + nx, y: y + ny };
  })();

  return (
    <svg
      viewBox={`0 0 ${VB.w} ${VB.h}`}
      className={className}
      role="img"
      aria-label="Map of Ghana showing hospital operational capacity by colour"
    >
      <defs>
        <linearGradient id="mp-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0b1220" />
          <stop offset="1" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="mp-land" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#13233b" />
          <stop offset="1" stopColor="#0e1a2c" />
        </linearGradient>
        <pattern id="mp-grid" width="26" height="26" patternUnits="userSpaceOnUse">
          <path d="M26 0H0V26" fill="none" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1" />
        </pattern>
      </defs>

      <rect x="0" y="0" width={VB.w} height={VB.h} rx="16" fill="url(#mp-bg)" />
      <rect x="0" y="0" width={VB.w} height={VB.h} rx="16" fill="url(#mp-grid)" />

      {/* Ghana landmass */}
      <path d={OUTLINE_D} fill="url(#mp-land)" stroke="#2dd4bf" strokeOpacity="0.35" strokeWidth="1.5" />
      {/* subtle national accent, a thin gold coastline, not touristy */}
      <path d={OUTLINE_D} fill="none" stroke="#FCD116" strokeOpacity="0.14" strokeWidth="3" />

      {/* Route to nearest available ICU (hero only) */}
      {hero && (
        <g>
          <line
            x1={incident.x} y1={incident.y} x2={dest.x} y2={dest.y}
            stroke="#22d3ee" strokeWidth="2" strokeDasharray="5 4" strokeOpacity="0.9"
          />
          <circle cx={incident.x} cy={incident.y} r="4" fill="#f8fafc" />
          <circle cx={incident.x} cy={incident.y} r="8" fill="none" stroke="#22d3ee" strokeOpacity="0.5" />
        </g>
      )}

      {/* Hospital pins */}
      {HOSPITALS.map((h) => {
        const { x, y } = project(h.lng, h.lat);
        const [nx, ny] = NUDGE[h.id] ?? [0, 0];
        const cx = x + nx;
        const cy = y + ny;
        const hex = STATUS_META[h.status].hex;
        const isAvail = h.status === "available";
        return (
          <g key={h.id}>
            {isAvail && hero && (
              <circle cx={cx} cy={cy} r="10" fill={hex} opacity="0.22">
                <animate attributeName="r" values="6;13;6" dur="2.4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.35;0;0.35" dur="2.4s" repeatCount="indefinite" />
              </circle>
            )}
            <circle cx={cx} cy={cy} r={hero ? 5.5 : 4} fill={hex} stroke="#0b1220" strokeWidth="1.5" />
            <circle cx={cx} cy={cy} r={hero ? 5.5 : 4} fill="none" stroke="#ffffff" strokeOpacity="0.6" strokeWidth="1" />
          </g>
        );
      })}
    </svg>
  );
}
