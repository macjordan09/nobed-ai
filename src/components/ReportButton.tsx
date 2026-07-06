"use client";

import { useState } from "react";
import { REPORT_TYPES } from "@/lib/verification";

// Public / stakeholder feedback on a hospital's reported status.
// Optional OTP phone verification raises the report's trust level.
export function ReportButton({ hospitalId, hospitalName }: { hospitalId: string; hospitalName: string }) {
  const [open, setOpen] = useState(false);
  const [reportType, setReportType] = useState("ACCURATE");
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [useOtp, setUseOtp] = useState(false);
  const [code, setCode] = useState("");
  const [sent, setSent] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function sendCode() {
    setError("");
    const res = await fetch("/api/verify/otp/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target: phone, channel: "phone", purpose: "report" }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Could not send code");
    // demo only: surface the code so it can be entered without a real SMS
    setSent(data.devCode ? `Demo code: ${data.devCode}` : "Code sent by SMS");
  }

  async function submit() {
    setBusy(true);
    setError("");
    const body: Record<string, unknown> = { hospitalId, reportType, message };
    if (useOtp && phone) {
      body.phone = phone;
      body.code = code;
    }
    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) return setError(data.error || "Could not submit");
    setDone(true);
  }

  const field = "w-full rounded-md border border-slate-300 px-3 py-2 text-sm";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs font-medium text-ghana-green hover:underline"
      >
        Report / confirm info
      </button>

      {open && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40 p-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
            {done ? (
              <div className="text-center">
                <div className="text-3xl">🙏</div>
                <h3 className="mt-2 text-lg font-semibold">Thank you</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Your report on <strong>{hospitalName}</strong> was submitted
                  {useOtp && phone ? " and verified" : ""}. Our team will review it.
                </p>
                <button onClick={() => setOpen(false)} className="mt-4 rounded-md bg-ghana-green px-4 py-2 text-sm font-semibold text-white">
                  Close
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-semibold">Report or confirm</h3>
                <p className="text-sm text-slate-500">{hospitalName}</p>

                <label className="mt-3 block text-xs font-medium text-slate-600">What happened?</label>
                <select value={reportType} onChange={(e) => setReportType(e.target.value)} className={field}>
                  {Object.entries(REPORT_TYPES).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Add detail (optional, no patient names)"
                  rows={2}
                  className={`${field} mt-2`}
                />

                <label className="mt-3 flex items-center gap-2 text-sm text-slate-700">
                  <input type="checkbox" checked={useOtp} onChange={(e) => setUseOtp(e.target.checked)} />
                  Verify my phone number (recommended — makes your report trusted)
                </label>

                {useOtp && (
                  <div className="mt-2 space-y-2 rounded-lg bg-slate-50 p-3">
                    <div className="flex gap-2">
                      <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+233…" className={field} />
                      <button onClick={sendCode} type="button" className="shrink-0 rounded-md border border-slate-300 px-3 text-sm font-medium hover:bg-white">
                        Send code
                      </button>
                    </div>
                    {sent && <p className="text-xs text-ghana-green">{sent}</p>}
                    <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter 6-digit code" className={field} />
                  </div>
                )}

                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

                <div className="mt-4 flex justify-end gap-2">
                  <button onClick={() => setOpen(false)} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium">
                    Cancel
                  </button>
                  <button onClick={submit} disabled={busy} className="rounded-md bg-ghana-green px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
                    {busy ? "Submitting…" : "Submit"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
