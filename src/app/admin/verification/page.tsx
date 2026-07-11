import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { getHospitalViews } from "@/lib/hospitals";
import { VERIFICATION_LABELS, REPORT_TYPES, type VerificationState } from "@/lib/verification";
import { VerificationBadge } from "@/components/VerificationBadge";
import { StaffRequestActions, ReportActions } from "@/components/VerificationActions";

export const dynamic = "force-dynamic";

const REPORT_STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-blue-100 text-blue-800",
  VERIFIED: "bg-green-100 text-green-800",
  DISMISSED: "bg-slate-100 text-slate-600",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

export default async function VerificationCenter() {
  const session = getSession();
  const canDecideStaff = !!session && (can(session.role, "manage_users") || session.role === "HOSPITAL_ADMIN");

  const [requests, reports, hospitals] = await Promise.all([
    prisma.verificationRequest.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.communityReport.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
    getHospitalViews(),
  ]);

  const trust: Record<VerificationState, number> = { verified: 0, self_reported: 0, stale: 0 };
  for (const h of hospitals) trust[h.verification]++;

  const pendingStaff = requests.filter((r) => r.status === "PENDING").length;
  const pendingReports = reports.filter((r) => r.status === "PENDING").length;

  return (
    <div className="space-y-8">
      {/* Data-trust overview */}
      <div>
        <h2 className="mb-3 text-lg font-semibold">Data-trust overview</h2>
        <div className="grid grid-cols-3 gap-3">
          {(["verified", "self_reported", "stale"] as VerificationState[]).map((s) => (
            <div key={s} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="text-3xl font-bold">{trust[s]}</div>
              <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                <VerificationBadge state={s} /> {VERIFICATION_LABELS[s]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Staff access requests */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <h2 className="text-lg font-semibold">Staff access requests</h2>
          {pendingStaff > 0 && <span className="pill bg-amber-100 text-amber-800">{pendingStaff} pending</span>}
        </div>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-2">Person</th>
                <th className="px-4 py-2">Hospital</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Decision</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-6 text-center text-slate-400">No requests.</td></tr>
              )}
              {requests.map((r) => (
                <tr key={r.id} className="border-t border-slate-100">
                  <td className="px-4 py-2">
                    <div className="font-medium">{r.userName}</div>
                    <div className="text-xs text-slate-500">{r.email}</div>
                  </td>
                  <td className="px-4 py-2">{r.hospitalName ?? "n/a"}</td>
                  <td className="px-4 py-2">
                    <span className={`pill ${REPORT_STATUS_STYLE[r.status]}`}>{r.status}</span>
                  </td>
                  <td className="px-4 py-2">
                    {r.status === "PENDING" && canDecideStaff ? (
                      <StaffRequestActions id={r.id} />
                    ) : (
                      <span className="text-xs text-slate-400">
                        {r.reviewedBy ? `by ${r.reviewedBy}` : "n/a"}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Community reports */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <h2 className="text-lg font-semibold">Community reports</h2>
          {pendingReports > 0 && <span className="pill bg-amber-100 text-amber-800">{pendingReports} pending</span>}
        </div>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-2">Hospital</th>
                <th className="px-4 py-2">Report</th>
                <th className="px-4 py-2">Reporter</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Moderate</th>
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-400">No reports yet.</td></tr>
              )}
              {reports.map((r) => (
                <tr key={r.id} className="border-t border-slate-100 align-top">
                  <td className="px-4 py-2 font-medium">{r.hospitalName}</td>
                  <td className="px-4 py-2">
                    <div>{REPORT_TYPES[r.reportType] ?? r.reportType}</div>
                    {r.message && <div className="text-xs text-slate-500">“{r.message}”</div>}
                  </td>
                  <td className="px-4 py-2 text-xs">
                    {r.reporterVerified ? (
                      <span className="pill bg-green-100 text-green-800">✓ verified</span>
                    ) : (
                      <span className="text-slate-400">anonymous</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <span className={`pill ${REPORT_STATUS_STYLE[r.status]}`}>{r.status}</span>
                  </td>
                  <td className="px-4 py-2">
                    {r.status === "PENDING" ? (
                      <ReportActions id={r.id} />
                    ) : (
                      <span className="text-xs text-slate-400">{r.reviewedBy ? `by ${r.reviewedBy}` : "n/a"}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
