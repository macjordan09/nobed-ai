import Link from "next/link";
import type { Metadata } from "next";
import { CaseTimeline } from "@/components/CaseTimeline";
import { NightJourney } from "@/components/NightJourney";
import { EvidencePanel } from "@/components/EvidencePanel";

export const metadata: Metadata = {
  title: "About · NoBed.ai · Ending Ghana's No Bed Syndrome",
  description:
    "Why NoBed.ai exists: the human story of No Bed Syndrome, the evidence from Ghana's tertiary hospitals, and the research (University of Toronto & Ashesi) that names the fix.",
};

const EMAIL = "mailto:info.nobedai@gmail.com?subject=I%20want%20to%20help%20build%20NoBed.ai";
const GITHUB = "https://github.com/macjordan09/nobed-ai";
const PAPER = "https://reachalliance.org/wp-content/uploads/2024/03/No-bed-syndrome.pdf";

export default function AboutPage() {
  return (
    <div className="-mb-6 pb-16 md:pb-0">
      {/* ───────────── HERO ───────────── */}
      <section className="full-bleed relative -mt-6 overflow-hidden bg-brand-ink text-white">
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: "#0b1220",
            backgroundImage:
              "linear-gradient(90deg, rgba(9,14,24,0.95), rgba(9,14,24,0.72), rgba(9,14,24,0.4)), url('/hospitals/photos/korle-bu.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] backdrop-blur">
              The problem we refuse to accept
            </span>
            <h1 className="mt-5 text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl xl:text-6xl">
              No one should die <br className="hidden sm:block" />
              looking for a bed.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-200">
              Across Ghana, families have lost people they love. Not because the medicine
              didn&apos;t exist, but because no one could tell them where a free bed was in time. It
              has a name: <span className="font-semibold text-white">No Bed Syndrome</span>. NoBed.ai
              exists to end it.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/capacity" className="rounded-xl bg-brand-red px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand-red/30 transition hover:bg-red-700">
                See live capacity
              </Link>
              <a href={PAPER} target="_blank" rel="noreferrer" className="rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20">
                Read the research →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── WHAT IS NO BED SYNDROME ───────────── */}
      <Section>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <Eyebrow>What is No Bed Syndrome?</Eyebrow>
            <H2>A patient in crisis. A van going door to door.</H2>
            <div className="mt-4 space-y-4 text-slate-600">
              <p>
                No Bed Syndrome is what happens when a critically ill patient is turned away from one
                hospital after another, sometimes five, six, seven facilities in a single night,
                because no one knows, in the moment, which one can actually take them.
              </p>
              <p>
                The beds often exist. The problem is <strong>visibility</strong>. Capacity changes by
                the minute, it lives in people&apos;s heads and paper logbooks, and there is no
                shared, real-time picture for the ambulance crew, the referring nurse, or the family
                in the back seat.
              </p>
              <p>
                And &ldquo;a bed&rdquo; is never just a mattress. It only counts if the oxygen, the
                ICU, the blood, and the staff to use it are free too. NoBed.ai makes that whole
                picture visible.
              </p>
            </div>
          </div>
          <NightJourney />
        </div>
      </Section>

      {/* ───────────── THE CATALYST ───────────── */}
      <section className="full-bleed relative overflow-hidden bg-slate-950 text-white">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(2,6,12,0.85), rgba(2,6,12,0.95)), url('/hospitals/photos/cape-coast.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-5 py-16 text-center sm:px-8">
          <Eyebrow tone="red">The case that named the crisis</Eyebrow>
          <blockquote className="mt-4 text-2xl font-semibold leading-snug sm:text-3xl">
            In 2018, a 70-year-old man was turned away from <span className="text-red-300">seven
            hospitals</span> in Accra. Two private, five state, including Korle Bu and the Greater
            Accra Regional Hospital. He died before a bed was found.
          </blockquote>
          <p className="mt-5 text-sm text-slate-300">
            The death of Anthony Opoku-Acheampong forced &ldquo;No Bed Syndrome&rdquo; into national
            headlines and pushed Ghana toward emergency-dispatch coordination. The conversation
            started. For too many families, the everyday reality did not change enough.
          </p>
          <p className="mt-3 text-xs text-slate-500">Source: Citi Newsroom, 11 June 2018.</p>
        </div>
      </section>

      {/* ───────────── BY THE NUMBERS ───────────── */}
      <Section tint>
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>By the numbers</Eyebrow>
          <H2 center>The shortage is real, and measured.</H2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard big="1.3" unit="beds / 1,000" body="Africa's hospital-bed density, the lowest of any world region. The global average is about 2.7." />
          <StatCard big="0.9" unit="beds / 1,000" body="Ghana's ratio in 2021, among the lowest in the world." />
          <StatCard big="10 / 16" unit="regions" body="had no ICU beds at all. That is roughly 0.5 ICU beds per 100,000 people." />
          <StatCard big="5" unit="teaching hospitals" body="serve all 16 regions, so the hardest cases converge on a handful of sites." />
        </div>
        <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-relaxed text-slate-400">
          Sources: WHO Global Health Observatory (2019); Siaw-Frimpong et al., &ldquo;Capacity of
          Intensive Care Units in Ghana,&rdquo; <em>Journal of Critical Care</em> 61 (2021); and the
          Reach Alliance (2024) study below.
        </p>
      </Section>

      {/* ───────────── THE RESEARCH ───────────── */}
      <Section>
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <Eyebrow tone="green">The evidence</Eyebrow>
            <H2>The fix isn&apos;t our opinion. It&apos;s the research.</H2>
            <p className="mt-4 text-slate-600">
              In February 2024, the <strong>Reach Alliance</strong>, a research initiative at the
              University of Toronto&apos;s Munk School of Global Affairs &amp; Public Policy with{" "}
              <strong>Ashesi University</strong>, studied No Bed Syndrome across Ghana&apos;s
              tertiary hospitals, through 16 key-informant interviews with doctors, nurses and
              administrators.
            </p>
            <p className="mt-4 text-slate-600">
              They found the core failure isn&apos;t only supply. It&apos;s coordination. And they
              named the fix almost exactly:
            </p>
            <figure className="mt-5 rounded-2xl border border-brand-green/20 bg-green-50/60 p-5">
              <blockquote className="text-lg font-semibold leading-snug text-brand-ink">
                &ldquo;Establish an integrated referral system that makes use of the Bed Bureau
                Unit&apos;s role to connect the various healthcare system referral levels.&rdquo;
              </blockquote>
              <figcaption className="mt-3 text-xs text-slate-500">
                Recommendations, <em>The &ldquo;No Bed Syndrome&rdquo; in Ghanaian Tertiary
                Hospitals</em> (Reach Alliance, 2024)
              </figcaption>
            </figure>
            <p className="mt-5 text-slate-600">
              That recommendation is, essentially, NoBed.ai. Some hospitals already run a manual{" "}
              <strong>&ldquo;Bed Bureau&rdquo;</strong> that counts free beds by hand each day. It was
              the study&apos;s second most-cited effective fix. We are the digital version of that
              role, connected across institutions instead of trapped inside one.
            </p>
          </div>
          <EvidencePanel href={PAPER} />
        </div>
      </Section>

      {/* ───────────── REPORTED CASES ───────────── */}
      <Section tint>
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow tone="red">Lives behind the headlines</Eyebrow>
          <H2 center>Reported, again and again.</H2>
          <p className="mt-3 text-slate-600">
            These are real, publicly reported deaths tied to No Bed Syndrome. Years apart, the same
            story. We name them with respect, so the pattern is impossible to look away from.
          </p>
        </div>
        <div className="mt-12">
          <CaseTimeline />
        </div>
        <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-relaxed text-slate-400">
          Compiled from Ghanaian press reports (Citi Newsroom, Ghanaian Times and others) and the{" "}
          <a href={PAPER} target="_blank" rel="noreferrer" className="underline hover:text-slate-600">
            Reach Alliance (2024) study
          </a>
          . Shared to honour those affected; this list is not exhaustive.
        </p>
      </Section>

      {/* ───────────── HOW WE RESPOND ───────────── */}
      <Section>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <PhotoPanel
            src="/hospitals/photos/ridge.jpg"
            className="lg:order-1"
            eyebrow="Our response"
            caption="One live, honest map of where care is actually available."
          />
          <div className="lg:order-2">
            <Eyebrow tone="green">How NoBed.ai helps</Eyebrow>
            <H2>Make the invisible visible, in real time.</H2>
            <ul className="mt-5 space-y-4">
              <Point title="Operational capacity, one map">
                Hospitals report beds, ICU, oxygen, staff and imaging; the status recalculates
                automatically so everyone sees the same truth, and never a false green.
              </Point>
              <Point title="Access for everyone, even by SMS">
                No smartphone? Text{" "}
                <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[13px]">BED ACCRA</code> and
                get the nearest facilities that can actually receive the patient.
              </Point>
              <Point title="Referrals that actually land">
                Ambulance teams refer to a hospital that can receive the patient. A bed is held, and
                the transfer is tracked end to end.
              </Point>
            </ul>
            <p className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
              <strong className="text-brand-ink">Honest about scope:</strong> NoBed.ai doesn&apos;t
              build beds or hire staff. Those are capital and policy problems. It makes sure the
              beds and teams Ghana already has are never invisible when minutes matter.
            </p>
            <Link href="/capacity" className="mt-6 inline-block rounded-xl bg-brand-green px-5 py-2.5 text-sm font-bold text-white transition hover:bg-green-800">
              See the live capacity map
            </Link>
          </div>
        </div>
      </Section>

      {/* ───────────── WHO BUILT IT ───────────── */}
      <Section tint>
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <Eyebrow>Who built this</Eyebrow>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-brand-ink">Mac-Jordan Degadjor</h2>
          <p className="mt-3 leading-relaxed text-slate-600">
            NoBed.ai was designed and built by Mac-Jordan Degadjor, a Ghanaian digital and
            technology writer based in Canada who works at the intersection of AI/ML, startups,
            software development and digital media. His work turns hyped-up technology into practical
            tools, through an African lens. No Bed Syndrome is exactly that kind of problem: real,
            human, and solvable with the right tools rather than the loudest ones. So he built the
            tool. It is grounded in the research, engineered for low-resource settings, and shipped
            end to end.
          </p>
          <p className="mt-4 text-sm text-slate-500">
            Reach him at{" "}
            <a href="mailto:info.nobedai@gmail.com" className="font-semibold text-brand-green hover:underline">
              info.nobedai@gmail.com
            </a>
            .
          </p>
        </div>
      </Section>

      {/* ───────────── BUILD WITH US ───────────── */}
      <Section>
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow tone="green">Build it with us</Eyebrow>
          <H2 center>This is bigger than one team.</H2>
          <p className="mt-3 text-slate-600">
            NoBed.ai is an open, mission-driven effort. If you can write code, care for patients,
            organise communities, or open doors, there&apos;s a place for you here.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <RoleCard title="Developers & engineers" body="React/Next.js, mapping, SMS gateways, data pipelines, PostGIS. Help us scale from demo to national." />
          <RoleCard title="Clinicians & health workers" body="Pressure-test the referral flow, define thresholds, and keep the product honest to real emergencies." />
          <RoleCard title="Volunteers & advocates" body="Onboard hospitals, run community SMS drives, translate to Twi, Ga, Ewe, Dagbani and more." />
          <RoleCard title="Partners & funders" body="GHS, the National Ambulance Service, telcos and donors who can take a pilot to scale." />
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href={EMAIL} className="rounded-xl bg-brand-ink px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800">
            Volunteer or partner
          </a>
          <a href={GITHUB} target="_blank" rel="noreferrer" className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-bold text-brand-ink transition hover:bg-slate-100">
            Contribute code
          </a>
        </div>
      </Section>

      {/* ───────────── PRIVACY / MVP NOTE ───────────── */}
      <Section tint>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="text-lg font-semibold text-brand-ink">Privacy first</h3>
            <p className="mt-2 text-sm text-slate-600">
              Aligned with the Ghana Data Protection Act, 2012. We never store full medical records,
              referrals use anonymised references, sensitive data is restricted by role, and every
              access is logged.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="text-lg font-semibold text-brand-ink">This is an MVP demo</h3>
            <p className="mt-2 text-sm text-slate-600">
              All capacity shown is seeded sample data. Try the{" "}
              <Link className="font-semibold text-brand-green hover:underline" href="/login">
                demo logins
              </Link>{" "}
              to explore the hospital, ambulance and admin portals. In a real emergency, call{" "}
              <strong className="text-brand-red">112</strong>.
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}

