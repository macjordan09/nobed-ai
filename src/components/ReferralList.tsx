"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export interface ReferralDTO {
  id: string;
  referralCode: string;
  patientReference: string;
  patientAgeRange: string;
  patientGender: string;
  emergencyType: string;
  urgencyLevel: string;
  requiredBedType: string;
  currentLocation: string | null;
  ambulanceStatus: string | null;
  eta: string | null;
  currentStatus: string;
  notes: string | null;
  bedReserved?: boolean;
  createdAt: string;
  referringFacility?: { name: string } | null;
  destinationFacility?: { name: string } | null;
  events: { id: string; eventType: string; message: string; createdAt: string }[];
}

const STATUS_STYLE: Record<string, string> = {
  Draft: "bg-slate-100 text-slate-700",
  Submitted: "bg-blue-100 text-blue-800",
  Accepted: "bg-green-100 text-green-800",
  Declined: "bg-red-100 text-red-800",
  Redirected: "bg-purple-100 text-purple-800",
  InTransit: "bg-amber-100 text-amber-800",
  Arrived: "bg-teal-100 text-teal-800",
  Closed: "bg-slate-200 text-slate-700",
  Escalated: "bg-red-200 text-red-900",
};

const URGENCY_STYLE: Record<string, string> = {
  Critical: "bg-red-600 text-white",
  Urgent: "bg-orange-500 text-white",
  Stable: "bg-green-600 text-white",
};

export function ReferralList({
  referrals,
  canManage = false,
}: {
  referrals: ReferralDTO[];
  canManage?: boolean;
}) {
  if (!referrals.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-400">
        No referrals yet.
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {referrals.map((r) => (
        <ReferralCard key={r.id} r={r} canManage={canManage} />
      ))}
    </div>
  );
}

function ReferralCard({ r, canManage }: { r: ReferralDTO; canManage: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function setStatus(status: string) {
    setBusy(true);
    await fetch(`/api/referrals/${r.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBusy(false);
    router.refresh();
  }

  const actionable = !["Closed", "Declined"].includes(r.currentStatus);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">{r.referralCode}</span>
            <span className={`pill ${URGENCY_STYLE[r.urgencyLevel] ?? "bg-slate-500 text-white"}`}>
              {r.urgencyLevel}
            </span>
            <span className={`pill ${STATUS_STYLE[r.currentStatus] ?? "bg-slate-100"}`}>
              {r.currentStatus}
            </span>
            {r.bedReserved && (
              <span className="pill bg-green-100 text-green-800" title="A bed is held at the destination">
                🛏 Bed held
              </span>
            )}
          </div>
          <div className="mt-1 text-sm text-slate-700">{r.emergencyType}</div>
          <div className="mt-0.5 text-xs text-slate-500">
            {r.patientReference} · {r.patientGender}, {r.patientAgeRange} · needs{" "}
            <strong>{r.requiredBedType}</strong> bed
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {r.referringFacility?.name ?? r.currentLocation ?? "—"} →{" "}
            {r.destinationFacility?.name ?? "—"}
            {r.eta ? ` · ETA ${r.eta}` : ""}
            {r.ambulanceStatus && r.ambulanceStatus !== "None" ? ` · 🚑 ${r.ambulanceStatus}` : ""}
          </div>
        </div>
        <button onClick={() => setOpen((o) => !o)} className="text-xs text-ghana-green hover:underline">
          {open ? "Hide log" : "View log"}
        </button>
      </div>

      {open && (
        <ol className="mt-3 space-y-1 border-l-2 border-slate-200 pl-3 text-xs text-slate-600">
          {r.events.map((e) => (
            <li key={e.id}>
              <span className="font-medium">{e.eventType}</span> — {e.message}{" "}
              <span className="text-slate-400">
                ({new Date(e.createdAt).toLocaleString("en-GB")})
              </span>
            </li>
          ))}
        </ol>
      )}

      {canManage && actionable && (
        <div className="mt-3 flex flex-wrap gap-2">
          {r.currentStatus === "Submitted" && (
            <>
              <Action label="Accept" onClick={() => setStatus("Accepted")} busy={busy} tone="green" />
              <Action label="Decline" onClick={() => setStatus("Declined")} busy={busy} tone="red" />
              <Action label="Redirect" onClick={() => setStatus("Redirected")} busy={busy} tone="slate" />
            </>
          )}
          {r.currentStatus === "Accepted" && (
            <Action label="Mark in transit" onClick={() => setStatus("InTransit")} busy={busy} tone="amber" />
          )}
          {r.currentStatus === "InTransit" && (
            <Action label="Mark arrived" onClick={() => setStatus("Arrived")} busy={busy} tone="green" />
          )}
          {r.currentStatus === "Arrived" && (
            <Action label="Close referral" onClick={() => setStatus("Closed")} busy={busy} tone="slate" />
          )}
          <Action label="Escalate" onClick={() => setStatus("Escalated")} busy={busy} tone="red" />
        </div>
      )}
    </div>
  );
}

function Action({
  label,
  onClick,
  busy,
  tone,
}: {
  label: string;
  onClick: () => void;
  busy: boolean;
  tone: "green" | "red" | "amber" | "slate";
}) {
  const tones = {
    green: "bg-ghana-green hover:bg-green-800 text-white",
    red: "bg-red-600 hover:bg-red-700 text-white",
    amber: "bg-orange-500 hover:bg-orange-600 text-white",
    slate: "bg-slate-700 hover:bg-slate-800 text-white",
  };
  return (
    <button
      onClick={onClick}
      disabled={busy}
      className={`rounded-md px-3 py-1 text-xs font-semibold disabled:opacity-50 ${tones[tone]}`}
    >
      {label}
    </button>
  );
}
