
'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { TableSkeleton } from '@/components/ui/table-skeleton';

const SalesTable = dynamic(
  () => import('@/components/sales/sales-table').then((mod) => mod.SalesTable),
  { 
    ssr: false,
  }
);

export default function SalesPage() {
    return (
      <Suspense fallback={<TableSkeleton />}>
        <SalesTable />
      </Suspense>
    );
}
