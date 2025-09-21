'use client';

import dynamic from 'next/dynamic';
import { TableSkeleton } from '@/components/ui/table-skeleton';

const VehicleTable = dynamic(
  () => import('@/components/vehicles/vehicle-table').then((mod) => mod.VehicleTable),
  { 
    loading: () => <TableSkeleton />,
    ssr: false,
  }
);

export default function VehiclesPage() {
  return (
    <VehicleTable />
  );
}
