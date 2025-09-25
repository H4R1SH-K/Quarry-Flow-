
import { SalesTable } from "@/components/sales/sales-table";
import { getDashboardData } from "@/lib/server/data";

export const dynamic = 'force-dynamic';

export default async function SalesPage() {
  const { sales } = await getDashboardData();
  return <SalesTable initialData={sales} />;
}
