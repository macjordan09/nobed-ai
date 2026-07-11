import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { SiteHeader } from "@/components/SiteHeader";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "NoBed.ai · Ghana real-time hospital bed availability",
  description:
    "Real-time hospital bed availability, emergency referral and health-system coordination for Ghana. Ending No Bed Syndrome.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const session = getSession();
  return (
    <html lang="en">
      <body>
        <SiteHeader session={session} />
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">{children}</main>
        <footer className="mt-12 border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-slate-500 sm:px-6">
            <p>
              <span className="font-semibold text-slate-700">NoBed.ai</span>. Ghana&apos;s
              real-time emergency hospital capacity platform. MVP demo. In a real emergency, call{" "}
              <span className="font-semibold text-ghana-red">112</span>.
            </p>
            <p className="mt-1 text-xs">
              Data shown is seeded demo data. Patient references are anonymized per the Ghana Data
              Protection Act, 2012.
            </p>
            <p className="mt-3 text-xs text-slate-400">
              Created &amp; developed by{" "}
              <span className="font-semibold text-slate-600">Mac-Jordan Degadjor</span> · © 2026 ·{" "}
              <a href="/about" className="font-semibold text-slate-500 hover:text-slate-700 hover:underline">
                About / the story →
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
