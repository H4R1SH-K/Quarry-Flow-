
import { AuditLogTable } from "@/components/audit-log/audit-log-table";
import { getAuditLogs } from "@/lib/server/data";

export default async function AuditLogPage() {
  const auditLogs = await getAuditLogs();
  return <AuditLogTable initialData={auditLogs} />;
}
