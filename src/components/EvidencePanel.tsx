// Motion graphic for the About page research section: the published field study
// rises and settles, a light sweeps across it, an "independent research" stamp
// lands, the two university partners fade in, and a CTA links to the full PDF.
// Pure CSS animation, no JavaScript, and it holds still for reduced-motion users.

function Crest() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l7 2v6c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V5l7-2z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

export function EvidencePanel({ href, className = "" }: { href: string; className?: string }) {
  return (
    <div
      className={`ev relative flex min-h-[24rem] flex-col justify-between overflow-hidden rounded-2xl bg-brand-ink p-6 text-white shadow-xl ${className}`}
      role="img"
      aria-label="An animation of the Reach Alliance 2024 study, a peer-reviewed field study by the University of Toronto Munk School and Ashesi University, with a link to read the full report."
    >
      <style>{`
        .ev{background:radial-gradient(60% 45% at 85% 8%, rgba(15,122,69,.28), transparent 60%), linear-gradient(180deg,#0f172a,#0b1220);}
        .ev-anim{animation-fill-mode:both}
        .ev-paper{animation:ev-rise 1s cubic-bezier(.2,.7,.2,1) both}
        @keyframes ev-rise{0%{opacity:0;transform:translateY(34px) rotate(-5deg)}100%{opacity:1;transform:translateY(0) rotate(-2deg)}}
        .ev-sweep{animation:ev-sweep 4s ease-in-out 1s infinite}
        @keyframes ev-sweep{0%{transform:translateX(-120%)}45%,100%{transform:translateX(240%)}}
        .ev-stamp{animation:ev-stamp .5s cubic-bezier(.2,1.4,.4,1) 1.05s both}
        @keyframes ev-stamp{0%{opacity:0;transform:rotate(8deg) scale(1.7)}100%{opacity:1;transform:rotate(8deg) scale(1)}}
        .ev-p1{animation:ev-in .6s ease-out 1.25s both}
        .ev-p2{animation:ev-in .6s ease-out 1.45s both}
        .ev-cta{animation:ev-in .6s ease-out 1.65s both}
        @keyframes ev-in{0%{opacity:0;transform:translateY(8px)}100%{opacity:1;transform:translateY(0)}}
        @media (prefers-reduced-motion: reduce){
          .ev-paper,.ev-sweep,.ev-stamp,.ev-p1,.ev-p2,.ev-cta{animation:none!important;opacity:1!important;transform:none!important}
          .ev-paper{transform:rotate(-2deg)!important}
        }
      `}</style>

      <div className="relative z-10">
        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">Peer-reviewed field study</div>
        <div className="mt-1 text-lg font-bold leading-snug">The research that names the fix.</div>
      </div>

      {/* the paper */}
      <div className="relative my-4 flex flex-1 items-center justify-center">
        <div className="ev-paper relative h-44 w-36 rounded-md bg-white shadow-2xl ring-1 ring-black/10">
          <div className="flex h-7 items-center gap-1 rounded-t-md bg-brand-green px-2">
            <span className="h-1 w-1 rounded-full bg-white/70" />
            <span className="h-1 w-1 rounded-full bg-white/70" />
            <span className="ml-auto text-[7px] font-black tracking-wide text-white/90">2024</span>
          </div>
          <div className="p-3">
            <div className="h-1.5 w-4/5 rounded bg-slate-800" />
            <div className="mt-1 h-1.5 w-3/5 rounded bg-slate-800" />
            <div className="mt-3 space-y-1.5">
              <div className="h-1 w-full rounded bg-slate-300" />
              <div className="h-1 w-full rounded bg-slate-300" />
              <div className="h-1 w-11/12 rounded bg-slate-300" />
              <div className="h-1 w-full rounded bg-slate-300" />
              <div className="h-1 w-2/3 rounded bg-slate-300" />
            </div>
            <span className="absolute bottom-2 left-3 rounded bg-brand-red px-1.5 py-0.5 text-[7px] font-black text-white">PDF</span>
          </div>
          {/* light sweep */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-md">
            <div className="ev-sweep absolute -inset-y-4 left-0 w-10 rotate-12 bg-gradient-to-r from-transparent via-white/55 to-transparent" />
          </div>
        </div>

        {/* stamp */}
        <div className="ev-stamp absolute right-3 top-2 rounded-full border-2 border-emerald-400/80 px-2 py-1 text-[9px] font-black uppercase tracking-wide text-emerald-300">
          Independent
        </div>
      </div>

      {/* university partners */}
      <div className="relative z-10 space-y-2">
        <div className="ev-anim ev-p1 flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white/90">
          <span className="text-emerald-300"><Crest /></span>
          <span className="text-xs font-semibold leading-tight">University of Toronto<span className="font-normal text-white/55"> · Munk School (Reach Alliance)</span></span>
        </div>
        <div className="ev-anim ev-p2 flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white/90">
          <span className="text-emerald-300"><Crest /></span>
          <span className="text-xs font-semibold leading-tight">Ashesi University<span className="font-normal text-white/55"> · Berekuso, Ghana</span></span>
        </div>

        <p className="pt-1 text-[13px] leading-snug text-white/70">
          Independent academics named the gap. We built the layer that fills it.
        </p>

        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="ev-anim ev-cta mt-1 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-brand-ink transition hover:bg-slate-100"
        >
          Read the full study (PDF) →
        </a>
      </div>
    </div>
  );
}
