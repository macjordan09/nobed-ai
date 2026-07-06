import Link from "next/link";
import { getHospitalViews, type HospitalView } from "@/lib/hospitals";
import { HeroSlider } from "@/components/HeroSlider";
import { CrisisSection } from "@/components/CrisisSection";
import { ProductShowcase } from "@/components/ProductShowcase";
import { CountUp } from "@/components/CountUp";
import { MedicalBackdrop } from "@/components/MedicalBackdrop";
import { StatusBadge } from "@/components/StatusBadge";
import { VerificationBadge } from "@/components/VerificationBadge";

export const dynamic = "force-dynamic";

// Real, CC-licensed hospital photos from Wikimedia Commons (see credits below).
// Cape Coast keeps the illustrated banner — no free photo is available.
const FEATURED = [
  { img: "/hospitals/photos/korle-bu.jpg", match: ["Korle Bu"] },
  { img: "/hospitals/photos/kath.jpg", match: ["Komfo Anokye"] },
  { img: "/hospitals/photos/ugmc.jpg", match: ["University of Ghana"] },
  { img: "/hospitals/photos/ridge.jpg", match: ["Ridge", "Greater Accra Regional"] },
  { img: "/hospitals/photos/cape-coast.jpg", match: ["Cape Coast"] },
  { img: "/hospitals/photos/tamale.jpg", match: ["Tamale"] },
];

const PHOTO_CREDITS = [
  { label: "Korle Bu — Fquasie, CC BY-SA 4.0", href: "https://commons.wikimedia.org/wiki/File:Korle-Bu_hospital.jpg" },
  { label: "Komfo Anokye — OER Africa, CC BY 2.0", href: "https://commons.wikimedia.org/wiki/File:Komfo_Anokye_Teaching_Hospital,_Kumasi,_Ghana.jpg" },
  { label: "UGMC — Jwale2, CC BY-SA 4.0", href: "https://commons.wikimedia.org/wiki/File:University_of_Ghana_Medical_Centre_07.jpg" },
  { label: "Greater Accra Regional — Amuzujoe, CC BY-SA 4.0", href: "https://commons.wikimedia.org/wiki/File:Ridge_Hospital_Accra.jpg" },
  { label: "Tamale — Masssly, CC BY-SA 4.0", href: "https://commons.wikimedia.org/wiki/File:Tamale_Teaching_Hospital_4.jpg" },
  { label: "Cape Coast — via Modern Ghana", href: "https://www.modernghana.com/news/950703/cape-coast-teaching-hospital-gets-40000-medical.html" },
];

