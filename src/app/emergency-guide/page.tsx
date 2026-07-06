export default function EmergencyGuidePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="rounded-xl bg-ghana-red p-6 text-white">
        <h1 className="text-2xl font-bold">In an emergency, call 112</h1>
        <p className="mt-1 text-sm text-red-50">
          112 is Ghana&apos;s national emergency number for ambulance, fire and police. The National
          Ambulance Service can also be reached on 0302 760 011.
        </p>
      </div>

      <Section title="1. Call for help first">
        <p>
          Call 112 immediately for a life-threatening emergency — severe bleeding, chest pain,
          difficulty breathing, unconsciousness, serious accidents, or labour complications. Give
          your exact location and a callback number.
        </p>
      </Section>

      <Section title="2. Check bed availability while you wait">
        <p>
          Use the <a className="text-ghana-green underline" href="/find-beds">Find Beds</a> map, or
          text <code className="rounded bg-slate-100 px-1.5 py-0.5">BED &lt;your city&gt;</code> to
          the NoBed short code if you have no internet. You&apos;ll get the nearest facilities and
          their current emergency status.
        </p>
      </Section>

      <Section title="3. Call the hospital before travelling">
        <p>
          Capacity changes minute to minute. Call the hospital&apos;s emergency line (shown on each
          map pin) to confirm they can receive the patient before you set off. This prevents the
          dangerous “hospital to hospital” driving that No Bed Syndrome causes.
        </p>
      </Section>

      <Section title="Understanding the colours">
        <ul className="space-y-2">
          <Legend colour="#16A34A" label="Green — beds available, stable capacity" />
          <Legend colour="#F59E0B" label="Yellow — moderate availability (3–5 beds)" />
          <Legend colour="#EA580C" label="Amber — near capacity (1–2 beds)" />
          <Legend colour="#DC2626" label="Red — critical / no emergency beds or unit closed" />
        </ul>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 text-lg font-semibold">{title}</h2>
      <div className="text-sm leading-relaxed text-slate-700">{children}</div>
    </section>
  );
}

function Legend({ colour, label }: { colour: string; label: string }) {
  return (
    <li className="flex items-center gap-3 text-sm text-slate-700">
      <span className="h-4 w-4 rounded-full" style={{ background: colour }} />
      {label}
    </li>
  );
}
