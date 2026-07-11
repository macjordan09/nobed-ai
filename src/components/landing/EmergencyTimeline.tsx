// The crisis, told as a timeline: the search that shouldn't have to happen,
// contrasted with the same night on noBed.ai.

const SEARCH = [
  { time: "11:40 PM", text: "Hospital A: No ICU bed" },
  { time: "12:25 AM", text: "Hospital B: Theatre full" },
  { time: "1:10 AM", text: "Hospital C: Oxygen low" },
  { time: "1:55 AM", text: "Still searching…" },
];

export function EmergencyTimeline() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {/* Without */}
      <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-red-600">
          <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
          Tonight, without noBed.ai
        </div>
        <ol className="mt-4 space-y-0">
          {SEARCH.map((s, i) => (
            <li key={s.time} className="relative flex gap-3 pb-4 last:pb-0">
              {i < SEARCH.length - 1 && (
                <span className="absolute left-[5px] top-4 h-full w-px bg-red-100" aria-hidden />
              )}
              <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-red-400 ring-4 ring-red-50" />
              <div>
                <div className="font-mono text-xs font-semibold text-red-600">{s.time}</div>
                <div className="text-sm text-slate-700">{s.text}</div>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-2 text-xs italic text-slate-500">
          Every hospital gate is another gamble with time no one has.
        </p>
      </div>

      {/* With */}
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-emerald-700">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
          The same night, with noBed.ai
        </div>
        <ol className="mt-4 space-y-3">
          {[
            "Nearest facility with a free, functional ICU bed found, instantly.",
            "Bed confirmed and held at the receiving hospital.",
            "Ambulance routed with live turn-by-turn guidance.",
            "Referral tracked end-to-end until the patient arrives.",
          ].map((t, i) => (
            <li key={t} className="flex gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-bold text-white">
                {i + 1}
              </span>
              <span className="text-sm text-slate-700">{t}</span>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-sm font-semibold text-emerald-800">
          One search. Minutes, not hours.
        </p>
      </div>
    </div>
  );
}
