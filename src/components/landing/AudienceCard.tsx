export interface Audience {
  title: string;
  benefit: string;
  icon: "family" | "ambulance" | "hospital" | "ministry" | "region";
}

const ICONS: Record<Audience["icon"], React.ReactNode> = {
  family: (
    <path d="M12 12a3 3 0 100-6 3 3 0 000 6zm-7 8a7 7 0 0114 0" />
  ),
  ambulance: (
    <path d="M3 8h11v6H3zM14 10h4l3 3v1h-7zM7 18a2 2 0 11.001-4.001A2 2 0 017 18zm10 0a2 2 0 11.001-4.001A2 2 0 0117 18zM8 5v3M6.5 6.5h3" />
  ),
  hospital: (
    <path d="M4 21V7l8-4 8 4v14M9 21v-5h6v5M11 8h2M12 7v4" />
  ),
  ministry: (
    <path d="M3 21h18M5 21V9l7-5 7 5v12M9 21v-6h6v6M9 12h.01M15 12h.01" />
  ),
  region: (
    <path d="M12 21s-6-5.7-6-10a6 6 0 1112 0c0 4.3-6 10-6 10zm0-8a2 2 0 100-4 2 2 0 000 4z" />
  ),
};

export function AudienceCard({ a }: { a: Audience }) {
  return (
    <div className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-ink/5 text-brand-ink">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          {ICONS[a.icon]}
        </svg>
      </span>
      <div>
        <div className="text-sm font-bold text-brand-ink">{a.title}</div>
        <p className="mt-0.5 text-sm leading-snug text-slate-600">{a.benefit}</p>
      </div>
    </div>
  );
}
