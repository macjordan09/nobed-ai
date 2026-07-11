import Link from "next/link";
import { formatAgo, TONE_META, type OperationalHospital } from "@/lib/operational";
import { OperationalStatusBadge } from "@/components/OperationalStatusBadge";

// Compact operational capacity card: key resources + trust/freshness.
// Used in the hero mockup and the pilot-network grid.

const METRICS = [
  { key: "Available beds", label: "Emergency beds" },
  { key: "ICU capacity", label: "ICU" },
  { key: "Oxygen supply", label: "Oxygen" },
  { key: "Nurses on duty", label: "Nurses" },
  { key: "Ventilators", label: "Ventilators" },
  { key: "Emergency physicians", label: "Doctors" },
];

export function HospitalCapacityCard({
  h,
  href,
  className = "",
}: {
  h: OperationalHospital;
  href?: string;
  className?: string;
}) {
  const rows = METRICS.map((m) => ({
    label: m.label,
    r: h.resources.find((r) => r.label === m.key),
  })).filter((x): x is { label: string; r: NonNullable<typeof x.r> } => Boolean(x.r));

  const inner = (
    <div className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${className}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate text-sm font-bold text-brand-ink">{h.shortName}</div>
          <div className="truncate text-[11px] text-slate-500">{h.facilityType} · {h.region}</div>
        </div>
        <OperationalStatusBadge status={h.status} size="sm" />
      </div>

      <dl className="mt-3 grid grid-cols-3 gap-x-3 gap-y-2">
        {rows.map(({ label, r }) => (
          <div key={label}>
            <dt className="text-[10px] font-medium uppercase tracking-wide text-slate-400">{label}</dt>
            <dd className={`flex items-center gap-1 text-xs font-semibold ${TONE_META[r.tone].text}`}>
              <span className={`inline-block h-1.5 w-1.5 rounded-full ${TONE_META[r.tone].dot}`} />
              <span className="truncate">{r.value}</span>
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500">
        <span>Updated {formatAgo(h.trust.updatedMinutesAgo)}</span>
        <span className="inline-flex items-center gap-1">
          {h.trust.confidence === "Low" ? (
            <span className="text-slate-400">Unverified</span>
          ) : (
            <>
              <svg viewBox="0 0 20 20" className="h-3 w-3 text-emerald-500" fill="currentColor" aria-hidden>
                <path d="M10 1l2.6 1.9 3.2.1 1 3 2.6 1.9-1 3 1 3-2.6 1.9-1 3-3.2.1L10 19l-2.6-1.9-3.2-.1-1-3L.6 12l1-3-1-3 2.6-1.9 1-3 3.2-.1L10 1z" opacity=".18" />
                <path d="M8.6 12.3L6.4 10l-1 1 3.2 3.2 6-6-1-1-5 4.9z" />
              </svg>
              {h.trust.updatedByRole}
            </>
          )}
        </span>
      </div>
    </div>
  );

  return href ? <Link href={href} className="block transition hover:-translate-y-0.5">{inner}</Link> : inner;
}
