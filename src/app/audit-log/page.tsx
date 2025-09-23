
'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { TableSkeleton } from '@/components/ui/table-skeleton';

const AuditLogTable = dynamic(
  () => import('@/components/audit-log/audit-log-table').then((mod) => mod.AuditLogTable),
  { 
    ssr: false,
  }
);

export default function AuditLogPage() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <AuditLogTable />
    </Suspense>
  );
}
