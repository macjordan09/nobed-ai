import { getHospitalViews } from "@/lib/hospitals";
import { MapView } from "@/components/MapView";

export const dynamic = "force-dynamic";

export default async function MapPage() {
  const hospitals = await getHospitalViews();
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Ghana hospital capacity map</h1>
        <p className="text-sm text-slate-600">
          Live bed availability across {new Set(hospitals.map((h) => h.region)).size} regions. Pin
          colour reflects emergency capacity. Filter and click a pin for full detail.
        </p>
      </div>
      <MapView hospitals={hospitals} />
    </div>
  );
}
