
import { InvoicingTable } from "@/components/invoicing/invoicing-table";
import { getSales, getCustomers, getProfile } from "@/lib/server/data";

export default async function InvoicingPage() {
  const [sales, customers, profile] = await Promise.all([
    getSales(),
    getCustomers(),
    getProfile()
  ]);
  return <InvoicingTable initialSales={sales} initialCustomers={customers} initialProfile={profile} />;
}
