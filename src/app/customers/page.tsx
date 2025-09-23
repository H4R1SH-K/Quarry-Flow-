
'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { TableSkeleton } from '@/components/ui/table-skeleton';

const CustomerTable = dynamic(
  () => import('@/components/customers/customer-table').then((mod) => mod.CustomerTable),
  { 
    ssr: false, 
    loading: () => <TableSkeleton />
  }
);

export default function CustomersPage() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <CustomerTable />
    </Suspense>
  );
}
