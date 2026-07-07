import Link from "next/link";
import type { Metadata } from "next";
import { HOSPITALS, STATUS_META, ALL_STATUSES } from "@/lib/operational";
import { CapacityDashboard } from "@/components/CapacityDashboard";

export const metadata: Metadata = {
  title: "Operational Capacity · noBed.ai",
  description:
    "Real-time hospital operational capacity across Ghana — beds, ICU, oxygen, staffing, imaging, blood bank and service-specific acceptance. Routing depends on logistics, not just beds.",
};

export default function CapacityPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Intro / positioning */}
      <div className="max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-brand-green/20 bg-green-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-green">
          <span className="live-dot text-brand-green" /> Real-time operational capacity
        </span>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-brand-ink sm:text-4xl">
          A bed is only real if the hospital can actually use it.
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-600">
          noBed.ai is a real-time hospital <strong>operational capacity</strong> platform — not a
          bed counter. A facility can have empty beds and still be unable to admit a patient
          because oxygen is low, the ICU is full, there&apos;s no surgeon on call, the CT scanner
          is down, or nursing coverage is stretched. Whether a hospital can accept a patient
          depends on <strong>logistics, staffing, supplies and service availability</strong> —
          so that&apos;s what we show.
        </p>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3">
        {ALL_STATUSES.map((s) => {
          const m = STATUS_META[s];
          return (
            <span key={s} className="inline-flex items-center gap-2 text-xs text-slate-600">
              <span className={`inline-block h-2.5 w-2.5 rounded-full ${m.dot}`} />
              <span className="font-semibold text-slate-700">{m.label}</span>
              <span className="text-slate-400">— {LEGEND[s]}</span>
            </span>
          );
        })}
      </div>

      {/* Dashboard */}
      <div className="mt-8">
        <CapacityDashboard hospitals={HOSPITALS} />
      </div>

      {/* Honest demo note */}
      <p className="mt-10 max-w-3xl text-xs leading-relaxed text-slate-400">
        Demonstration data across six real Ghanaian hospitals, updated by on-ground staff in a
        live deployment. Capacity figures here are illustrative. In a real emergency, still call{" "}
        <strong>112</strong> (National Ambulance Service).{" "}
        <Link href="/find-beds" className="text-brand-green hover:underline">
          Bed-level view →
        </Link>
      </p>
    </div>
  );
}

const LEGEND: Record<string, string> = {
  available: "open across services",
  conditional: "accepting some services, not others",
  limited: "reduced — call ahead",
  full: "saturated / diverting",
  offline: "no live update — verify by phone",
};
