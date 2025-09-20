
'use client';

import dynamic from 'next/dynamic';

const VehicleTable = dynamic(
  () => import('@/components/vehicles/vehicle-table').then((mod) => mod.VehicleTable),
  { ssr: false }
);

export default function VehiclesPage() {
  return (
    <VehicleTable />
  );
}
