"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin", label: "National Dashboard" },
  { href: "/admin/verification", label: "Verification" },
  { href: "/admin/hospitals", label: "Hospitals" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/sms", label: "SMS Logs" },
  { href: "/admin/audit", label: "Audit Logs" },
];

export function AdminNav() {
  const path = usePathname();
  return (
    <nav className="flex flex-wrap gap-1 border-b border-slate-200">
      {TABS.map((t) => {
        const active = path === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium ${
              active
                ? "border-ghana-green text-ghana-green"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
