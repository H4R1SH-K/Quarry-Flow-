
'use client';

import { AuditLogTable } from "@/components/audit-log/audit-log-table";
import { useDataStore } from "@/lib/data-store";

export default function AuditLogPage() {
  const { auditLogs } = useDataStore();
  return <AuditLogTable initialData={auditLogs || []} />;
}
