
'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { TableSkeleton } from '@/components/ui/table-skeleton';

const InvoicingTable = dynamic(
  () => import('@/components/invoicing/invoicing-table').then((mod) => mod.InvoicingTable),
  { 
    ssr: false,
    loading: () => <TableSkeleton />
  }
);

export default function InvoicingPage() {
    return (
      <Suspense fallback={<TableSkeleton />}>
        <InvoicingTable />
      </Suspense>
    );
}
