import Link from "next/link";
import type { Metadata } from "next";
import { HOSPITALS } from "@/lib/operational";
import { LiveMap } from "@/components/landing/LiveMap";
import { HeroLive } from "@/components/landing/HeroLive";
import { HospitalCapacityCard } from "@/components/landing/HospitalCapacityCard";
import { EmergencyTimeline } from "@/components/landing/EmergencyTimeline";
import { SMSMockup } from "@/components/landing/SMSMockup";
import { AudienceCard, type Audience } from "@/components/landing/AudienceCard";
import { TrustSafetyCard, type TrustItem } from "@/components/landing/TrustSafetyCard";
import { CTASection } from "@/components/landing/CTASection";
import { StickyEmergencyBar } from "@/components/landing/StickyEmergencyBar";

export const metadata: Metadata = {
  title: "NoBed.ai · Real-time hospital operational capacity for Ghana",
  description:
    "No one should die looking for a hospital bed. NoBed.ai shows which facilities across Ghana can actually receive emergency patients right now: beds, ICU, oxygen, staff, imaging and theatre. Web and SMS.",
};

const HOW = [
  { n: 1, title: "Hospitals update capacity", text: "Charge nurses and admins report beds, ICU, oxygen, staffing, imaging and theatre, from a dashboard or by SMS." },
  { n: 2, title: "The system verifies & calculates", text: "Functional capacity is computed, freshness is tracked, and each facility gets an honest status, never a false green." },
  { n: 3, title: "Families & ambulance teams search", text: "Search by location and the care actually needed, whether trauma, ICU or obstetrics, not just an empty mattress." },
  { n: 4, title: "Referrals are confirmed & tracked", text: "The receiving hospital confirms and holds a bed; the transfer is routed and tracked until the patient arrives." },
];

const AUDIENCES: Audience[] = [
  { icon: "family", title: "Families", benefit: "Know which hospital can actually take your patient before you leave the house, on any phone." },
  { icon: "ambulance", title: "Ambulance teams", benefit: "Route to a facility with real, functional capacity the first time, with no dead-end transfers." },
  { icon: "hospital", title: "Hospitals", benefit: "Broadcast true capacity, stop receiving referrals you can't take, and decongest the emergency ward." },
  { icon: "ministry", title: "Ministry of Health / GHS", benefit: "See national pressure live, and find where ICU and functional capacity is missing." },
  { icon: "region", title: "Regional health directors", benefit: "Track facilities in your region, spot stale reporting, and coordinate referrals across districts." },
];

const TRUST: TrustItem[] = [
  { title: "Demo data, clearly labelled", detail: "Capacity figures here are seeded demonstration data, never presented as live hospital status." },
  { title: "No full medical records", detail: "The platform stores operational capacity, not patient medical records." },
  { title: "Anonymised referrals", detail: "Referrals use anonymised patient references only, with no identifiable patient data." },
  { title: "Role-based access", detail: "Eight roles, ten permissions. Capacity edits are gated to verified facility staff." },
  { title: "Audit logs", detail: "Every capacity change, referral and login is recorded with actor and timestamp." },
  { title: "Ghana Data Protection Act", detail: "Designed to align with the Ghana Data Protection Act, 2012." },
  { title: "Verified & freshness states", detail: "Verified, self-reported and stale states make the trustworthiness of every number visible." },
  { title: "Always call 112 first", detail: "In a life-threatening emergency, call 112. NoBed.ai guides where to go. It is not dispatch." },
];

// Real screenshots of the live demo, not illustrations.
const MODULES = [
  { title: "Live Capacity Dashboard", text: "Operational status for every facility: beds, ICU, oxygen, staff, imaging, theatre.", href: "/capacity", img: "/showcase/capacity.png" },
  { title: "Ghana Hospital Map", text: "Colour-coded pins by real, functional capacity across all regions.", href: "/map", img: "/showcase/map.png" },
  { title: "SMS Short Code Access", text: "Text a short code for the nearest facilities. Works with no internet.", href: "/sms", img: "/showcase/sms.png" },
  { title: "Referral Guidance & Tracking", text: "Resource breakdown, service-specific acceptance, and referral guidance per facility.", href: "/capacity/korle-bu", img: "/showcase/capacity-detail.png" },
];

