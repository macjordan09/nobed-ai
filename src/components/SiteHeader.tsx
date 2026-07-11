import Link from "next/link";
import { ROLE_LABELS, type Role } from "@/lib/rbac";
import type { Session } from "@/lib/auth";

const PUBLIC_LINKS = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/capacity", label: "Live Capacity" },
  { href: "/#sms", label: "SMS Access" },
  { href: "/#for-hospitals", label: "For Hospitals" },
  { href: "/#partners", label: "Partners" },
  { href: "/about", label: "About" },
];

function portalLink(session: Session | null) {
  if (!session) return null;
  switch (session.role) {
    case "HOSPITAL_STAFF":
    case "HOSPITAL_ADMIN":
      return { href: "/dashboard", label: "Hospital Portal" };
    case "AMBULANCE_DISPATCHER":
      return { href: "/ambulance", label: "Ambulance Portal" };
    case "REGIONAL_ADMIN":
    case "NATIONAL_ADMIN":
    case "SUPER_ADMIN":
    case "AUDITOR":
      return { href: "/admin", label: "Admin Portal" };
    default:
      return null;
  }
}

export function SiteHeader({ session }: { session: Session | null }) {
  const portal = portalLink(session);
  return (
    <header className="sticky top-0 z-[1000] border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/nobed-mark.svg" alt="" className="h-8 w-8" />
          <span className="text-lg font-bold tracking-tight text-brand-ink">
            NoBed<span className="text-brand-green">.ai</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {PUBLIC_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              {l.label}
            </Link>
          ))}
          {portal && (
            <Link
              href={portal.href}
              className="rounded-md px-3 py-1.5 text-sm font-semibold text-ghana-green hover:bg-green-50"
            >
              {portal.label}
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/find-beds"
            className="hidden rounded-lg bg-brand-red px-4 py-1.5 text-sm font-bold text-white shadow-sm transition hover:bg-red-700 sm:inline-flex"
          >
            Find a Bed
          </Link>
          {session ? (
            <>
              <div className="hidden text-right lg:block">
                <div className="text-sm font-medium leading-tight">{session.name}</div>
                <div className="text-xs text-slate-500">{ROLE_LABELS[session.role as Role]}</div>
              </div>
              <form action="/api/auth/logout" method="post">
                <button
                  type="submit"
                  className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-md border border-slate-300 px-4 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
