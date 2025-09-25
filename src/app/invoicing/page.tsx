
import { InvoicingTable } from "@/components/invoicing/invoicing-table";
import { getDashboardData, getProfile } from "@/lib/server/data";

export default async function InvoicingPage() {
  // Fetch all required data using the robust getDashboardData function
  const [{ sales, customers }, profile] = await Promise.all([
    getDashboardData(),
    getProfile()
  ]);

  return <InvoicingTable 
      initialSales={sales} 
      initialCustomers={customers} 
      initialProfile={profile} 
    />;
}
