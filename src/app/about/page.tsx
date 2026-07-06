import Link from "next/link";
import { getHospitalViews } from "@/lib/hospitals";
import { MedicalBackdrop } from "@/components/MedicalBackdrop";
import { CaseTimeline } from "@/components/CaseTimeline";

export const dynamic = "force-dynamic";

const JOIN_MAILTO =
  "mailto:build@nobed.ai?subject=I%20want%20to%20help%20build%20NoBed.ai";

export default async function AboutPage() {
  const hospitals = await getHospitalViews();
  const regions = new Set(hospitals.map((h) => h.region)).size;

  return (
    <div className="space-y-20 pb-8">
      {/* ───────────────────────── Hero banner ───────────────────────── */}
      <section className="rise relative -mt-6 overflow-hidden rounded-b-[2rem] bg-gradient-to-br from-[#013a24] via-ghana-green to-[#02512f] text-white">
        <MedicalBackdrop id="about-hero" className="text-white opacity-[0.1]" />
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-ghana-gold/20 blur-3xl" />
        <div className="relative px-4 py-16 sm:px-8 lg:py-24">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white backdrop-blur">
              The problem we refuse to accept
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl xl:text-6xl">
              No one should die <br className="hidden sm:block" />
              <span className="text-ghana-gold">looking for a bed.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-green-50">
              Across Ghana, families have lost people they love — not because the medicine didn&apos;t
              exist, but because no one could tell them where a free bed was in time. We call it
              <strong className="text-white"> No Bed Syndrome</strong>. NoBed.ai exists to end it.
            </p>
          </div>
        </div>
      </section>

      {/* ───────────────────── What is No Bed Syndrome ───────────────────── */}
      <section className="grid items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-ghana-green">
            What is No Bed Syndrome?
          </div>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            A patient in crisis. A van going door to door.
          </h2>
          <div className="mt-4 space-y-4 text-slate-600">
            <p>
              No Bed Syndrome is what happens when a critically ill patient is turned away from one
              hospital after another — sometimes five, six, seven facilities in a single night —
              because no one knows, in the moment, which one actually has space.
            </p>
            <p>
              The beds often exist. The problem is <strong>visibility</strong>. Capacity changes by
              the minute, it lives in people&apos;s heads and paper logbooks, and there is no shared,
              real-time picture for the ambulance crew, the referring nurse, or the family in the
              back seat.
            </p>
            <p>
              In 2018, one widely reported death — a man turned away from seven Accra hospitals in a
              single ordeal — forced the term into national headlines and pushed Ghana toward
              emergency dispatch coordination (his story is below). The conversation started. For too
              many families, the everyday reality did not change enough.
            </p>
          </div>
        </div>

        {/* bold image panel */}
        <ImagePanel
          id="panel-problem"
          from="#0b3b2a"
          to="#02633c"
          eyebrow="The journey no family should make"
          caption="Hospital → hospital → hospital, while the clock runs out."
          icon={<IconRoute />}
        />
      </section>

      {/* ───────────────────────── The human cost ───────────────────────── */}
      <section className="px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-xs font-semibold uppercase tracking-widest text-ghana-red">
            The human cost
          </div>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Behind every statistic is a person.
          </h2>
          <p className="mt-3 text-slate-600">
            These accounts reflect patterns widely reported across Ghana&apos;s emergency care
            system. They are shared with respect, to keep the people behind the headlines at the
            centre of why we build.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <StoryCard
            tone="emergency"
            label="The night drive"
            quote="By the time the fourth hospital said no, we had been on the road for three hours. We never found out if a bed was open somewhere closer."
            who="A family in Greater Accra"
            icon={<IconAmbulance />}
          />
          <StoryCard
            tone="maternity"
            label="Labour without a place"
            quote="She was in labour and we were turned away twice. Every minute searching was a minute she didn&apos;t have."
            who="A relative recounting a maternity emergency"
            icon={<IconHeart />}
          />
          <StoryCard
            tone="icu"
            label="An ICU too far"
            quote="The one ICU bed in the region was already taken. No one could tell us that until we arrived."
            who="A referring health worker"
            icon={<IconPulse />}
          />
        </div>

        <p className="mx-auto mt-6 max-w-2xl text-center text-xs italic text-slate-400">
          The three accounts above are representative composites of documented No Bed Syndrome cases,
          not verbatim records of named individuals. NoBed.ai stores no identifiable patient data.
        </p>
      </section>

      {/* ───────────────────── By the numbers (sourced) ───────────────────── */}
      <section className="px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-xs font-semibold uppercase tracking-widest text-ghana-green">
            By the numbers
          </div>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            The shortage is real — and measured.
          </h2>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard big="1.3" unit="beds / 1,000" body="Africa's hospital-bed density — the world's lowest (global average is 2.7)." />
          <StatCard big="0.9" unit="beds / 1,000" body="Ghana's ratio in 2021 — far below the WHO minimum of 5." />
          <StatCard big="10 / 16" unit="regions" body="had no ICU beds at all — roughly 0.5 ICU beds per 100,000 people." />
          <StatCard big="5" unit="teaching hospitals" body="serve all 16 regions, so the hardest cases converge on a few tertiary sites." />
        </div>

        <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-relaxed text-slate-400">
          Sources: WHO Global Health Observatory (2019); Siaw-Frimpong, Touray &amp; Sefa,
          &ldquo;Capacity of Intensive Care Units in Ghana,&rdquo; <em>Journal of Critical Care</em> 61
          (2021); and Agbatsi et al.,{" "}
          <a
            href="https://reachalliance.org/wp-content/uploads/2024/03/No-bed-syndrome.pdf"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-slate-600"
          >
            &ldquo;The &lsquo;No Bed Syndrome&rsquo; in Ghanaian Tertiary Hospitals&rdquo; (Reach
            Alliance — University of Toronto &amp; Ashesi University, 2024)
          </a>
          .
        </p>
      </section>

      {/* ───────────────────── Reported cases timeline ───────────────────── */}
      <section className="px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-xs font-semibold uppercase tracking-widest text-ghana-red">
            Lives behind the headlines
          </div>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Reported, again and again.
          </h2>
          <p className="mt-3 text-slate-600">
            These are real, publicly reported deaths tied to No Bed Syndrome — years apart, the same
            story. We name them with respect, so the pattern is impossible to look away from.
          </p>
        </div>

        <div className="mt-12">
          <CaseTimeline />
        </div>

        <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-relaxed text-slate-400">
          Cases compiled from Ghanaian press reports (Citi Newsroom, Ghanaian Times and others) and the{" "}
          <a
            href="https://reachalliance.org/wp-content/uploads/2024/03/No-bed-syndrome.pdf"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-slate-600"
          >
            Reach Alliance (2024) study
          </a>
          . Shared to honour those affected; this list is not exhaustive.
        </p>
      </section>

      {/* ───────────────────── Quote / conviction band ───────────────────── */}
      <section className="px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-14 text-center text-white sm:px-12">
          <MedicalBackdrop id="quote-bg" className="text-ghana-green opacity-[0.18]" />
          <blockquote className="relative mx-auto max-w-3xl text-2xl font-semibold leading-snug sm:text-3xl">
            “Knowing where the bed is should not be a privilege. It should be a phone away — for the
            ambulance, the nurse, and the family.”
          </blockquote>
          <p className="relative mt-4 text-sm text-slate-300">Our founding conviction</p>
        </div>
      </section>

      {/* ───────────────────────── How we respond ───────────────────────── */}
      <section className="grid items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
        <ImagePanel
          id="panel-response"
          from="#02512f"
          to="#0a8a52"
          eyebrow="Our response"
          caption={`${hospitals.length} facilities · ${regions} regions, live on one map`}
          icon={<IconMap />}
          className="lg:order-1"
        />
        <div className="lg:order-2">
          <div className="text-xs font-semibold uppercase tracking-widest text-ghana-green">
            How NoBed.ai helps
          </div>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Make the invisible visible — in real time.
          </h2>
          <ul className="mt-5 space-y-4">
            <Point title="Live capacity, one map">
              Hospitals update beds in seconds; the status colour recalculates automatically so
              everyone sees the same truth.
            </Point>
            <Point title="Access for everyone — even by SMS">
              No smartphone? Text <code className="rounded bg-slate-100 px-1.5 py-0.5">BED ACCRA</code>{" "}
              and get the nearest facilities with free beds.
            </Point>
            <Point title="Referrals that actually land">
              Ambulance teams refer to a hospital that can receive the patient — and track it end to
              end.
            </Point>
          </ul>
          <Link
            href="/map"
            className="mt-6 inline-block rounded-xl bg-ghana-green px-5 py-2.5 font-semibold text-white transition hover:bg-green-800"
          >
            See the live map
          </Link>
        </div>
      </section>

      {/* ───────────────────── Volunteer / developer CTA ───────────────────── */}
      <section className="px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-xs font-semibold uppercase tracking-widest text-ghana-green">
            Build it with us
          </div>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            This is bigger than one team.
          </h2>
          <p className="mt-3 text-slate-600">
            NoBed.ai is an open, mission-driven effort. If you can write code, care for patients,
            organise communities, or open doors — there&apos;s a place for you here.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <RoleCard
            icon={<IconCode />}
            title="Developers & engineers"
            body="React/Next.js, mapping, SMS gateways, data pipelines, PostGIS. Help us scale from demo to national."
          />
          <RoleCard
            icon={<IconStethoscope />}
            title="Clinicians & health workers"
            body="Pressure-test the referral flow, define thresholds, and keep the product honest to real emergencies."
          />
          <RoleCard
            icon={<IconHands />}
            title="Volunteers & advocates"
            body="Onboard hospitals, run community SMS drives, translate to Twi, Ga, Ewe, Dagbani and more."
          />
          <RoleCard
            icon={<IconHandshake />}
            title="Partners & funders"
            body="GHS, the National Ambulance Service, telcos and donors who can take a pilot to scale."
          />
        </div>

        {/* big join banner */}
        <div className="relative mt-8 overflow-hidden rounded-3xl bg-gradient-to-br from-[#013a24] via-ghana-green to-[#02512f] px-6 py-12 text-center text-white sm:px-12">
          <MedicalBackdrop id="join-bg" className="text-white opacity-[0.1]" />
          <div className="pointer-events-none absolute -left-16 -bottom-16 h-56 w-56 rounded-full bg-ghana-gold/20 blur-2xl" />
          <h3 className="relative text-2xl font-bold sm:text-3xl">
            Lend your skills to the minutes that matter.
          </h3>
          <p className="relative mx-auto mt-3 max-w-2xl text-green-50">
            Tell us who you are and how you&apos;d like to help. We&apos;ll get you plugged in.
          </p>
          <div className="relative mt-7 flex flex-wrap justify-center gap-3">
            <a
              href={JOIN_MAILTO}
              className="rounded-xl bg-white px-6 py-3 font-semibold text-ghana-green transition hover:bg-green-50"
            >
              Volunteer or contribute
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-white/40 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Contribute code
            </a>
          </div>
          <p className="relative mt-4 text-xs text-green-100/80">
            Prefer email? Write to <span className="font-semibold text-white">build@nobed.ai</span>
          </p>
        </div>
      </section>

      {/* ───────────────────── Privacy / MVP note ───────────────────── */}
      <section className="px-4 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="text-lg font-semibold">Privacy first</h3>
            <p className="mt-2 text-sm text-slate-600">
              Aligned with the Ghana Data Protection Act, 2012. We never store full medical records,
              referrals use anonymized references, sensitive data is restricted by role, and every
              access is logged.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="text-lg font-semibold">This is an MVP demo</h3>
            <p className="mt-2 text-sm text-slate-600">
              All data shown is seeded sample data. Try the{" "}
              <Link className="text-ghana-green underline" href="/login">
                demo logins
              </Link>{" "}
              to explore the hospital, ambulance and admin portals.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ───────────────────────── components ───────────────────────── */

function StatCard({ big, unit, body }: { big: string; unit: string; body: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="text-4xl font-black tracking-tight text-slate-900">{big}</div>
      <div className="text-sm font-semibold text-ghana-green">{unit}</div>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">{body}</p>
    </div>
  );
}

function ImagePanel({
  id,
  from,
  to,
  eyebrow,
  caption,
  icon,
  className = "",
}: {
  id: string;
  from: string;
  to: string;
  eyebrow: string;
  caption: string;
  icon: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`lift relative flex h-72 items-end overflow-hidden rounded-3xl text-white shadow-xl sm:h-80 ${className}`}
      style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      <MedicalBackdrop id={id} className="text-white opacity-[0.12]" />
      <div className="pointer-events-none absolute right-5 top-5 opacity-25 [&>svg]:h-24 [&>svg]:w-24">
        {icon}
      </div>
      <div className="relative p-6">
        <div className="text-xs font-semibold uppercase tracking-widest text-white/70">{eyebrow}</div>
        <div className="mt-1 text-xl font-bold leading-snug">{caption}</div>
      </div>
    </div>
  );
}

const STORY_TONES: Record<string, { from: string; to: string; chip: string }> = {
  emergency: { from: "#7f1d1d", to: "#b91c1c", chip: "bg-red-100 text-red-800" },
  maternity: { from: "#9a3412", to: "#ea580c", chip: "bg-orange-100 text-orange-800" },
  icu: { from: "#1e3a8a", to: "#2563eb", chip: "bg-blue-100 text-blue-800" },
};

function StoryCard({
  tone,
  label,
  quote,
  who,
  icon,
}: {
  tone: keyof typeof STORY_TONES;
  label: string;
  quote: string;
  who: string;
  icon: React.ReactNode;
}) {
  const t = STORY_TONES[tone];
  return (
    <div className="lift overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* large "image" area */}
      <div
        className="relative h-44 text-white"
        style={{ backgroundImage: `linear-gradient(135deg, ${t.from}, ${t.to})` }}
      >
        <MedicalBackdrop id={`story-${tone}`} className="text-white opacity-[0.14]" withEcg={false} />
        <div className="pointer-events-none absolute bottom-4 right-4 opacity-30 [&>svg]:h-16 [&>svg]:w-16">
          {icon}
        </div>
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-800">
          {label}
        </span>
      </div>
      <div className="p-6">
        <blockquote className="text-slate-700">“{quote}”</blockquote>
        <p className="mt-4 text-sm font-medium text-slate-500">— {who}</p>
      </div>
    </div>
  );
}

function Point({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-ghana-green">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 13l4 4L19 7" />
        </svg>
      </span>
      <span className="text-slate-600">
        <strong className="text-slate-900">{title}.</strong> {children}
      </span>
    </li>
  );
}

function RoleCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="lift rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-ghana-green">
        {icon}
      </div>
      <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{body}</p>
    </div>
  );
}

