
import dynamic from 'next/dynamic';
import { TableSkeleton } from '@/components/ui/table-skeleton';

const VehicleTable = dynamic(
  () => import('@/components/vehicles/vehicle-table').then((mod) => mod.VehicleTable),
  { 
    loading: () => <TableSkeleton />
  }
);

export default function VehiclesPage() {
  return (
    <VehicleTable />
  );
}
