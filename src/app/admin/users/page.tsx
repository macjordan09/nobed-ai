import { prisma } from "@/lib/prisma";
import { ROLE_LABELS, type Role } from "@/lib/rbac";

export const dynamic = "force-dynamic";

export default async function AdminUsers() {
  const users = await prisma.user.findMany({
    include: { hospital: { select: { name: true } } },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-4 py-3">
        <h3 className="text-sm font-semibold">User management ({users.length})</h3>
        <p className="text-xs text-slate-500">
          Role-based access control. Password hashes are never exposed. Production adds MFA, OTP and
          device tracking.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Facility / Region</th>
              <th className="px-4 py-2">Verified</th>
              <th className="px-4 py-2">Last login</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-slate-100">
                <td className="px-4 py-2 font-medium">{u.name}</td>
                <td className="px-4 py-2 text-slate-600">{u.email}</td>
                <td className="px-4 py-2">
                  <span className="pill bg-slate-100 text-slate-700">
                    {ROLE_LABELS[u.role as Role] ?? u.role}
                  </span>
                </td>
                <td className="px-4 py-2 text-slate-600">{u.hospital?.name ?? u.region ?? "—"}</td>
                <td className="px-4 py-2">{u.isVerified ? "✓" : "—"}</td>
                <td className="px-4 py-2 text-xs text-slate-400">
                  {u.lastLogin ? new Date(u.lastLogin).toLocaleString("en-GB") : "never"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
