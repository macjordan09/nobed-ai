"use client";

import { useMemo, useState } from "react";
import {
  ALL_STATUSES,
  STATUS_META,
  type CapacityStatus,
  type OperationalHospital,
} from "@/lib/operational";
import { OperationalCapacityCard } from "@/components/OperationalCapacityCard";

const SERVICES = ["Trauma", "Medical emergencies", "Obstetrics", "Pediatrics", "ICU cases"];

export function CapacityDashboard({ hospitals }: { hospitals: OperationalHospital[] }) {
  const [status, setStatus] = useState<CapacityStatus | "all">("all");
  const [service, setService] = useState<string>("all");

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: hospitals.length };
    for (const s of ALL_STATUSES) c[s] = hospitals.filter((h) => h.status === s).length;
    return c;
  }, [hospitals]);

  const filtered = useMemo(() => {
    return hospitals.filter((h) => {
      if (status !== "all" && h.status !== status) return false;
      if (service !== "all") {
        const svc = h.services.find((s) => s.label === service);
        // "accepting this service" = yes or limited (not no/unknown)
        if (!svc || svc.acceptance === "no" || svc.acceptance === "unknown") return false;
      }
      return true;
    });
  }, [hospitals, status, service]);

  return (
    <div>
      {/* Summary strip: capacity at a glance */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        <button
          onClick={() => setStatus("all")}
          className={`rounded-xl border px-3 py-3 text-left transition ${
            status === "all" ? "border-brand-ink bg-slate-50 ring-1 ring-brand-ink" : "border-slate-200 bg-white hover:bg-slate-50"
          }`}
        >
          <div className="text-2xl font-black text-brand-ink">{counts.all}</div>
          <div className="text-xs font-medium text-slate-500">All facilities</div>
        </button>
        {ALL_STATUSES.map((s) => {
          const m = STATUS_META[s];
          const active = status === s;
          return (
            <button
              key={s}
              onClick={() => setStatus(active ? "all" : s)}
              className={`rounded-xl border px-3 py-3 text-left transition ${
                active ? `${m.border} ${m.bg} ring-1` : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
              style={active ? { boxShadow: `inset 0 0 0 1px ${m.hex}` } : undefined}
            >
              <div className={`flex items-center gap-1.5 text-2xl font-black ${m.text}`}>
                <span className={`inline-block h-2 w-2 rounded-full ${m.dot}`} />
                {counts[s]}
              </div>
              <div className="text-xs font-medium text-slate-500">{m.label}</div>
            </button>
          );
        })}
      </div>

      {/* Service filter */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Accepting
        </span>
        {["all", ...SERVICES].map((s) => (
          <button
            key={s}
            onClick={() => setService(s)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              service === s
                ? "border-brand-green bg-green-50 text-brand-green"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {s === "all" ? "Any service" : s}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((h) => (
          <OperationalCapacityCard key={h.id} h={h} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-10 rounded-xl border border-dashed border-slate-300 bg-slate-50 py-12 text-center text-sm text-slate-500">
          No facilities match this filter right now. Try widening it, or call the facility directly.
        </div>
      )}
    </div>
  );
}