/* ───────────────────────── icons ───────────────────────── */

const ip = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function IconRoute() {
  return (
    <svg {...ip}>
      <circle cx="6" cy="19" r="2" />
      <circle cx="18" cy="5" r="2" />
      <path d="M8 19h6a4 4 0 0 0 0-8H10a4 4 0 0 1 0-8h6" />
    </svg>
  );
}
function IconMap() {
  return (
    <svg {...ip}>
      <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z" />
      <path d="M9 4v14M15 6v14" />
    </svg>
  );
}
function IconAmbulance() {
  return (
    <svg {...ip}>
      <path d="M3 7h11v8H3z" />
      <path d="M14 10h4l3 3v2h-7z" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
      <path d="M7.5 9v3M6 10.5h3" />
    </svg>
  );
}
function IconHeart() {
  return (
    <svg {...ip}>
      <path d="M12 21s-7-4.5-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z" />
    </svg>
  );
}
function IconPulse() {
  return (
    <svg {...ip}>
      <path d="M2 12h5l2-6 4 12 2-6h7" />
    </svg>
  );
}
function IconCode() {
  return (
    <svg {...ip}>
      <path d="M8 9l-4 3 4 3M16 9l4 3-4 3M13 6l-2 12" />
    </svg>
  );
}
function IconStethoscope() {
  return (
    <svg {...ip}>
      <path d="M5 3v5a4 4 0 0 0 8 0V3" />
      <path d="M9 17a5 5 0 0 0 10 0v-2" />
      <circle cx="19" cy="12" r="2" />
    </svg>
  );
}
function IconHands() {
  return (
    <svg {...ip}>
      <path d="M12 3v6M9 5l3-2 3 2" />
      <path d="M4 12c2 0 3 1 4 3l2 3M20 12c-2 0-3 1-4 3l-2 3" />
      <path d="M10 21h4" />
    </svg>
  );
}
function IconHandshake() {
  return (
    <svg {...ip}>
      <path d="M3 10l4-3 5 3 5-3 4 3" />
      <path d="M7 7l-4 7 3 2 2-2 3 2 2-2 3 2 3-2-4-7" />
    </svg>
  );
}
