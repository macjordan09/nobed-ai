import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { ROLE_LABELS, type Role } from "@/lib/rbac";
import { AdminNav } from "@/components/AdminNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = getSession();
  if (!session || (!can(session.role, "view_analytics") && !can(session.role, "view_audit_logs"))) {
    redirect("/login");
  }
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin command center</h1>
        <p className="text-sm text-slate-500">
          {ROLE_LABELS[session.role as Role]} · {session.name}
        </p>
      </div>
      <AdminNav />
      <div>{children}</div>
    </div>
  );
}
