
import { VehicleTable } from "@/components/vehicles/vehicle-table";
import { getVehicles } from "@/lib/server/data";

export default async function VehiclesPage() {
  const vehicles = await getVehicles();
  return <VehicleTable initialData={vehicles} />;
}
