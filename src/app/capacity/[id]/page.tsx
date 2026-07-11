import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ACCEPTANCE_META,
  CONFIDENCE_META,
  formatAgo,
  getHospital,
  HOSPITALS,
  STATUS_META,
  TONE_META,
} from "@/lib/operational";
import { OperationalStatusBadge } from "@/components/OperationalStatusBadge";

export function generateStaticParams() {
  return HOSPITALS.map((h) => ({ id: h.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const h = getHospital(params.id);
  if (!h) return { title: "Hospital not found · noBed.ai" };
  return {
    title: `${h.shortName} · Operational Capacity · noBed.ai`,
    description: h.summary,
  };
}

export default function HospitalCapacityDetail({ params }: { params: { id: string } }) {
  const h = getHospital(params.id);
  if (!h) notFound();
  const meta = STATUS_META[h.status];
  const conf = CONFIDENCE_META[h.trust.confidence];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Link href="/capacity" className="text-sm font-medium text-slate-500 hover:text-slate-800">
        ← All facilities
      </Link>

      {/* Header */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="relative h-44 w-full sm:h-52">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={h.photo} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="mb-2">
              <OperationalStatusBadge status={h.status} size="lg" />
            </div>
            <h1 className="text-2xl font-black leading-tight drop-shadow sm:text-3xl">{h.name}</h1>
            <p className="text-sm text-slate-200">
              {h.facilityType} · {h.district}, {h.region}
            </p>
          </div>
        </div>

        {/* Overall status + trust */}
        <div className="grid gap-4 border-b border-slate-100 p-5 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Overall capacity
            </div>
            <div className={`mt-1 text-xl font-black ${meta.text}`}>{meta.label}</div>
            <p className="mt-1 text-sm leading-snug text-slate-600">{h.summary}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs">
            <div className="font-semibold uppercase tracking-wide text-slate-400">Data trust</div>
            <dl className="mt-2 space-y-1.5 text-slate-600">
              <div className="flex justify-between gap-2">
                <dt className="text-slate-400">Last updated</dt>
                <dd className="font-medium text-slate-700">{formatAgo(h.trust.updatedMinutesAgo)}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-slate-400">Updated by</dt>
                <dd className="font-medium text-slate-700">{h.trust.updatedByRole}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-slate-400">Confidence</dt>
                <dd className={`inline-flex items-center gap-1 font-semibold ${conf.text}`}>
                  <span className={`inline-block h-1.5 w-1.5 rounded-full ${conf.dot}`} />
                  {h.trust.confidence}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-slate-400">Source</dt>
                <dd className="font-medium text-slate-700">{h.trust.source}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Resource breakdown */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
            Resource breakdown
          </h2>
          <ul className="mt-3 divide-y divide-slate-100">
            {h.resources.map((r) => (
              <li key={r.label} className="flex items-center justify-between gap-3 py-2.5">
                <div>
                  <div className="text-sm font-medium text-slate-700">{r.label}</div>
                  {r.hint && <div className="text-xs text-slate-400">{r.hint}</div>}
                </div>
                <span className={`inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-semibold ${TONE_META[r.tone].text}`}>
                  <span className={`inline-block h-2 w-2 rounded-full ${TONE_META[r.tone].dot}`} />
                  {r.value}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Service acceptance */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
            Service-specific acceptance
          </h2>
          <ul className="mt-3 space-y-2">
            {h.services.map((s) => {
              const a = ACCEPTANCE_META[s.acceptance];
              return (
                <li
                  key={s.label}
                  className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2 ${a.bg} ${a.border}`}
                >
                  <div>
                    <div className="text-sm font-medium text-slate-700">{s.label}</div>
                    {s.note && <div className="text-xs text-slate-500">{s.note}</div>}
                  </div>
                  <span className={`whitespace-nowrap text-sm font-bold ${a.text}`}>{a.label}</span>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      {/* Constraints */}
      {h.constraints.length > 0 && (
        <section className={`mt-6 rounded-2xl border p-5 ${meta.bg} ${meta.border}`}>
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-600">
            Current constraints
          </h2>
          <ul className="mt-3 space-y-1.5">
            {h.constraints.map((c) => (
              <li key={c} className="flex items-start gap-2 text-sm text-slate-700">
                <span className={`mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full ${meta.dot}`} />
                {c}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Referral guidance */}
      <section className="mt-6 rounded-2xl border border-brand-ink/10 bg-brand-ink p-5 text-white shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-wide text-white/60">
          Recommended referral guidance
        </h2>
        <p className="mt-2 text-lg font-semibold leading-snug">{h.referralGuidance}</p>
        <p className="mt-3 text-xs text-white/50">
          Guidance is generated from live operational capacity, not bed counts alone. In a
          life-threatening emergency, call 112 (National Ambulance Service).
        </p>
      </section>
    </div>
  );
}
