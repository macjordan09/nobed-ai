"use client";

import { useEffect, useRef, useState } from "react";

// Real, publicly reported No Bed Syndrome deaths in Ghana, in chronological order.
// Presented factually, with attribution and dignity. Not exhaustive.
const CASES = [
  {
    date: "June 2018",
    name: "Anthony Opoku-Acheampong, 70",
    place: "Accra",
    tag: "The case that named it",
    body:
      "Turned away from seven hospitals in a single ordeal, he died at LEKMA Hospital. His death forced “No Bed Syndrome” into Ghana’s national conscience.",
    source: "Reported by Citi Newsroom, 2018",
  },
  {
    date: "July 2018",
    name: "Angela Afriyie Agyemang, 30",
    place: "Suntreso Government Hospital, Kumasi",
    body: "In labour and unable to get a theatre bed, she died, together with her unborn baby.",
    source: "Reported by Ghanaian media, 2018",
  },
  {
    date: "April 2025",
    name: "A patient at Tamale Teaching Hospital",
    place: "Tamale",
    body:
      "Needing specialised care, the patient died with all four of the hospital’s ICU beds occupied. The case drew national scrutiny.",
    source: "Reported by Ghanaian media, 2025",
  },
  {
    date: "2026",
    name: "Charles Amissah, 29",
    place: "Accra",
    body:
      "A hit-and-run survivor, turned away by the Police, Ridge and Korle Bu hospitals, died after about three hours in the ambulance. The President called the “no bed syndrome” unacceptable.",
    source: "Reported by Ghanaian Times, 2026",
  },
];

function Item({ c, i }: { c: (typeof CASES)[number]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVis(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`relative pb-10 pl-16 transition-all duration-700 ease-out ${
        vis ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
      style={{ transitionDelay: `${i * 90}ms` }}
    >
      <span className="absolute left-[14px] top-1 flex h-7 w-7 items-center justify-center rounded-full bg-brand-red ring-4 ring-red-100">
        <span className="h-2 w-2 rounded-full bg-white" />
      </span>
      <div className="lift rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-bold text-brand-red">{c.date}</span>
          {c.tag && (
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{c.tag}</span>
          )}
        </div>
        <div className="mt-2 text-lg font-bold text-slate-900">{c.name}</div>
        <div className="text-xs text-slate-500">{c.place}</div>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{c.body}</p>
        <p className="mt-3 text-xs italic text-slate-400">{c.source}</p>
      </div>
    </div>
  );
}

export function CaseTimeline() {
  return (
    <div className="relative mx-auto max-w-2xl">
      {/* timeline rail */}
      <span className="absolute bottom-10 left-[27px] top-2 w-0.5 bg-red-100" />
      {CASES.map((c, i) => (
        <Item key={c.name} c={c} i={i} />
      ))}
      <div className="relative pl-16 text-sm text-slate-500">
        <span className="absolute left-[14px] top-0 h-7 w-7 rounded-full border-2 border-dashed border-red-300" />
        …and the many more that never made the news.
      </div>
    </div>
  );
}