export default function HomePage() {
  return (
    <div className="-mb-6 pb-16 md:pb-0">
      {/* ───────────── 1 · HERO (human first, live map second) ───────────── */}
      <HeroLive />

      {/* ───────────── 2 · CRISIS ───────────── */}
      <Section>
        <SectionHead
          eyebrow="The crisis"
          eyebrowTone="red"
          title="The beds may exist. The visibility does not."
          sub="No Bed Syndrome is rarely a pure shortage. It is a coordination failure. No one can see, in the moment, which hospital can actually take the patient."
        />
        <div className="mt-8">
          <EmergencyTimeline />
        </div>
      </Section>

      {/* ───────────── 3 · HOW IT WORKS ───────────── */}
      <Section id="how-it-works" tint>
        <SectionHead eyebrow="How it works" title="From capacity report to confirmed bed." />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HOW.map((s) => (
            <div key={s.n} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-green/10 text-sm font-black text-brand-green">
                {s.n}
              </div>
              <h3 className="mt-3 text-sm font-bold text-brand-ink">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-snug text-slate-600">{s.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ───────────── 4 · PRODUCT (real screenshots) ───────────── */}
      <Section>
        <SectionHead
          eyebrow="See it working"
          title="This is the actual product."
          sub="Real screens from the live demo: the operational dashboard, the Ghana map, SMS access, and per-facility referral guidance."
        />
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {MODULES.map((m) => (
            <Link key={m.title} href={m.href} className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
              <div className="aspect-[16/10] overflow-hidden border-b border-slate-100 bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.img}
                  alt={`${m.title}: screenshot of the live NoBed.ai demo`}
                  loading="lazy"
                  className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.02]"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-brand-ink">{m.title}</h3>
                  <span className="text-brand-green transition group-hover:translate-x-0.5">→</span>
                </div>
                <p className="mt-1 text-sm leading-snug text-slate-600">{m.text}</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* ───────────── 5 · WHO IT SERVES ───────────── */}
      <Section id="for-hospitals" tint>
        <SectionHead eyebrow="Who it serves" title="One live picture, five frontlines." />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {AUDIENCES.map((a) => (
            <AudienceCard key={a.title} a={a} />
          ))}
        </div>
      </Section>

      {/* ───────────── 6 · SMS ACCESS ───────────── */}
      <Section id="sms">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <SectionHead eyebrow="No internet needed" title="Works even without a smartphone." align="left" />
            <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-600">
              The people closest to an emergency often have the least connectivity. Text a short
              code and get the nearest facilities that can actually receive the patient, on any
              phone, on any network.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-slate-700">
              {["Nearest facilities ranked by real capacity", "Bed type and service-specific guidance", "Updates accepted only from registered facility numbers"].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <span className="mt-0.5 text-brand-green">✓</span>{t}
                </li>
              ))}
            </ul>
            <Link href="/sms" className="mt-6 inline-flex rounded-xl bg-brand-ink px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800">
              Try the SMS simulator
            </Link>
          </div>
          <SMSMockup />
        </div>
      </Section>

      {/* ───────────── 7 · TRUST & SAFETY ───────────── */}
      <Section tint>
        <SectionHead eyebrow="Trust & safety" title="Built to be trusted with the worst nights." sub="A capacity map is only useful if people can believe it. So we are explicit about data, privacy and limits." />
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST.map((t) => (
            <TrustSafetyCard key={t.title} item={t} />
          ))}
        </div>
      </Section>

      {/* ───────────── 8 · PILOT NETWORK ───────────── */}
      <Section id="partners">
        <SectionHead eyebrow="Pilot network" title="Sample facilities across Ghana." sub="Demonstration examples, not official live partners unless verified." />
        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-2xl border border-slate-200 bg-slate-900 p-3">
            <div className="h-[320px] overflow-hidden rounded-lg">
              <LiveMap theme="dark" interactive className="h-full w-full" />
            </div>
            <p className="mt-1.5 text-[10px] text-slate-500">
              © OpenStreetMap contributors · © CARTO · drag & zoom · pins are demo data
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {HOSPITALS.map((h) => (
              <HospitalCapacityCard key={h.id} h={h} href={`/capacity/${h.id}`} />
            ))}
          </div>
        </div>
        <p className="mt-4 text-xs text-slate-400">
          Korle Bu · Komfo Anokye · Greater Accra Regional (Ridge) · Tamale · Cape Coast,
          shown with seeded demo data to illustrate the platform.
        </p>
      </Section>

      {/* ───────────── 9 · FINAL CTA ───────────── */}
      <CTASection />

      {/* Mobile sticky emergency bar */}
      <StickyEmergencyBar />
    </div>
  );
}

/* ── Local section helpers ─────────────────────────────────────────────── */
function Section({ children, id, tint }: { children: React.ReactNode; id?: string; tint?: boolean }) {
  if (tint) {
    return (
      <section id={id} className="full-bleed bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">{children}</div>
      </section>
    );
  }
  return (
    <section id={id} className="mx-auto max-w-7xl py-14 sm:py-16">
      {children}
    </section>
  );
}

function SectionHead({
  eyebrow,
  title,
  sub,
  align = "center",
  eyebrowTone = "green",
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  align?: "center" | "left";
  eyebrowTone?: "green" | "red";
}) {
  const center = align === "center";
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <span className={`text-xs font-bold uppercase tracking-[0.16em] ${eyebrowTone === "red" ? "text-brand-red" : "text-brand-green"}`}>
        {eyebrow}
      </span>
      <h2 className="mt-2 text-2xl font-black tracking-tight text-brand-ink sm:text-3xl">{title}</h2>
      {sub && <p className="mt-3 text-base leading-relaxed text-slate-600">{sub}</p>}
    </div>
  );
}
