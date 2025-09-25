
import { InvoicingTable } from "@/components/invoicing/invoicing-table";
import { getSales, getCustomers, getProfile } from "@/lib/server/data";
import { initialState } from "@/lib/sample-data";

export default async function InvoicingPage() {
  const [sales, customers, profile] = await Promise.all([
    getSales(),
    getCustomers(),
    getProfile()
  ]);

  const useSampleData = sales.length === 0 && customers.length === 0;

  return <InvoicingTable 
      initialSales={useSampleData ? initialState.sales : sales} 
      initialCustomers={useSampleData ? initialState.customers : customers} 
      initialProfile={profile} 
    />;
}
