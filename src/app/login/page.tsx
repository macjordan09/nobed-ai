"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const DEMO = [
  { role: "Public User", email: "public@nobed.ai", password: "public123" },
  { role: "Hospital Staff (Korle Bu)", email: "staff@korlebu.gov.gh", password: "staff123" },
  { role: "Hospital Admin (Ridge)", email: "admin@ridge.gov.gh", password: "admin123" },
  { role: "Ambulance Dispatcher", email: "dispatch@ambulance.gov.gh", password: "dispatch123" },
  { role: "Regional Health Admin", email: "regional@ghs.gov.gh", password: "regional123" },
  { role: "National Health Admin", email: "national@moh.gov.gh", password: "national123" },
  { role: "Super Admin", email: "super@nobed.ai", password: "super123" },
  { role: "System Auditor", email: "auditor@nobed.ai", password: "auditor123" },
  { role: "Hospital Staff (pending verification)", email: "nurse@tema.gov.gh", password: "nurse123" },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent, creds?: { email: string; password: string }) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const body = creds ?? { email, password };
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Login failed");
      setBusy(false);
      return;
    }
    router.push(data.redirect);
    router.refresh();
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
      <div>
        <h1 className="text-2xl font-bold">Sign in</h1>
        <p className="mt-1 text-sm text-slate-600">
          Access your hospital, ambulance or admin portal.
        </p>
        <form onSubmit={(e) => submit(e)} className="mt-6 space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            required
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-md bg-ghana-green px-4 py-2 font-semibold text-white hover:bg-green-800 disabled:opacity-50"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="mt-3 text-xs text-slate-500">
          Production uses Supabase Auth / Clerk with MFA for admins and OTP for SMS users. This demo
          uses simple credentials.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold">Demo accounts</h2>
        <p className="mb-3 text-xs text-slate-500">Click any role to sign in instantly.</p>
        <div className="space-y-2">
          {DEMO.map((d) => (
            <button
              key={d.email}
              onClick={(e) => submit(e, { email: d.email, password: d.password })}
              disabled={busy}
              className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-left text-sm hover:border-ghana-green hover:bg-green-50 disabled:opacity-50"
            >
              <span>
                <span className="font-medium">{d.role}</span>
                <span className="block text-xs text-slate-500">{d.email}</span>
              </span>
              <span className="text-xs text-slate-400">{d.password}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
