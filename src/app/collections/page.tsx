
'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { TableSkeleton } from '@/components/ui/table-skeleton';

const CollectionsTable = dynamic(
  () => import('@/components/collections/collections-table').then((mod) => mod.CollectionsTable),
  { 
    ssr: false,
  }
);

export default function CollectionsPage() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <CollectionsTable />
    </Suspense>
  );
}
