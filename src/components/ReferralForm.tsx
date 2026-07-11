"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { HospitalView } from "@/lib/hospitals";

const BED_TYPES = ["emergency", "icu", "maternity", "pediatric", "isolation", "general"];
const AGE_RANGES = ["0-5", "6-12", "13-17", "18-24", "25-34", "35-49", "50-64", "65+"];

export function ReferralForm({ hospitals }: { hospitals: HospitalView[] }) {
  const router = useRouter();
  const [form, setForm] = useState({
    emergencyType: "",
    urgencyLevel: "Critical",
    requiredBedType: "emergency",
    patientAgeRange: "25-34",
    patientGender: "Female",
    currentLocation: "",
    destinationFacilityId: "",
    eta: "",
    ambulanceStatus: "Dispatched",
    notes: "",
  });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  // Suggest facilities that can take the required bed type, best status first.
  const suggestions = [...hospitals]
    .filter((h) => (h.beds[form.requiredBedType]?.available ?? 0) > 0)
    .sort((a, b) => (b.beds[form.requiredBedType]?.available ?? 0) - (a.beds[form.requiredBedType]?.available ?? 0))
    .slice(0, 3);

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    const res = await fetch("/api/referrals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setMsg(data.error || "Failed to create referral");
      return;
    }
    setMsg(`Referral ${data.referral.referralCode} submitted.`);
    setForm((f) => ({ ...f, emergencyType: "", currentLocation: "", notes: "" }));
    router.refresh();
  }

  const field = "w-full rounded-md border border-slate-300 px-3 py-2 text-sm";

  return (
    <form onSubmit={submit} className="space-y-3 rounded-xl border border-slate-200 bg-white p-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label>Emergency type</Label>
          <input
            required
            value={form.emergencyType}
            onChange={(e) => set("emergencyType", e.target.value)}
            placeholder="e.g. Road traffic accident"
            className={field}
          />
        </div>
        <div>
          <Label>Clinical urgency</Label>
          <select value={form.urgencyLevel} onChange={(e) => set("urgencyLevel", e.target.value)} className={field}>
            <option>Critical</option>
            <option>Urgent</option>
            <option>Stable</option>
          </select>
        </div>
        <div>
          <Label>Required bed type</Label>
          <select value={form.requiredBedType} onChange={(e) => set("requiredBedType", e.target.value)} className={field}>
            {BED_TYPES.map((b) => (
              <option key={b} value={b}>
                {b[0].toUpperCase() + b.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>Current location</Label>
          <input
            value={form.currentLocation}
            onChange={(e) => set("currentLocation", e.target.value)}
            placeholder="e.g. Kasoa, Central Region"
            className={field}
          />
        </div>
        <div>
          <Label>Patient age range</Label>
          <select value={form.patientAgeRange} onChange={(e) => set("patientAgeRange", e.target.value)} className={field}>
            {AGE_RANGES.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
        </div>
        <div>
          <Label>Gender</Label>
          <select value={form.patientGender} onChange={(e) => set("patientGender", e.target.value)} className={field}>
            <option>Female</option>
            <option>Male</option>
            <option>Other</option>
          </select>
        </div>
      </div>

      {suggestions.length > 0 && (
        <div className="rounded-lg bg-green-50 p-3 text-xs text-green-800">
          <span className="font-semibold">AI suggestion:</span> facilities with {form.requiredBedType}{" "}
          beds:{" "}
          {suggestions.map((s, i) => (
            <button
              type="button"
              key={s.id}
              onClick={() => set("destinationFacilityId", s.id)}
              className="underline hover:no-underline"
            >
              {s.name.replace(/ \(.*\)/, "")} ({s.beds[form.requiredBedType]?.available})
              {i < suggestions.length - 1 ? ", " : ""}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="sm:col-span-1">
          <Label>Destination facility</Label>
          <select
            required
            value={form.destinationFacilityId}
            onChange={(e) => set("destinationFacilityId", e.target.value)}
            className={field}
          >
            <option value="">Select…</option>
            {hospitals.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name} · {h.status.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>Ambulance status</Label>
          <select value={form.ambulanceStatus} onChange={(e) => set("ambulanceStatus", e.target.value)} className={field}>
            <option>Dispatched</option>
            <option>EnRoute</option>
            <option>None</option>
          </select>
        </div>
        <div>
          <Label>ETA</Label>
          <input value={form.eta} onChange={(e) => set("eta", e.target.value)} placeholder="e.g. 18 min" className={field} />
        </div>
      </div>

      <div>
        <Label>Notes</Label>
        <textarea
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
          rows={2}
          placeholder="Clinical handover notes (no identifiable patient data)"
          className={field}
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={busy}
          className="rounded-md bg-ghana-red px-5 py-2 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
        >
          {busy ? "Submitting…" : "Submit referral"}
        </button>
        {msg && <span className="text-sm text-slate-600">{msg}</span>}
      </div>
    </form>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-1 block text-xs font-medium text-slate-600">{children}</label>;
}
