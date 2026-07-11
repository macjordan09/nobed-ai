export interface TrustItem {
  title: string;
  detail: string;
}

export function TrustSafetyCard({ item }: { item: TrustItem }) {
  return (
    <div className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4">
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
        <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
          <path d="M8.3 12.3L6 10l-1 1 3.3 3.3 6.7-6.7-1-1z" />
        </svg>
      </span>
      <div>
        <div className="text-sm font-semibold text-brand-ink">{item.title}</div>
        <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{item.detail}</p>
      </div>
    </div>
  );
}
