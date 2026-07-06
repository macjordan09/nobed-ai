"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Cinematic full-screen hero. Each slide evokes a major teaching hospital.
// Drop real licensed photography in via the `image` field (used as a background
// image over the gradient); the gradient is the graceful fallback.
const SLIDES = [
  {
    name: "Korle Bu Teaching Hospital",
    city: "Accra",
    image: "/hospitals/korle-bu.svg",
    from: "#041f14",
    via: "#0F7A45",
    to: "#02130c",
  },
  {
    name: "Komfo Anokye Teaching Hospital",
    city: "Kumasi",
    image: "/hospitals/kath.svg",
    from: "#03160f",
    via: "#0b5c3a",
    to: "#02130c",
  },
  {
    name: "University of Ghana Medical Centre",
    city: "Accra",
    image: "/hospitals/ugmc.svg",
    from: "#06140d",
    via: "#0F7A45",
    to: "#021008",
  },
];

export function HeroSlider() {
  const [i, setI] = useState(0);
  const [demo, setDemo] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % SLIDES.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="full-bleed relative -mt-6 h-[92vh] min-h-[620px] overflow-hidden bg-black text-white">
      {/* Slides */}
      {SLIDES.map((s, idx) => (
        <div
          key={s.name}
          className="absolute inset-0 transition-opacity duration-[1200ms] ease-in-out"
          style={{ opacity: idx === i ? 1 : 0 }}
          aria-hidden={idx !== i}
        >
          <div
            className={idx === i ? "kenburns absolute inset-0" : "absolute inset-0"}
            style={{
              backgroundImage: s.image
                ? `linear-gradient(180deg, rgba(2,13,8,0.15), rgba(2,13,8,0.55)), url(${s.image})`
                : `radial-gradient(80% 60% at 70% 20%, ${s.via}66, transparent), linear-gradient(135deg, ${s.from}, ${s.via}, ${s.to})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </div>
      ))}

      {/* faint medical heartbeat motif */}
      <svg className="pointer-events-none absolute inset-x-0 top-1/2 h-40 w-full -translate-y-1/2 text-white/10" viewBox="0 0 1200 120" preserveAspectRatio="none" fill="none">
        <path d="M0 60 H160 l16 -44 l16 84 l16 -66 l12 26 H520 l16 -44 l16 84 l16 -66 l12 26 H1200" stroke="currentColor" strokeWidth="2.5" />
      </svg>

      {/* dark legibility overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/50" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-5 sm:px-8">
        <div className="max-w-3xl">
          <span className="fade-up inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] backdrop-blur">
            <span className="live-dot text-brand-amber" /> Real-time emergency beds · Ghana
          </span>

          <h1 className="fade-up delay-1 mt-5 text-[19vw] font-black leading-[0.82] tracking-tighter text-brand-red sm:text-8xl xl:text-9xl" style={{ textShadow: "0 6px 40px rgba(0,0,0,.5)" }}>
            NO BED.
          </h1>

          <p className="fade-up delay-2 mt-5 text-2xl font-bold sm:text-3xl">
            No one should die looking for a bed.
          </p>

          <p className="fade-up delay-3 mt-4 max-w-xl text-base leading-relaxed text-slate-200 sm:text-lg">
            Every minute spent searching for an available hospital bed can cost a life. noBed.ai
            provides real-time visibility into emergency bed availability across Ghana.
          </p>

          <div className="fade-up delay-4 mt-8 flex flex-wrap gap-3">
            <Link
              href="/find-beds"
              className="rounded-xl bg-brand-red px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-brand-red/30 transition hover:bg-red-700"
            >
              Find a Bed Now
            </Link>
            <button
              onClick={() => setDemo(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/5 px-7 py-3.5 text-base font-bold backdrop-blur transition hover:bg-white/15"
            >
              <span className="text-lg">▶</span> Watch Demo
            </button>
          </div>
        </div>
      </div>

      {/* Slide indicator + hospital label */}
      <div className="absolute bottom-6 left-0 right-0 z-10 mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8">
        <div className="text-sm text-slate-300">
          <span className="font-semibold text-white">{SLIDES[i].name}</span>
          <span className="mx-2 text-slate-500">·</span>
          {SLIDES[i].city}
        </div>
        <div className="flex gap-2">
          {SLIDES.map((s, idx) => (
            <button
              key={s.name}
              onClick={() => setI(idx)}
              aria-label={`Go to ${s.name}`}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: idx === i ? 32 : 12,
                background: idx === i ? "#fff" : "rgba(255,255,255,.4)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Demo modal */}
      {demo && (
        <div
          className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/85 p-4"
          onClick={() => setDemo(false)}
        >
          <div className="w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-2 flex justify-end">
              <button onClick={() => setDemo(false)} className="rounded-full bg-white/10 px-3 py-1 text-sm text-white hover:bg-white/20">
                Close ✕
              </button>
            </div>
            <video src="/demo.mp4" controls autoPlay className="w-full rounded-xl shadow-2xl" />
          </div>
        </div>
      )}
    </section>
  );
}
