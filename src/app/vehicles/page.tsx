
import { VehicleTable } from "@/components/vehicles/vehicle-table";
import { getDashboardData } from "@/lib/server/data";

export const dynamic = 'force-dynamic';

export default async function VehiclesPage() {
  const { vehicles } = await getDashboardData();
  return <VehicleTable initialData={vehicles} />;
}
