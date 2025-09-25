
'use client';
import { VehicleTable } from "@/components/vehicles/vehicle-table";
import { useDataStore } from "@/lib/data-store";

export default function VehiclesPage() {
  const { vehicles } = useDataStore();
  return <VehicleTable initialData={vehicles} />;
}
