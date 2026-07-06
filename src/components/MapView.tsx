"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { HospitalView } from "@/lib/hospitals";
import { STATUS_HEX, STATUS_WORD, STATUS_RANK, ALL_TIERS, type StatusColour } from "@/lib/status";
import { StatusDot } from "./StatusBadge";
import { VerificationBadge } from "./VerificationBadge";
import { ReportButton } from "./ReportButton";

const HospitalMap = dynamic(() => import("./HospitalMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[70vh] items-center justify-center rounded-xl bg-slate-100 text-slate-400">
      Loading map…
    </div>
  ),
});

const uniq = (xs: string[]) => Array.from(new Set(xs)).sort();

export function MapView({ hospitals }: { hospitals: HospitalView[] }) {
  const [q, setQ] = useState("");
  const [region, setRegion] = useState("");
  const [facility, setFacility] = useState("");
  const [ownership, setOwnership] = useState("");
  const [needEmergency, setNeedEmergency] = useState(false);
  const [needIcu, setNeedIcu] = useState(false);
  const [needMaternity, setNeedMaternity] = useState(false);
  const [acceptingOnly, setAcceptingOnly] = useState(false);

  const regions = useMemo(() => uniq(hospitals.map((h) => h.region)), [hospitals]);
  const facilities = useMemo(() => uniq(hospitals.map((h) => h.facilityType)), [hospitals]);
  const ownerships = useMemo(() => uniq(hospitals.map((h) => h.ownershipType)), [hospitals]);

  const filtered = useMemo(() => {
    return hospitals
      .filter((h) => (q ? h.name.toLowerCase().includes(q.toLowerCase()) : true))
      .filter((h) => (region ? h.region === region : true))
      .filter((h) => (facility ? h.facilityType === facility : true))
      .filter((h) => (ownership ? h.ownershipType === ownership : true))
      .filter((h) => (needEmergency ? h.emergencyAvailable > 0 : true))
      .filter((h) => (needIcu ? h.icuAvailable > 0 : true))
      .filter((h) => (needMaternity ? (h.beds.maternity?.available ?? 0) > 0 : true))
      .filter((h) => (acceptingOnly ? h.ambulanceAccept : true));
  }, [hospitals, q, region, facility, ownership, needEmergency, needIcu, needMaternity, acceptingOnly]);

  const counts = useMemo(() => {
    const c: Record<StatusColour, number> = { available: 0, limited: 0, full: 0 };
    for (const h of filtered) c[h.status]++;
    return c;
  }, [filtered]);

  const sorted = useMemo(
    () => [...filtered].sort((a, b) => STATUS_RANK[a.status] - STATUS_RANK[b.status]),
    [filtered],
  );

  const sel =
    "rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm focus:border-ghana-green focus:outline-none";

  return (
    <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
      {/* Filters + list */}
      <aside className="space-y-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="mb-3 text-sm font-semibold">Filters</h3>
          <div className="space-y-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search hospital…"
              className={`${sel} w-full`}
            />
            <select value={region} onChange={(e) => setRegion(e.target.value)} className={`${sel} w-full`}>
              <option value="">All regions</option>
              {regions.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
            <select value={facility} onChange={(e) => setFacility(e.target.value)} className={`${sel} w-full`}>
              <option value="">All facility types</option>
              {facilities.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
            <select value={ownership} onChange={(e) => setOwnership(e.target.value)} className={`${sel} w-full`}>
              <option value="">Public / Private / Mission</option>
              {ownerships.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={needEmergency} onChange={(e) => setNeedEmergency(e.target.checked)} />
              Emergency beds available
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={needIcu} onChange={(e) => setNeedIcu(e.target.checked)} />
              ICU beds available
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={needMaternity} onChange={(e) => setNeedMaternity(e.target.checked)} />
              Maternity beds available
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={acceptingOnly} onChange={(e) => setAcceptingOnly(e.target.checked)} />
              Accepting ambulances
            </label>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm">
          <div className="mb-2 font-semibold">
            {filtered.length} facilit{filtered.length === 1 ? "y" : "ies"}
          </div>
          <div className="grid grid-cols-3 gap-1 text-xs">
            {ALL_TIERS.map((s) => (
              <div key={s} className="flex items-center gap-1.5">
                <StatusDot status={s} /> {STATUS_WORD[s]} ({counts[s]})
              </div>
            ))}
          </div>
        </div>

        <div className="max-h-[40vh] space-y-2 overflow-auto pr-1">
          {sorted.map((h) => (
            <div key={h.id} className="rounded-lg border border-slate-200 bg-white p-3 text-sm">
              <div className="flex items-start justify-between gap-2">
                <span className="font-medium leading-tight">{h.name}</span>
                <span
                  className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: STATUS_HEX[h.status] }}
                />
              </div>
              <div className="mt-1 text-xs text-slate-500">
                Emergency {h.emergencyAvailable} · ICU {h.icuAvailable} · {h.district}
              </div>
              <div className="mt-2 flex items-center justify-between gap-2">
                <VerificationBadge state={h.verification} />
                <ReportButton hospitalId={h.id} hospitalName={h.name} />
              </div>
            </div>
          ))}
        </div>
      </aside>

      <div>
        <HospitalMap hospitals={filtered} />
      </div>
    </div>
  );
}
