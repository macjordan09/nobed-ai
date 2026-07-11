"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LiveMap } from "./LiveMap";

// Human first, operational second. The emotional anchor is authentic photography;
// the live incident map is the proof that this is a working operational platform,
// not a concept. Treatment is restrained, a dark gradient for legibility, no neon.
//
// Two authentic ward photographs lead the crossfade. Empty beds are the literal
// face of "No Bed", followed by real teaching-hospital exteriors. The ward files
// live in public/wards/; any image not present yet is skipped gracefully.
const PHOTOS = [
  { src: "/wards/ward-beds.jpg", label: "" },
  { src: "/wards/ward-modern.jpg", label: "" },
  { src: "/hospitals/photos/korle-bu.jpg", label: "Korle Bu Teaching Hospital · Accra" },
  { src: "/hospitals/photos/tamale.jpg", label: "Tamale Teaching Hospital · Northern Region" },
];

// Which sources are guaranteed to exist in the repo (vs. optional user-provided).
const isBundled = (src: string) => src.startsWith("/hospitals/");
const firstBundled = PHOTOS.findIndex((p) => isBundled(p.src));

export function HeroLive() {
  const sectionRef = useRef<HTMLElement>(null);
  const [demo, setDemo] = useState(false);
  // Seed the bundled photos as loaded so the hero is never blank on first paint;
  // optional ward images are confirmed from the DOM on mount (below).
  const [loaded, setLoaded] = useState<boolean[]>(() => PHOTOS.map((p) => isBundled(p.src)));
  const [i, setI] = useState(firstBundled < 0 ? 0 : firstBundled);

  const active = PHOTOS.map((_, idx) => idx).filter((idx) => loaded[idx]);
  const activeKey = active.join(",");

  // Static pages finish loading <img>s before React hydrates, so onLoad may never
  // fire. Read the real state from the DOM once mounted.
  useEffect(() => {
    const imgs = sectionRef.current?.querySelectorAll<HTMLImageElement>("img[data-hero-bg]");
    if (!imgs) return;
    const next = PHOTOS.map(() => false);
    imgs.forEach((el, idx) => {
      if (el.complete && el.naturalWidth > 0) next[idx] = true;
    });
    setLoaded(next);
    const first = next.findIndex(Boolean);
    if (first >= 0) setI(first);
  }, []);

  // Rotate only through images that actually loaded.
  useEffect(() => {
    if (active.length <= 1) return;
    const t = setInterval(() => {
      setI((prev) => {
        const pos = active.indexOf(prev);
        return active[(pos + 1) % active.length];
      });
    }, 5500);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeKey]);

  // Keep the visible index on a loaded image.
  useEffect(() => {
    if (active.length && !loaded[i]) setI(active[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeKey]);

  const mark = (idx: number) =>
    setLoaded((l) => (l[idx] ? l : l.map((v, k) => (k === idx ? true : v))));

  return (
    <section ref={sectionRef} className="full-bleed relative -mt-6 overflow-hidden bg-slate-950 text-white">
      {/* Authentic photography, crossfading, softly zoomed */}
      {PHOTOS.map((p, idx) => (
        <img
          // eslint-disable-next-line @next/next/no-img-element
          key={p.src}
          data-hero-bg
          src={p.src}
          alt=""
          aria-hidden
          onLoad={() => mark(idx)}
          onError={(e) => { e.currentTarget.style.display = "none"; }}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ${idx === i && loaded[idx] ? "kenburns opacity-100" : "opacity-0"}`}
        />
      ))}
      {/* Legibility gradients, sober, not dramatic */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-slate-950/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/60" />

      <div className="relative mx-auto grid min-h-[600px] max-w-7xl items-center gap-10 px-5 py-14 sm:px-8 lg:min-h-[86vh] lg:grid-cols-[1.1fr_0.9fr] lg:py-16">
        {/* Left: the human story */}
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] backdrop-blur">
            <span className="live-dot text-brand-amber" /> Real-time hospital capacity · Ghana
          </span>
          <h1 className="mt-5 text-4xl font-black leading-[1.03] tracking-tight sm:text-5xl xl:text-6xl">
            No one should die looking for a hospital bed.
          </h1>
          <p className="mt-5 text-base leading-relaxed text-slate-200 sm:text-lg">
            In an emergency, &ldquo;no bed&rdquo; is rarely about beds. It&apos;s oxygen, ICU, blood,
            a surgeon on call. NoBed.ai shows which hospitals across Ghana can{" "}
            <span className="font-semibold text-white">actually receive a patient right now</span>,
            and routes them there.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/find-beds" className="rounded-xl bg-brand-red px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-brand-red/30 transition hover:bg-red-700">
              Find Available Beds
            </Link>
            <Link href="/capacity" className="rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 text-base font-bold text-white backdrop-blur transition hover:bg-white/20">
              See Live Capacity
            </Link>
            <button onClick={() => setDemo(true)} className="inline-flex items-center gap-2 px-2 py-2 text-base font-semibold text-white/80 transition hover:text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/40">▶</span>
              Watch the story
            </button>
          </div>
          <p className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-red/20 px-3 py-1.5 text-sm font-semibold text-red-100 ring-1 ring-brand-red/40">
            <span aria-hidden>🚑</span> In a life-threatening emergency, call 112 first.
          </p>
        </div>

        {/* Right: live operational proof (real interactive map) */}
        <div className="w-full">
          <div className="rounded-2xl border border-white/15 bg-slate-950/70 p-2.5 shadow-2xl backdrop-blur">
            <div className="flex items-center justify-between px-1.5 pb-2">
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-white/90">
                <span className="live-dot text-emerald-400" /> Live capacity · Greater Accra
              </span>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/55">
                Demo data
              </span>
            </div>
            <div className="h-[280px] overflow-hidden rounded-xl sm:h-[330px]">
              <LiveMap theme="dark" showRoute className="h-full w-full" />
            </div>
            <div className="mt-2 flex items-start gap-2 rounded-lg bg-red-600/95 px-3 py-2 text-[12px] font-semibold text-white">
              <span aria-hidden className="mt-0.5">⚠</span>
              <span>Korle Bu: ICU full, CT offline. Routing trauma to nearest alternative.</span>
            </div>
            <p className="mt-1.5 px-1.5 text-[10px] text-white/40">© OpenStreetMap contributors · © CARTO</p>
          </div>
        </div>
      </div>

      {/* photo credit: names the real facility on screen */}
      <div className="pointer-events-none absolute bottom-3 left-0 right-0 z-10 mx-auto max-w-7xl px-5 sm:px-8">
        {PHOTOS[i]?.label && <span className="text-[11px] text-white/45">{PHOTOS[i].label}</span>}
      </div>

      {/* Watch-the-story modal */}
      {demo && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/85 p-4" onClick={() => setDemo(false)}>
          <div className="w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-2 flex justify-end">
              <button onClick={() => setDemo(false)} className="rounded-full bg-white/10 px-3 py-1 text-sm text-white hover:bg-white/20">
                Close ✕
              </button>
            </div>
            <video src="/story.mp4" controls autoPlay className="w-full rounded-xl shadow-2xl" />
          </div>
        </div>
      )}
    </section>
  );
}
