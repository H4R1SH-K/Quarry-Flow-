
'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { TableSkeleton } from '@/components/ui/table-skeleton';

const VehicleTable = dynamic(
  () => import('@/components/vehicles/vehicle-table').then((mod) => mod.VehicleTable),
  { 
    ssr: false,
    loading: () => <TableSkeleton />
  }
);

export default function VehiclesPage() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <VehicleTable />
    </Suspense>
  );
}
