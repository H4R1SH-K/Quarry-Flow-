
import { SalesTable } from "@/components/sales/sales-table";
import { getSales } from "@/lib/server/data";

export default async function SalesPage() {
  const sales = await getSales();
  return <SalesTable initialData={sales} />;
}
