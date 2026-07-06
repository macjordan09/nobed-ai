import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { getHospitalViews } from "@/lib/hospitals";
import { getAllReferrals } from "@/lib/referrals";
import { MapView } from "@/components/MapView";
import { ReferralForm } from "@/components/ReferralForm";
import { ReferralList } from "@/components/ReferralList";

export const dynamic = "force-dynamic";

export default async function AmbulancePage() {
  const session = getSession();
  if (!session || !can(session.role, "create_referral")) redirect("/login");

  const hospitals = await getHospitalViews();
  const referrals = await getAllReferrals();
  const active = referrals.filter((r) => !["Closed", "Declined"].includes(r.currentStatus));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Ambulance dispatch</h1>
        <p className="text-sm text-slate-500">
          National Ambulance Service · {session.name}
        </p>
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Find nearest facility</h2>
        <MapView hospitals={hospitals} />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Submit emergency referral</h2>
        <ReferralForm hospitals={hospitals} />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Track active referrals</h2>
        <ReferralList referrals={active} canManage />
      </section>
    </div>
  );
}
