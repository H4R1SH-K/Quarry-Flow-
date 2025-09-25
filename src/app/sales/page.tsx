
import { SalesTable } from "@/components/sales/sales-table";
import { getSales } from "@/lib/server/data";
import { initialState } from "@/lib/sample-data";

export default async function SalesPage() {
  const sales = await getSales();
  const useSampleData = sales.length === 0;
  return <SalesTable initialData={useSampleData ? initialState.sales : sales} />;
}
