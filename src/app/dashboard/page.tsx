import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { getHospitalView } from "@/lib/hospitals";
import { getReferralsForHospital } from "@/lib/referrals";
import { CapacityEditor } from "@/components/CapacityEditor";
import { ReferralList } from "@/components/ReferralList";
import { StatusBadge } from "@/components/StatusBadge";
import { ConfirmCapacity } from "@/components/ConfirmCapacity";
import { VerificationBadge } from "@/components/VerificationBadge";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = getSession();
  if (!session || !can(session.role, "update_capacity") || !session.hospitalId) {
    redirect("/login");
  }

  const hospital = await getHospitalView(session.hospitalId);
  if (!hospital) redirect("/login");

  const { incoming, outgoing } = await getReferralsForHospital(session.hospitalId);
  const pendingIncoming = incoming.filter((r) => r.currentStatus === "Submitted");

  const totalBeds = Object.values(hospital.beds).reduce((s, b) => s + b.total, 0);
  const totalAvailable = Object.values(hospital.beds).reduce((s, b) => s + b.available, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{hospital.name}</h1>
          <p className="text-sm text-slate-500">
            {hospital.facilityType} · {hospital.district}, {hospital.region}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={hospital.status} />
          <VerificationBadge state={hospital.verification} />
          <span className="text-xs text-slate-400">
            Updated {new Date(hospital.lastUpdatedAt).toLocaleTimeString("en-GB")}
          </span>
        </div>
      </div>

      {!session.isVerified && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
          <strong>Your account is pending verification.</strong> You can view this dashboard, but you
          can&apos;t update or confirm capacity until a hospital or system admin approves your access.
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Kpi label="Total beds" value={totalBeds} />
        <Kpi label="Available" value={totalAvailable} accent="text-ghana-green" />
        <Kpi label="Emergency free" value={hospital.emergencyAvailable} />
        <Kpi label="ICU free" value={hospital.icuAvailable} />
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Update & verify capacity</h2>
        <p className="text-sm text-slate-600">
          Status colour is calculated automatically from emergency availability. Update beds as they
          change, then <strong>confirm</strong> so responders know the numbers are trusted and current.
        </p>
        <ConfirmCapacity
          state={hospital.verification}
          verifiedAt={hospital.verifiedAt}
          canConfirm={session.isVerified}
        />
        <CapacityEditor hospital={hospital} />
      </section>

      <section>
        <div className="mb-3 flex items-center gap-2">
          <h2 className="text-lg font-semibold">Incoming referrals</h2>
          {pendingIncoming.length > 0 && (
            <span className="pill bg-red-100 text-red-800">{pendingIncoming.length} pending</span>
          )}
        </div>
        <ReferralList referrals={incoming} canManage />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Outgoing referrals & history</h2>
        <ReferralList referrals={outgoing} canManage={can(session.role, "create_referral")} />
      </section>
    </div>
  );
}

function Kpi({ label, value, accent }: { label: string; value: number; accent?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className={`text-2xl font-bold ${accent ?? "text-slate-900"}`}>{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}
