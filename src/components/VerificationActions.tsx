"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function Btn({
  label,
  onClick,
  tone,
  busy,
}: {
  label: string;
  onClick: () => void;
  tone: "green" | "red" | "slate";
  busy: boolean;
}) {
  const tones = {
    green: "bg-ghana-green hover:bg-green-800 text-white",
    red: "bg-red-600 hover:bg-red-700 text-white",
    slate: "bg-slate-700 hover:bg-slate-800 text-white",
  };
  return (
    <button onClick={onClick} disabled={busy} className={`rounded-md px-3 py-1 text-xs font-semibold disabled:opacity-50 ${tones[tone]}`}>
      {label}
    </button>
  );
}

export function StaffRequestActions({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  async function decide(decision: "APPROVED" | "REJECTED") {
    setBusy(true);
    await fetch(`/api/verify/requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision }),
    });
    setBusy(false);
    router.refresh();
  }
  return (
    <div className="flex gap-2">
      <Btn label="Approve" tone="green" busy={busy} onClick={() => decide("APPROVED")} />
      <Btn label="Reject" tone="red" busy={busy} onClick={() => decide("REJECTED")} />
    </div>
  );
}

export function ReportActions({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  async function moderate(status: "VERIFIED" | "DISMISSED") {
    setBusy(true);
    await fetch(`/api/reports/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBusy(false);
    router.refresh();
  }
  return (
    <div className="flex gap-2">
      <Btn label="Verify" tone="green" busy={busy} onClick={() => moderate("VERIFIED")} />
      <Btn label="Dismiss" tone="slate" busy={busy} onClick={() => moderate("DISMISSED")} />
    </div>
  );
}
