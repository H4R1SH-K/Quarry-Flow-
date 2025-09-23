
'use client';

import dynamic from 'next/dynamic';
import { TableSkeleton } from '@/components/ui/table-skeleton';

const CollectionsTable = dynamic(
  () => import('@/components/collections/collections-table').then((mod) => mod.CollectionsTable),
  { 
    ssr: false,
    loading: () => <TableSkeleton />
  }
);

export default function CollectionsPage() {
  return <CollectionsTable />;
}
