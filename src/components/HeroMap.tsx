"use client";

import dynamic from "next/dynamic";
import type { HospitalView } from "@/lib/hospitals";

const HospitalMap = dynamic(() => import("./HospitalMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-slate-100 text-sm text-slate-400">
      Loading live map…
    </div>
  ),
});

export function HeroMap({ hospitals, height = "100%" }: { hospitals: HospitalView[]; height?: string }) {
  return <HospitalMap hospitals={hospitals} height={height} />;
}