/* ───────────── local helpers ───────────── */
function Section({ children, tint }: { children: React.ReactNode; tint?: boolean }) {
  if (tint) {
    return (
      <section className="full-bleed bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">{children}</div>
      </section>
    );
  }
  return <section className="mx-auto max-w-7xl py-14 sm:py-16">{children}</section>;
}

function Eyebrow({ children, tone = "green" }: { children: React.ReactNode; tone?: "green" | "red" }) {
  return (
    <span className={`text-xs font-bold uppercase tracking-[0.16em] ${tone === "red" ? "text-brand-red" : "text-brand-green"}`}>
      {children}
    </span>
  );
}

function H2({ children, center }: { children: React.ReactNode; center?: boolean }) {
  return (
    <h2 className={`mt-2 text-2xl font-black tracking-tight text-brand-ink sm:text-3xl ${center ? "mx-auto" : ""}`}>
      {children}
    </h2>
  );
}

// Photo panel via CSS background. A missing image degrades to the dark gradient
// (no broken frame), so the user-provided ward photos slot in cleanly once added.
function PhotoPanel({
  src,
  eyebrow,
  caption,
  tall,
  className = "",
}: {
  src: string;
  eyebrow: string;
  caption: string;
  tall?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`relative flex items-end overflow-hidden rounded-2xl text-white shadow-xl ${tall ? "h-80 lg:h-full lg:min-h-[22rem]" : "h-64 sm:h-72"} ${className}`}
      style={{
        backgroundColor: "#0f2a1e",
        backgroundImage: `linear-gradient(180deg, rgba(9,20,15,0.25), rgba(9,20,15,0.85)), url('${src}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="relative p-6">
        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">{eyebrow}</div>
        <div className="mt-1 text-lg font-bold leading-snug">{caption}</div>
      </div>
    </div>
  );
}

function StatCard({ big, unit, body }: { big: string; unit: string; body: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="text-4xl font-black tracking-tight text-brand-ink">{big}</div>
      <div className="text-sm font-semibold text-brand-green">{unit}</div>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">{body}</p>
    </div>
  );
}

function Point({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-brand-green">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 13l4 4L19 7" />
        </svg>
      </span>
      <span className="text-slate-600">
        <strong className="text-brand-ink">{title}.</strong> {children}
      </span>
    </li>
  );
}

function RoleCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="font-semibold text-brand-ink">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{body}</p>
    </div>
  );
}
