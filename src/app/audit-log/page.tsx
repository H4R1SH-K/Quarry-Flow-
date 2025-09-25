
import { AuditLogTable } from "@/components/audit-log/audit-log-table";
import { getDashboardData } from "@/lib/server/data";

export const dynamic = 'force-dynamic';

export default async function AuditLogPage() {
  const { auditLogs } = await getDashboardData();
  // @ts-ignore - auditLogs is not part of the return type but will be present in the fallback
  return <AuditLogTable initialData={auditLogs || []} />;
}
