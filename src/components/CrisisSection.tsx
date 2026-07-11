"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const STOPS = [
  { time: "11:40 PM", hospital: "Hospital A", note: "Emergency unit at full capacity.", img: "/crisis/ambulance.svg" },
  { time: "12:25 AM", hospital: "Hospital B", note: "No ICU bed, sent on to the next facility.", img: "/crisis/ward.svg" },
  { time: "1:10 AM", hospital: "Hospital C", note: "Theatre full, turned away at the gate.", img: "/crisis/ambulance.svg" },
  { time: "1:55 AM", hospital: "Hospital D", note: "Still searching. The clock keeps running.", img: "/crisis/ward.svg" },
];

export function CrisisSection() {
  return (
    <section className="full-bleed bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Heading */}
        <div className="max-w-2xl">
          <div className="text-sm font-bold uppercase tracking-[0.25em] text-brand-red">The crisis</div>
          <h2 className="mt-3 text-4xl font-extrabold leading-[1.05] tracking-tight text-slate-900 sm:text-5xl">
            One patient. <span className="text-brand-red">A whole night on the road.</span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">
            When hospitals cannot see each other&apos;s capacity, critically ill patients are sent
            from facility to facility while precious treatment time disappears.
          </p>
        </div>

        {/* Hero media card */}
        <Reveal className="mt-12">
          <div className="group relative h-[420px] overflow-hidden rounded-3xl shadow-2xl shadow-slate-300/40 sm:h-[520px]">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.2s] ease-out group-hover:scale-105"
              style={{ backgroundImage: "url(/crisis/ward.svg)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/25" />
            <div className="relative flex h-full flex-col justify-end p-7 text-white sm:p-12">
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-red-300">
                The night that repeats
              </div>
              <p className="mt-3 max-w-2xl text-2xl font-bold leading-snug sm:text-4xl">
                The beds were there. Empty.{" "}
                <span className="text-white/65">He just couldn&apos;t reach one in time.</span>
              </p>
              <p className="mt-3 text-sm text-white/55">
                A hospital ward at 1 a.m., and a patient still in the ambulance outside.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Journey: media cards */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STOPS.map((s, i) => (
            <Reveal key={s.time} delay={i * 90}>
              <div className="group relative h-72 overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${s.img})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10" />
                <div className="absolute inset-x-3 top-3 flex items-center justify-between">
                  <span className="rounded-full bg-black/55 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                    {s.time}
                  </span>
                  <span className="rounded-full bg-brand-red px-3 py-1 text-xs font-bold text-white">
                    ✕ No bed
                  </span>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <div className="text-lg font-bold">{s.hospital}</div>
                  <p className="mt-1 text-sm leading-snug text-white/80">{s.note}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Urgency band */}
        <Reveal className="mt-6">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded-2xl bg-brand-ink px-6 py-5 text-center">
            <span className="text-sm font-semibold uppercase tracking-wide text-white/60">
              11:40 PM → 1:55 AM
            </span>
            <span className="text-2xl font-black tracking-tight text-brand-amber sm:text-3xl">
              2h 15m on the road
            </span>
            <span className="text-sm font-semibold text-red-300">And still no bed.</span>
          </div>
        </Reveal>

        {/* Impact metrics */}
        <div className="mt-20 grid gap-5 md:grid-cols-3">
          <Reveal>
            <Metric value="5+" label="Hospitals visited" />
          </Reveal>
          <Reveal delay={120}>
            <Metric value="3h 45m" label="Critical time lost" tone="red" />
          </Reveal>
          <Reveal delay={240}>
            <Link href="/map" className="group block h-full">
              <div className="flex h-full flex-col justify-between rounded-3xl bg-brand-green p-8 text-white shadow-xl shadow-green-900/20 transition group-hover:-translate-y-1">
                <div>
                  <div className="text-5xl font-black tracking-tight sm:text-6xl">1 Map</div>
                  <div className="mt-2 text-lg font-semibold text-green-50">Could have prevented this</div>
                </div>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold">
                  See the live map <span className="transition group-hover:translate-x-1">→</span>
                </div>
              </div>
            </Link>
          </Reveal>
        </div>

        {/* WITH / WITHOUT comparison (asymmetric) */}
        <div className="mt-10 grid gap-5 lg:grid-cols-5">
          <Reveal className="lg:col-span-2">
            <div className="h-full rounded-3xl border border-slate-200 bg-slate-50 p-7">
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Without noBed.ai</div>
              <ul className="mt-5 space-y-3">
                {["Hospital A", "Hospital B", "Hospital C", "Hospital D"].map((h) => (
                  <li key={h} className="flex items-center gap-3 text-slate-500">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-xs font-black text-brand-red">✕</span>
                    <span className="font-medium line-through decoration-slate-300">{h}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 border-t border-slate-200 pt-4 text-sm font-semibold text-brand-red">
                Hours lost. Still no bed.
              </div>
            </div>
          </Reveal>

          <Reveal delay={150} className="lg:col-span-3">
            <div className="relative h-full overflow-hidden rounded-3xl bg-gradient-to-br from-brand-green to-[#0b5c34] p-8 text-white shadow-2xl shadow-green-900/30">
              <div className="text-xs font-bold uppercase tracking-widest text-green-200">With noBed.ai</div>
              <div className="mt-5 flex items-start gap-3">
                <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-lg">✓</span>
                <div className="text-2xl font-bold leading-snug sm:text-3xl">
                  Nearest available ICU bed found immediately.
                </div>
              </div>
              <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <div className="text-6xl font-black tracking-tight sm:text-7xl">12 min</div>
                  <div className="mt-1 text-green-100">away, routed on one shared map</div>
                </div>
                <Link
                  href="/find-beds"
                  className="rounded-xl bg-white px-6 py-3 font-bold text-brand-green transition hover:bg-green-50"
                >
                  Find a Bed Now
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Metric({ value, label, tone }: { value: string; label: string; tone?: "red" }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8">
      <div className={`text-5xl font-black tracking-tight sm:text-6xl ${tone === "red" ? "text-brand-red" : "text-slate-900"}`}>
        {value}
      </div>
      <div className="mt-2 text-lg font-semibold text-slate-500">{label}</div>
    </div>
  );
}

function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`${className ?? ""} transition-all duration-700 ease-out ${show ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
