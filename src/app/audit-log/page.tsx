
'use client';

import dynamic from 'next/dynamic';
import { TableSkeleton } from '@/components/ui/table-skeleton';

const AuditLogTable = dynamic(
  () => import('@/components/audit-log/audit-log-table').then((mod) => mod.AuditLogTable),
  { 
    loading: () => <TableSkeleton />,
    ssr: false,
  }
);

export default function AuditLogPage() {
  return (
    <AuditLogTable />
  );
}
