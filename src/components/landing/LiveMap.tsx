"use client";

import dynamic from "next/dynamic";
import type { OperationalHospital } from "@/lib/operational";

// Leaflet touches `window`, so the map is client-only (ssr:false), matching the
// existing HeroMap → HospitalMap pattern.
const LiveCapacityMap = dynamic(() => import("./LiveCapacityMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-slate-900 text-xs text-slate-500">
      <span className="inline-flex items-center gap-2">
        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
        Loading live map…
      </span>
    </div>
  ),
});

export function LiveMap(props: {
  hospitals?: OperationalHospital[];
  theme?: "dark" | "light";
  interactive?: boolean;
  showRoute?: boolean;
  className?: string;
}) {
  return <LiveCapacityMap {...props} />;
}
