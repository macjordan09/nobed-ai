import Link from "next/link";

const GITHUB = "https://github.com/macjordan09/nobed-ai";
const MAILTO = "mailto:info.nobedai@gmail.com";

export function CTASection() {
  return (
    <section className="full-bleed relative overflow-hidden bg-brand-ink text-white">
      {/* faint heartbeat motif */}
      <svg className="pointer-events-none absolute inset-x-0 top-1/2 h-32 w-full -translate-y-1/2 text-white/[0.06]" viewBox="0 0 1200 120" preserveAspectRatio="none" fill="none" aria-hidden>
        <path d="M0 60 H180 l16 -44 l16 84 l16 -66 l12 26 H560 l16 -44 l16 84 l16 -66 l12 26 H1200" stroke="currentColor" strokeWidth="2.5" />
      </svg>
      <div className="relative mx-auto max-w-4xl px-5 py-16 text-center sm:px-8 sm:py-20">
        <h2 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl">
          Help Ghana end No Bed Syndrome.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-base text-slate-300">
          The visibility layer is built. What it needs now is hospitals, partners, and hands to
          take it live.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/find-beds" className="rounded-xl bg-brand-red px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand-red/30 transition hover:bg-red-700">
            Find a Bed
          </Link>
          <Link href={`${MAILTO}?subject=Join the NoBed.ai pilot`} className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-brand-ink transition hover:bg-slate-100">
            Join the Pilot
          </Link>
          <Link href={`${MAILTO}?subject=Partner with NoBed.ai`} className="rounded-xl border border-white/30 bg-white/5 px-6 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/15">
            Partner With Us
          </Link>
          <Link href={GITHUB} className="rounded-xl border border-white/30 bg-white/5 px-6 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/15">
            Contribute Code
          </Link>
        </div>
        <p className="mt-8 text-xs text-slate-400">
          In a life-threatening emergency, call <span className="font-bold text-white">112</span> first.
          noBed.ai helps you choose where to go. It does not replace emergency dispatch.
        </p>
      </div>
    </section>
  );
}
