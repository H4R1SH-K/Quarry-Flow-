
'use client';

import dynamic from 'next/dynamic';
import { TableSkeleton } from '@/components/ui/table-skeleton';

const SalesTable = dynamic(
  () => import('@/components/sales/sales-table').then((mod) => mod.SalesTable),
  { 
    ssr: false,
    loading: () => <TableSkeleton />
  }
);

export default function SalesPage() {
    return <SalesTable />;
}
