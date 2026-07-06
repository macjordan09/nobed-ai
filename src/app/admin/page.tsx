import { getAnalytics } from "@/lib/analytics";
import { AnalyticsCharts } from "@/components/AnalyticsCharts";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const a = await getAnalytics();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Kpi label="Hospitals" value={a.totals.hospitals} />
        <Kpi label="Regions" value={a.totals.regions} />
        <Kpi label="Emergency free" value={a.totals.emergencyFree} accent="text-ghana-green" />
        <Kpi label="ICU free" value={a.totals.icuFree} accent="text-ghana-green" />
        <Kpi label="Referrals" value={a.totals.referrals} />
        <Kpi label="Update compliance" value={`${a.compliance}%`} accent={a.compliance < 80 ? "text-red-600" : "text-ghana-green"} />
      </div>

      <AnalyticsCharts
        statusDist={a.statusDist}
        regions={a.regions}
        funnel={a.funnel}
        emergencyCategories={a.emergencyCategories}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Regional pressure table */}
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="mb-3 text-sm font-semibold">Regional bed pressure</h3>
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="py-1">Region</th>
                <th className="py-1">Hosp.</th>
                <th className="py-1">Emerg. free</th>
                <th className="py-1">ICU free</th>
                <th className="py-1">Pressure</th>
              </tr>
            </thead>
            <tbody>
              {a.regions.map((r) => (
                <tr key={r.region} className="border-t border-slate-100">
                  <td className="py-1.5">{r.region}</td>
                  <td className="py-1.5">{r.hospitals}</td>
                  <td className="py-1.5">{r.emergencyFree}</td>
                  <td className="py-1.5">{r.icuFree}</td>
                  <td className="py-1.5">
                    <span
                      className={`pill ${
                        r.pressure >= 60 ? "bg-red-100 text-red-800" : r.pressure >= 30 ? "bg-orange-100 text-orange-800" : "bg-green-100 text-green-800"
                      }`}
                    >
                      {r.pressure}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Update compliance / stale hospitals + alerts */}
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="mb-2 text-sm font-semibold">
              Hospitals not updated in 2h ({a.stale.length})
            </h3>
            {a.stale.length === 0 ? (
              <p className="text-sm text-slate-400">All hospitals reporting on time.</p>
            ) : (
              <ul className="space-y-1 text-sm">
                {a.stale.map((h) => (
                  <li key={h.id} className="flex justify-between">
                    <span>{h.name}</span>
                    <span className="text-xs text-slate-400">
                      {new Date(h.lastUpdatedAt).toLocaleString("en-GB")}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="mb-2 text-sm font-semibold">Key metrics</h3>
            <Metric label="Referral acceptance rate" value={`${a.acceptanceRate}%`} />
            <Metric label="SMS queries logged" value={String(a.totals.smsQueries)} />
            <Metric label="Unauthorized SMS attempts" value={String(a.smsUnauthorized)} />
            <Metric label="Maternity beds free (national)" value={String(a.totals.maternityFree)} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Kpi({ label, value, accent }: { label: string; value: number | string; accent?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className={`text-xl font-bold ${accent ?? "text-slate-900"}`}>{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-slate-100 py-1.5 text-sm last:border-0">
      <span className="text-slate-600">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
