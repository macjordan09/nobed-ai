// The No Bed Syndrome story as a looping motion graphic: one night, one patient,
// an ambulance turned away from hospital after hospital while the clock runs.
// Pure CSS animation (server-renderable, no JS). Users with prefers-reduced-motion
// see the final frame as a still. Palette matches the MVP (slate night / brand red).

const STOPS = [
  { left: "8%", badge: "✕ No ICU bed", b: "nbj-b1" },
  { left: "42%", badge: "✕ Theatre full", b: "nbj-b2" },
  { left: "76%", badge: "✕ Oxygen low", b: "nbj-b3" },
];

export function NightJourney({ className = "" }: { className?: string }) {
  return (
    <div
      className={`nbj relative h-64 overflow-hidden rounded-2xl text-white shadow-xl sm:h-72 ${className}`}
      role="img"
      aria-label="Animation: through one night, an ambulance is turned away from three hospitals in a row (no ICU bed, theatre full, oxygen low) and at 1:55 AM it is still searching."
    >
      <style>{`
        .nbj{background:radial-gradient(55% 45% at 80% 12%, rgba(148,163,184,.16), transparent 60%),linear-gradient(180deg,#0b1220 0%,#0f172a 64%,#0b1220 100%);}
        .nbj-anim{animation-duration:14s;animation-iteration-count:infinite;animation-fill-mode:both;animation-timing-function:linear;}
        .nbj-amb{animation-name:nbj-drive;animation-timing-function:ease-in-out;}
        @keyframes nbj-drive{0%,13%{left:5%}27%,41%{left:39%}55%,71%{left:73%}86%,100%{left:84%}}
        .nbj-b1{animation-name:nbj-b1}
        @keyframes nbj-b1{0%,5%{opacity:0;transform:translate(-50%,5px)}9%,98%{opacity:1;transform:translate(-50%,0)}100%{opacity:0}}
        .nbj-b2{animation-name:nbj-b2}
        @keyframes nbj-b2{0%,31%{opacity:0;transform:translate(-50%,5px)}35%,98%{opacity:1;transform:translate(-50%,0)}100%{opacity:0}}
        .nbj-b3{animation-name:nbj-b3}
        @keyframes nbj-b3{0%,59%{opacity:0;transform:translate(-50%,5px)}63%,98%{opacity:1;transform:translate(-50%,0)}100%{opacity:0}}
        .nbj-search{animation-name:nbj-search}
        @keyframes nbj-search{0%,80%{opacity:0}86%,99%{opacity:1}100%{opacity:0}}
        .nbj-t1{animation-name:nbj-t1}
        @keyframes nbj-t1{0%,23%{opacity:1}26%,100%{opacity:0}}
        .nbj-t2{animation-name:nbj-t2}
        @keyframes nbj-t2{0%,24%{opacity:0}27%,48%{opacity:1}51%,100%{opacity:0}}
        .nbj-t3{animation-name:nbj-t3}
        @keyframes nbj-t3{0%,49%{opacity:0}52%,73%{opacity:1}76%,100%{opacity:0}}
        .nbj-t4{animation-name:nbj-t4}
        @keyframes nbj-t4{0%,74%{opacity:0}77%,100%{opacity:1}}
        .nbj-beacon{animation:nbj-beacon 1.1s infinite}
        @keyframes nbj-beacon{0%,100%{opacity:.25}50%{opacity:1}}
        @media (prefers-reduced-motion: reduce){
          .nbj-anim,.nbj-beacon{animation:none!important}
        }
      `}</style>

      {/* moon + stars */}
      <div className="absolute right-[14%] top-[12%] h-6 w-6 rounded-full bg-slate-200/70 shadow-[0_0_24px_6px_rgba(226,232,240,0.25)]" />
      {["12% 22%", "30% 10%", "52% 18%", "68% 8%", "88% 30%"].map((pos) => {
        const [l, t] = pos.split(" ");
        return <span key={pos} className="absolute h-0.5 w-0.5 rounded-full bg-slate-400/50" style={{ left: l, top: t }} />;
      })}

      {/* clock (top-left): the night advancing */}
      <div className="absolute left-4 top-3 font-mono text-sm font-bold text-slate-200">
        <span className="nbj-anim nbj-t1 absolute left-0 top-0 opacity-0 whitespace-nowrap">11:40 PM</span>
        <span className="nbj-anim nbj-t2 absolute left-0 top-0 opacity-0 whitespace-nowrap">12:25 AM</span>
        <span className="nbj-anim nbj-t3 absolute left-0 top-0 opacity-0 whitespace-nowrap">1:10 AM</span>
        <span className="nbj-anim nbj-t4 absolute left-0 top-0 whitespace-nowrap text-red-300">1:55 AM</span>
      </div>

      {/* hospitals on the road */}
      {STOPS.map((s) => (
        <div key={s.left} className="absolute bottom-[30%]" style={{ left: s.left }}>
          {/* refusal badge */}
          <span
            className={`nbj-anim ${s.b} absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-red-600/95 px-2 py-0.5 text-[10px] font-bold shadow-lg sm:text-[11px]`}
          >
            {s.badge}
          </span>
          {/* building */}
          <div className="relative h-14 w-14 rounded-t-md border border-slate-600/60 bg-slate-800/95 sm:h-16 sm:w-16">
            <span className="absolute -top-2 left-1/2 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-sm bg-slate-700 text-[9px] font-black text-red-400">+</span>
            <div className="grid grid-cols-3 gap-1 p-1.5 pt-2.5">
              {Array.from({ length: 6 }).map((_, w) => (
                <span key={w} className="h-1.5 rounded-[1px] bg-amber-100/25" />
              ))}
            </div>
            <span className="absolute bottom-0 left-1/2 h-3 w-2.5 -translate-x-1/2 rounded-t-sm bg-slate-950" />
          </div>
        </div>
      ))}

      {/* road */}
      <div className="absolute inset-x-0 bottom-[30%] h-px bg-slate-500/50" />
      <div
        className="absolute inset-x-0 bottom-[27%] h-px opacity-40"
        style={{ backgroundImage: "linear-gradient(90deg, #94a3b8 0 12px, transparent 12px 26px)", backgroundSize: "26px 1px" }}
      />

      {/* ambulance */}
      <div className="nbj-anim nbj-amb absolute bottom-[30.5%]" style={{ left: "84%" }}>
        <span className="nbj-search absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-semibold italic text-red-200 nbj-anim">
          Still searching…
        </span>
        <div className="relative h-5 w-11 rounded-[3px] bg-slate-100 shadow-md">
          <span className="nbj-beacon absolute -top-1 left-1.5 h-1 w-2 rounded-sm bg-red-500 shadow-[0_0_8px_2px_rgba(239,68,68,0.6)]" />
          <span className="absolute inset-y-1 left-1 w-3 rounded-[2px] bg-slate-800/85" />
          <span className="absolute right-1 top-1 text-[7px] font-black leading-none text-brand-red">+</span>
          <span className="absolute inset-x-0 bottom-1 h-0.5 bg-brand-red/80" />
          <span className="absolute -bottom-1 left-1.5 h-2 w-2 rounded-full bg-slate-900 ring-1 ring-slate-500" />
          <span className="absolute -bottom-1 right-1.5 h-2 w-2 rounded-full bg-slate-900 ring-1 ring-slate-500" />
        </div>
      </div>

      {/* caption */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent p-5 pt-8">
        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
          The journey no family should make
        </div>
        <div className="mt-1 text-lg font-bold leading-snug">
          Hospital → hospital → hospital, while the clock runs out.
        </div>
      </div>
    </div>
  );
}
