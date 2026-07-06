"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { VERIFICATION_LABELS, type VerificationState } from "@/lib/verification";

export function ConfirmCapacity({
  state,
  verifiedAt,
  verifiedBy,
  canConfirm,
}: {
  state: VerificationState;
  verifiedAt: string | null;
  verifiedBy?: string | null;
  canConfirm: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function confirm() {
    setBusy(true);
    await fetch("/api/verify/capacity", { method: "POST" });
    setBusy(false);
    router.refresh();
  }

  const tone =
    state === "verified"
      ? "border-green-200 bg-green-50"
      : state === "stale"
        ? "border-amber-200 bg-amber-50"
        : "border-slate-200 bg-white";

  return (
    <div className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4 ${tone}`}>
      <div>
        <div className="text-sm font-semibold">
          Data trust: {VERIFICATION_LABELS[state]}
          {state === "verified" ? " ✓" : ""}
        </div>
        <p className="text-xs text-slate-500">
          {state === "verified" && verifiedAt
            ? `Confirmed by ${verifiedBy ?? "staff"} at ${new Date(verifiedAt).toLocaleString("en-GB")}.`
            : state === "stale"
              ? "Capacity hasn't been updated recently. Update and confirm so responders can trust it."
              : "Numbers changed since the last confirmation. Confirm they're still accurate."}
        </p>
      </div>
      {canConfirm && state !== "verified" && (
        <button
          onClick={confirm}
          disabled={busy}
          className="rounded-md bg-ghana-green px-4 py-2 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-50"
        >
          {busy ? "Confirming…" : "Confirm current capacity"}
        </button>
      )}
    </div>
  );
}
