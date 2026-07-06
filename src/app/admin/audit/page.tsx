import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { can } from "@/lib/rbac";

export const dynamic = "force-dynamic";

export default async function AdminAudit() {
  const session = getSession();
  if (!session || !can(session.role, "view_audit_logs")) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">
        Your role does not have permission to view audit logs. This requires System Auditor or Super
        Admin access.
      </div>
    );
  }

  const logs = await prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 200 });

  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-4 py-3">
        <h3 className="text-sm font-semibold">Audit trail ({logs.length})</h3>
        <p className="text-xs text-slate-500">
          Immutable record of capacity updates, referrals, logins and admin actions.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-2">Time</th>
              <th className="px-4 py-2">Actor</th>
              <th className="px-4 py-2">Action</th>
              <th className="px-4 py-2">Entity</th>
              <th className="px-4 py-2">Change</th>
              <th className="px-4 py-2">IP</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id} className="border-t border-slate-100">
                <td className="px-4 py-2 whitespace-nowrap text-xs text-slate-400">
                  {new Date(l.createdAt).toLocaleString("en-GB")}
                </td>
                <td className="px-4 py-2">{l.actorLabel ?? l.userId ?? "system"}</td>
                <td className="px-4 py-2">
                  <span className="pill bg-slate-100 text-slate-700">{l.action}</span>
                </td>
                <td className="px-4 py-2 text-slate-600">{l.entityType}</td>
                <td className="px-4 py-2 text-xs text-slate-600">
                  {l.oldValue ? `${l.oldValue} → ` : ""}
                  {l.newValue ?? "—"}
                </td>
                <td className="px-4 py-2 font-mono text-xs text-slate-400">{l.ipAddress ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
