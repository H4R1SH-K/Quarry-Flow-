
import { VehicleTable } from "@/components/vehicles/vehicle-table";
import { getVehicles } from "@/lib/server/data";
import { initialState } from "@/lib/sample-data";

export default async function VehiclesPage() {
  const vehicles = await getVehicles();
  const useSampleData = vehicles.length === 0;
  return <VehicleTable initialData={useSampleData ? initialState.vehicles : vehicles} />;
}
