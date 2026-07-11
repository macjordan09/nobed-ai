import Link from "next/link";

// Always-visible emergency action on mobile: call 112, or find a bed.
// Hidden on md+ where the header CTA is already in reach.
export function StickyEmergencyBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-[1500] border-t border-slate-200 bg-white/95 px-3 pb-[env(safe-area-inset-bottom)] pt-2 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur md:hidden">
      <div className="flex items-center gap-2 pb-2">
        <a
          href="tel:112"
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-brand-red px-3 py-2.5 text-sm font-bold text-white"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
            <path d="M6.6 10.8a15 15 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11.4 11.4 0 003.6.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.4 11.4 0 00.57 3.6 1 1 0 01-.25 1L6.6 10.8z" />
          </svg>
          Call 112
        </a>
        <Link
          href="/find-beds"
          className="flex flex-1 items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-bold text-brand-ink"
        >
          Find a Bed
        </Link>
      </div>
    </div>
  );
}
