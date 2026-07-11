"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { HospitalView } from "@/lib/hospitals";

const HospitalMap = dynamic(() => import("./HospitalMap"), {
  ssr: false,
  loading: () => <div className="flex h-[460px] items-center justify-center bg-slate-100 text-slate-400">Loading live map…</div>,
});

const TABS = [
  { key: "dashboard", label: "Capacity dashboard", img: "/showcase/dashboard.png", blurb: "Hospitals update beds in seconds. Status colour is calculated automatically and signed off as verified." },
  { key: "map", label: "Live map", img: "", blurb: "One national map. Available, limited, full, and grey for unverified. Filter by region, bed type and ICU." },
  { key: "sms", label: "SMS access", img: "/showcase/sms.png", blurb: "No smartphone, no data? Text BED ACCRA and get the nearest facilities with free beds." },
  { key: "referral", label: "Referral tracking", img: "/showcase/referral.png", blurb: "Ambulance teams refer to a hospital that can receive the patient, tracked end to end." },
] as const;

export function ProductShowcase({ hospitals }: { hospitals: HospitalView[] }) {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("dashboard");
  const active = TABS.find((t) => t.key === tab)!;

  return (
    <div>
      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
              tab === t.key
                ? "bg-brand-green text-white shadow"
                : "border border-slate-200 bg-white text-slate-600 hover:border-brand-green hover:text-brand-green"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mx-auto max-w-5xl">
        <p className="mb-4 text-center text-lg text-slate-600">{active.blurb}</p>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/40">
          {tab === "map" ? (
            <HospitalMap hospitals={hospitals} height="460px" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={active.img} alt={active.label} className="w-full" />
          )}
        </div>
      </div>
    </div>
  );
}
