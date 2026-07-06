"use client";

import { useState } from "react";

interface Msg {
  dir: "in" | "out";
  text: string;
  status?: string;
}

const EXAMPLES = [
  { label: "Find emergency beds", phone: "+233244111222", cmd: "BED ACCRA" },
  { label: "Find ICU near Kumasi", phone: "+233244111222", cmd: "ICU KUMASI" },
  { label: "Hospital update (authorized)", phone: "+233200000002", cmd: "UPDATE KORLEBU EMERGENCY 2 ICU 1" },
  { label: "Update (unauthorized number)", phone: "+233555000999", cmd: "UPDATE RIDGE EMERGENCY 3" },
  { label: "Help", phone: "+233244111222", cmd: "HELP" },
];

export default function SmsPage() {
  const [phone, setPhone] = useState("+233244111222");
  const [cmd, setCmd] = useState("BED ACCRA");
  const [log, setLog] = useState<Msg[]>([]);
  const [busy, setBusy] = useState(false);

  async function send(p = phone, c = cmd) {
    if (!c.trim()) return;
    setBusy(true);
    setLog((l) => [...l, { dir: "in", text: c }]);
    try {
      const res = await fetch("/api/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: p, command: c }),
      });
      const data = await res.json();
      setLog((l) => [...l, { dir: "out", text: data.response, status: data.status }]);
    } catch {
      setLog((l) => [...l, { dir: "out", text: "Network error", status: "ERROR" }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">SMS short-code simulator</h1>
        <p className="mt-1 text-sm text-slate-600">
          For users with no internet. This simulates the NoBed.ai short code. In production these
          messages route through Africa&apos;s Talking / Hubtel / Arkesel. Hospital updates are only
          accepted from registered hospital numbers.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {EXAMPLES.map((e) => (
          <button
            key={e.label}
            onClick={() => {
              setPhone(e.phone);
              setCmd(e.cmd);
              send(e.phone, e.cmd);
            }}
            disabled={busy}
            className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:border-ghana-green hover:text-ghana-green disabled:opacity-50"
          >
            {e.label}
          </button>
        ))}
      </div>

      {/* Phone mock */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 border-b border-slate-100 pb-2 text-center text-xs font-semibold text-slate-400">
          NoBed short code · {phone}
        </div>
        <div className="flex min-h-[200px] flex-col gap-2">
          {log.length === 0 && (
            <p className="my-auto text-center text-sm text-slate-400">
              Send a command or tap an example above.
            </p>
          )}
          {log.map((m, i) => (
            <div
              key={i}
              className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                m.dir === "in"
                  ? "self-end bg-ghana-green text-white"
                  : m.status === "UNAUTHORIZED" || m.status === "ERROR"
                    ? "self-start bg-red-100 text-red-800"
                    : "self-start bg-slate-100 text-slate-800"
              }`}
            >
              {m.text}
              {m.dir === "out" && m.status && m.status !== "OK" && (
                <span className="ml-2 text-[10px] font-bold uppercase">[{m.status}]</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-44 rounded-md border border-slate-300 px-2 py-2 text-sm"
            placeholder="Sender phone"
          />
          <input
            value={cmd}
            onChange={(e) => setCmd(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm"
            placeholder="e.g. BED ACCRA"
          />
          <button
            onClick={() => send()}
            disabled={busy}
            className="rounded-md bg-ghana-green px-4 py-2 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-50"
          >
            Send
          </button>
        </div>
        <p className="text-xs text-slate-500">
          Commands: <code>BED &lt;city&gt;</code> · <code>ICU &lt;city&gt;</code> ·{" "}
          <code>UPDATE &lt;hospital&gt; EMERGENCY n ICU n</code> · <code>HELP</code>
        </p>
      </div>
    </div>
  );
}
