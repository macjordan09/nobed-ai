import { getHospitalViews } from "@/lib/hospitals";
import { MapView } from "@/components/MapView";

export const dynamic = "force-dynamic";

export default async function FindBedsPage() {
  const hospitals = await getHospitalViews();
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-red-200 bg-red-50 p-4">
        <p className="text-sm font-semibold text-red-800">
          In a life-threatening emergency, call 112 immediately for an ambulance.
        </p>
        <p className="text-xs text-red-700">
          Use the filters to find the nearest facility with the bed type you need, then call ahead
          using the contact number on the pin.
        </p>
      </div>
      <h1 className="text-2xl font-bold">Find available beds</h1>
      <MapView hospitals={hospitals} />
    </div>
  );
}