export default async function HomePage() {
  const hospitals = await getHospitalViews();
  const regions = new Set(hospitals.map((h) => h.region)).size;
  const emergencyBeds = hospitals.reduce((s, h) => s + h.emergencyAvailable, 0);

  const featured = FEATURED.map((f) => ({
    img: f.img,
    h: hospitals.find((h) => f.match.some((m) => h.name.includes(m))),
  })).filter((f): f is { img: string; h: HospitalView } => Boolean(f.h));

  return (
    <div className="-mb-6">
      {/* ───────────────── 1 · HERO ───────────────── */}
      <HeroSlider />

      {/* ───────────────── 2 · THE CRISIS ───────────────── */}
      <CrisisSection />

      {/* ───────────────── 3 · WHAT IS NO BED SYNDROME ───────────────── */}
      <Band>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow tone="amber">What is No Bed Syndrome?</Eyebrow>
            <H2>The beds exist. The visibility doesn&apos;t.</H2>
            <div className="mt-4 space-y-4 text-lg leading-relaxed text-slate-600">
              <p>
                No Bed Syndrome is what happens when a critically ill patient is turned away from
                hospital after hospital because no one knows, in the moment, which facility actually
                has space.
              </p>
              <p>
                Capacity changes by the minute. It lives in people&apos;s heads and paper logbooks —
                never in a shared, real-time picture for the ambulance crew, the referring nurse, or
                the family in the back seat.
              </p>
            </div>
          </div>

          {/* scenario card */}
          <div className="relative overflow-hidden rounded-3xl bg-brand-ink p-7 text-white shadow-xl">
            <MedicalBackdrop id="scenario" className="text-white opacity-[0.08]" />
            <div className="relative">
              <div className="text-sm font-semibold uppercase tracking-widest text-slate-400">
                A night that repeats
              </div>
              <ol className="mt-5 space-y-4">
                {[
                  ["11:30 PM", "Emergency at home. The family calls around — every line is busy."],
                  ["12:00 AM", "First hospital: “No bed.” Back in the car."],
                  ["1:00 AM", "Third hospital turns them away. The clock keeps running."],
                  ["—", "A bed was free 15 minutes away. Nobody knew."],
                ].map(([time, text]) => (
                  <li key={time} className="flex gap-4">
                    <span className="w-16 shrink-0 text-sm font-bold text-brand-amber">{time}</span>
                    <span className="text-sm text-slate-200">{text}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </Band>

      {/* ───────────────── 4 · HOW NOBED.AI WORKS ───────────────── */}
      <Section>
        <div className="text-center">
          <Eyebrow tone="green">How noBed.ai works</Eyebrow>
          <H2 center>Make the invisible visible — in real time.</H2>
          <Lead center>
            The same live picture for everyone in the chain. Explore the platform:
          </Lead>
        </div>
        <div className="mt-10">
          <ProductShowcase hospitals={hospitals} />
        </div>
      </Section>

      {/* ───────────────── 4b · FEATURED HOSPITALS (image cards) ───────────────── */}
      <Band>
        <div className="text-center">
          <Eyebrow tone="green">On the platform</Eyebrow>
          <H2 center>Hospitals already on noBed.ai.</H2>
          <Lead center>
            Live capacity from major facilities across Ghana — updated and verified in real time.
          </Lead>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((f) => (
            <FeaturedCard key={f.h.id} img={f.img} h={f.h} />
          ))}
        </div>
        <p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-relaxed text-slate-400">
          Hospital photos —{" "}
          {PHOTO_CREDITS.map((c, i) => (
            <span key={c.href}>
              <a href={c.href} target="_blank" rel="noreferrer" className="underline hover:text-slate-600">
                {c.label}
              </a>
              {i < PHOTO_CREDITS.length - 1 ? "; " : "."}
            </span>
          ))}
        </p>
      </Band>

      {/* ───────────────── 5 · WHO BENEFITS ───────────────── */}
      <Section>
        <div className="text-center">
          <Eyebrow tone="green">Who benefits</Eyebrow>
          <H2 center>Built for everyone in the emergency.</H2>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Benefit icon={<IconFamily />} title="Families" body="Find the nearest hospital with a free emergency bed — on the web or by SMS." />
          <Benefit icon={<IconAmbulance />} title="Ambulance teams" body="See live capacity and refer to a hospital that can actually receive the patient." />
          <Benefit icon={<IconHospital />} title="Hospitals" body="Update and verify capacity in seconds. Receive referrals you can act on." />
          <Benefit icon={<IconGov />} title="Ministry of Health" body="Monitor regional pressure, ICU coverage and referral delays nationwide." />
        </div>
      </Section>

      {/* ───────────────── 6 · TRUST & PARTNERSHIPS ───────────────── */}
      <section className="full-bleed border-y border-slate-200 bg-white py-12">
        <p className="mb-8 text-center text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
          Built for Ghana&apos;s health system
        </p>
        <div className="relative overflow-hidden">
          <div className="marquee-track gap-4">
            {[...PARTNERS, ...PARTNERS].map((p, i) => (
              <span
                key={i}
                className="whitespace-nowrap rounded-xl border border-slate-200 bg-brand-mist px-6 py-3 text-sm font-bold text-slate-500"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-slate-400">
          Stakeholders shown represent the intended pilot network. noBed.ai is an independent MVP.
        </p>
      </section>

      {/* ───────────────── 7 · IMPACT METRICS ───────────────── */}
      <section className="full-bleed relative overflow-hidden bg-brand-green py-20 text-white">
        <MedicalBackdrop id="impact" className="text-white opacity-[0.08]" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <div className="text-center">
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-green-200">The impact</div>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              From hours of guessing to one live map.
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 lg:grid-cols-4">
            <Metric value={<CountUp value={hospitals.length} />} label="Hospitals live" />
            <Metric value={<CountUp value={regions} />} label="Regions covered" />
            <Metric value={<CountUp value={emergencyBeds} />} label="Emergency beds visible now" />
            <Metric value="24/7" label="Real-time · works on any phone via SMS" />
          </div>
          <p className="mt-10 text-center text-sm text-green-100/80">
            Live coverage from the platform — outcome metrics (referral time saved, transfers
            avoided) are captured as hospitals come online.
          </p>
        </div>
      </section>

      {/* ───────────────── 8 · FINAL CTA ───────────────── */}
      <section className="full-bleed relative overflow-hidden bg-brand-ink py-24 text-center text-white">
        <MedicalBackdrop id="final" className="text-brand-red opacity-[0.14]" />
        <div className="relative mx-auto max-w-3xl px-5">
          <h2 className="text-4xl font-black tracking-tight sm:text-6xl">Every minute matters.</h2>
          <p className="mt-4 text-xl font-semibold text-slate-200 sm:text-2xl">
            Help Ghana end No Bed Syndrome.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/find-beds" className="rounded-xl bg-brand-red px-8 py-4 text-lg font-bold shadow-lg shadow-brand-red/30 transition hover:bg-red-700">
              Find a Bed Now
            </Link>
            <Link href="/about" className="rounded-xl border border-white/40 px-8 py-4 text-lg font-bold transition hover:bg-white/10">
              Join the mission
            </Link>
          </div>
          <p className="mt-8 text-sm text-slate-400">
            In a real emergency, call <span className="font-bold text-brand-red">112</span>.
          </p>
        </div>
      </section>
    </div>
  );
}

const PARTNERS = [
  "Ministry of Health",
  "Ghana Health Service",
  "National Ambulance Service",
  "Korle Bu Teaching Hospital",
  "Komfo Anokye Teaching Hospital",
  "University of Ghana Medical Centre",
  "Regional Health Directorates",
];

/* ───────────────── layout helpers ───────────────── */

function Section({ children }: { children: React.ReactNode }) {
  return <section className="py-20 sm:py-24">{children}</section>;
}

function Band({ children }: { children: React.ReactNode }) {
  return (
    <section className="full-bleed bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">{children}</div>
    </section>
  );
}

function Eyebrow({ children, tone }: { children: React.ReactNode; tone: "green" | "red" | "amber" }) {
  const c = { green: "text-brand-green", red: "text-brand-red", amber: "text-brand-amber" }[tone];
  return <div className={`text-sm font-bold uppercase tracking-[0.2em] ${c}`}>{children}</div>;
}

function H2({ children, center }: { children: React.ReactNode; center?: boolean }) {
  return (
    <h2 className={`mt-3 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl ${center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}`}>
      {children}
    </h2>
  );
}

function Lead({ children, center }: { children: React.ReactNode; center?: boolean }) {
  return (
    <p className={`mt-4 text-lg leading-relaxed text-slate-600 ${center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}`}>
      {children}
    </p>
  );
}

function Metric({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div className="text-center">
      <div className="text-5xl font-black tracking-tight">{value}</div>
      <div className="mt-2 text-sm text-green-100">{label}</div>
    </div>
  );
}

function FeaturedCard({ img, h }: { img: string; h: HospitalView }) {
  return (
    <Link href="/map" className="lift group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="relative h-44">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt={h.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
        <div className="absolute right-3 top-3">
          <StatusBadge status={h.status} showLabel={false} />
        </div>
        <div className="absolute bottom-3 left-4 right-4 text-white">
          <div className="text-base font-bold leading-tight">{h.name}</div>
          <div className="text-xs text-white/80">
            {h.district}, {h.region}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between px-4 py-3 text-sm">
        <span className="text-slate-600">
          Emergency <b className="text-slate-900">{h.emergencyAvailable}</b> · ICU{" "}
          <b className="text-slate-900">{h.icuAvailable}</b>
        </span>
        <VerificationBadge state={h.verification} />
      </div>
    </Link>
  );
}

function Benefit({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="lift rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-brand-green">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-bold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{body}</p>
    </div>
  );
}

/* ───────────────── icons ───────────────── */
const ip = { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
function IconFamily() { return (<svg {...ip}><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M16 6a3 3 0 0 1 0 6" /><path d="M21 20a5 5 0 0 0-4-5" /></svg>); }
function IconAmbulance() { return (<svg {...ip}><path d="M3 7h11v8H3z" /><path d="M14 10h4l3 3v2h-7z" /><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" /><path d="M7.5 9v3M6 10.5h3" /></svg>); }
function IconHospital() { return (<svg {...ip}><path d="M4 21V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v16" /><path d="M2 21h20M12 7v6M9 10h6" /></svg>); }
function IconGov() { return (<svg {...ip}><path d="M3 21h18M5 21V10M19 21V10M3 10l9-6 9 6M9 21v-6h6v6" /></svg>); }
