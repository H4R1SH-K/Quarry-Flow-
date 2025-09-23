
'use client';

import dynamic from 'next/dynamic';
import { FullPageLoader } from '@/components/ui/full-page-loader';

const AuditLogTable = dynamic(
  () => import('@/components/audit-log/audit-log-table').then((mod) => mod.AuditLogTable),
  { 
    ssr: false,
    loading: () => <FullPageLoader />
  }
);

export default function AuditLogPage() {
  return <AuditLogTable />;
}
