import { getHospitalViews } from "@/lib/hospitals";
import { StatusBadge } from "@/components/StatusBadge";

export const dynamic = "force-dynamic";

export default async function AdminHospitals() {
  const hospitals = await getHospitalViews();
  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-4 py-3">
        <h3 className="text-sm font-semibold">Hospital management ({hospitals.length})</h3>
        <p className="text-xs text-slate-500">
          In production: register, edit and deactivate facilities, set thresholds, assign staff.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-2">Hospital</th>
              <th className="px-4 py-2">Region</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Emerg.</th>
              <th className="px-4 py-2">ICU</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Updated</th>
            </tr>
          </thead>
          <tbody>
            {hospitals.map((h) => (
              <tr key={h.id} className="border-t border-slate-100">
                <td className="px-4 py-2 font-medium">{h.name}</td>
                <td className="px-4 py-2">{h.region}</td>
                <td className="px-4 py-2">
                  {h.facilityType} <span className="text-slate-400">/ {h.ownershipType}</span>
                </td>
                <td className="px-4 py-2">{h.emergencyAvailable}</td>
                <td className="px-4 py-2">{h.icuAvailable}</td>
                <td className="px-4 py-2">
                  <StatusBadge status={h.status} showLabel={false} />
                </td>
                <td className="px-4 py-2 text-xs text-slate-400">
                  {new Date(h.lastUpdatedAt).toLocaleString("en-GB")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
