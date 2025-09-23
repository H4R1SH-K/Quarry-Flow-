
'use client';

import dynamic from 'next/dynamic';
import { FullPageLoader } from '@/components/ui/full-page-loader';

const VehicleTable = dynamic(
  () => import('@/components/vehicles/vehicle-table').then((mod) => mod.VehicleTable),
  { 
    ssr: false,
    loading: () => <FullPageLoader />
  }
);

export default function VehiclesPage() {
  return <VehicleTable />;
}
