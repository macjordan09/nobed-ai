"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { HospitalView } from "@/lib/hospitals";
import { BED_TYPES } from "@/lib/hospitals";
import { colourFromBeds, STATUS_HEX } from "@/lib/status";
import { StatusBadge } from "./StatusBadge";

const TITLE = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function CapacityEditor({ hospital }: { hospital: HospitalView }) {
  const router = useRouter();
  const [rows, setRows] = useState(() =>
    BED_TYPES.map((t) => ({
      bedType: t,
      total: hospital.beds[t]?.total ?? 0,
      occupied: hospital.beds[t]?.occupied ?? 0,
    })),
  );
  const [accept, setAccept] = useState(hospital.ambulanceAccept);
  const [theatre, setTheatre] = useState(hospital.theatreAvailable);
  const [notes, setNotes] = useState(hospital.referralNotes ?? "");
  const [oxygen, setOxygen] = useState(hospital.equipment.oxygen);
  const [ventilators, setVentilators] = useState(hospital.equipment.ventilators);
  const [incubators, setIncubators] = useState(hospital.equipment.incubators);
  const [savingType, setSavingType] = useState<string | null>(null);
  const [savedFlags, setSavedFlags] = useState(false);

  function setRow(i: number, field: "total" | "occupied", value: number) {
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, [field]: value } : row)));
  }

  async function saveRow(i: number) {
    const row = rows[i];
    setSavingType(row.bedType);
    await fetch("/api/beds", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bedType: row.bedType, total: row.total, occupied: row.occupied }),
    });
    setSavingType(null);
    router.refresh();
  }

  async function saveFlags() {
    setSavedFlags(false);
    await fetch("/api/beds", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ambulanceAccept: accept, theatreAvailable: theatre, referralNotes: notes,
        oxygenAvailable: oxygen, ventilatorsAvailable: ventilators, incubatorsAvailable: incubators,
      }),
    });
    setSavedFlags(true);
    router.refresh();
    setTimeout(() => setSavedFlags(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-2">Bed type</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2">Occupied</th>
              <th className="px-4 py-2">Available</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const avail = Math.max(0, row.total - row.occupied);
              const status = colourFromBeds(avail, row.total);
              return (
                <tr key={row.bedType} className="border-t border-slate-100">
                  <td className="px-4 py-2 font-medium">{TITLE(row.bedType)}</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      min={0}
                      value={row.total}
                      onChange={(e) => setRow(i, "total", Math.max(0, +e.target.value))}
                      className="w-20 rounded border border-slate-300 px-2 py-1"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      min={0}
                      max={row.total}
                      value={row.occupied}
                      onChange={(e) => setRow(i, "occupied", Math.max(0, +e.target.value))}
                      className="w-20 rounded border border-slate-300 px-2 py-1"
                    />
                  </td>
                  <td className="px-4 py-2 font-semibold" style={{ color: STATUS_HEX[status] }}>
                    {avail}
                  </td>
                  <td className="px-4 py-2">
                    <StatusBadge status={status} showLabel={false} />
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button
                      onClick={() => saveRow(i)}
                      disabled={savingType === row.bedType}
                      className="rounded-md bg-ghana-green px-3 py-1 text-xs font-semibold text-white hover:bg-green-800 disabled:opacity-50"
                    >
                      {savingType === row.bedType ? "Saving…" : "Save"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="mb-3 text-sm font-semibold">Facility status & referral notes</h3>
        <div className="flex flex-wrap items-center gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={accept} onChange={(e) => setAccept(e.target.checked)} />
            Accepting ambulances
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={theatre} onChange={(e) => setTheatre(e.target.checked)} />
            Operating theatre available
          </label>
        </div>

        <div className="mt-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Functional equipment available
          </div>
          <p className="mt-0.5 text-xs text-slate-400">
            A bed only counts if it&apos;s equipped. These cap usable beds — ventilators for ICU,
            oxygen for emergency, incubators for maternity/paediatric.
          </p>
          <div className="mt-2 flex flex-wrap gap-4">
            {([
              ["Oxygen points", oxygen, setOxygen],
              ["Ventilators", ventilators, setVentilators],
              ["Incubators", incubators, setIncubators],
            ] as const).map(([label, val, setter]) => (
              <label key={label} className="text-sm">
                <span className="mr-2 text-slate-600">{label}</span>
                <input
                  type="number"
                  min={0}
                  value={val}
                  onChange={(e) => setter(Math.max(0, +e.target.value))}
                  className="w-20 rounded border border-slate-300 px-2 py-1"
                />
              </label>
            ))}
          </div>
        </div>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes for incoming referrals…"
          className="mt-3 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          rows={2}
        />
        <div className="mt-2 flex items-center gap-3">
          <button
            onClick={saveFlags}
            className="rounded-md bg-slate-800 px-4 py-1.5 text-sm font-semibold text-white hover:bg-slate-900"
          >
            Save facility status
          </button>
          {savedFlags && <span className="text-sm text-ghana-green">Saved ✓</span>}
        </div>
      </div>
    </div>
  );
}
