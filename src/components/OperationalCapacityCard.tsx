import Link from "next/link";
import {
  ACCEPTANCE_META,
  CONFIDENCE_META,
  formatAgo,
  STATUS_META,
  TONE_META,
  type OperationalHospital,
} from "@/lib/operational";
import { OperationalStatusBadge } from "@/components/OperationalStatusBadge";

// Key resources surfaced on the compact card (full list lives on the detail view).
const KEY_RESOURCES = [
  "Available beds",
  "ICU capacity",
  "Oxygen supply",
  "Emergency physicians",
  "Nurses on duty",
  "Ventilators",
];

export function OperationalCapacityCard({ h }: { h: OperationalHospital }) {
  const meta = STATUS_META[h.status];
  const conf = CONFIDENCE_META[h.trust.confidence];
  const key = KEY_RESOURCES.map((k) => h.resources.find((r) => r.label === k)).filter(
    (r): r is NonNullable<typeof r> => Boolean(r),
  );

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      {/* Photo + status */}
      <div className="relative h-32 w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={h.photo} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
        <div className="absolute left-3 top-3">
          <OperationalStatusBadge status={h.status} />
        </div>
        <div className="absolute bottom-2 left-3 right-3 text-white">
          <div className="text-sm font-bold leading-tight drop-shadow">{h.name}</div>
          <div className="text-[11px] text-slate-200">
            {h.facilityType} · {h.region}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Freshness / trust line */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
          <span>Updated {formatAgo(h.trust.updatedMinutesAgo)}</span>
          <span className="text-slate-300">•</span>
          <span>{h.trust.updatedByRole}</span>
          <span className="text-slate-300">•</span>
          <span className="inline-flex items-center gap-1">
            <span className={`inline-block h-1.5 w-1.5 rounded-full ${conf.dot}`} />
            <span className={conf.text}>Confidence {h.trust.confidence}</span>
          </span>
        </div>

        <p className="text-sm leading-snug text-slate-600">{h.summary}</p>

        {/* Key resources */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
          {key.map((r) => (
            <div key={r.label} className="flex items-center justify-between gap-2 text-xs">
              <span className="truncate text-slate-500">{r.label}</span>
              <span className={`inline-flex items-center gap-1 font-semibold ${TONE_META[r.tone].text}`}>
                <span className={`inline-block h-1.5 w-1.5 rounded-full ${TONE_META[r.tone].dot}`} />
                {r.value}
              </span>
            </div>
          ))}
        </div>

        {/* Service acceptance chips */}
        <div className="flex flex-wrap gap-1.5">
          {h.services.map((s) => {
            const a = ACCEPTANCE_META[s.acceptance];
            const mark = s.acceptance === "yes" ? "✓" : s.acceptance === "no" ? "✕" : s.acceptance === "limited" ? "!" : "?";
            return (
              <span
                key={s.label}
                className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px] font-medium ${a.bg} ${a.text} ${a.border}`}
                title={s.note ? `${s.label}: ${a.label} — ${s.note}` : `${s.label}: ${a.label}`}
              >
                <span aria-hidden>{mark}</span>
                {s.label}
              </span>
            );
          })}
        </div>

        {/* Constraints */}
        {h.constraints.length > 0 && (
          <div className={`rounded-lg border px-3 py-2 text-xs ${meta.bg} ${meta.border}`}>
            <span className="font-semibold text-slate-700">Why restricted: </span>
            <span className="text-slate-600">{h.constraints.join("; ")}.</span>
          </div>
        )}

        <Link
          href={`/capacity/${h.id}`}
          className="mt-auto inline-flex items-center gap-1 pt-1 text-sm font-semibold text-brand-green hover:underline"
        >
          View full operational status →
        </Link>
      </div>
    </div>
  );
}
