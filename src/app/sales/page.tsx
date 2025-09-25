
import { SalesTable } from "@/components/sales/sales-table";
import { getDashboardData } from "@/lib/server/data";

export default async function SalesPage() {
  const { sales } = await getDashboardData();
  return <SalesTable initialData={sales} />;
}
