
import { InvoicingTable } from "@/components/invoicing/invoicing-table";
import { getDashboardData } from "@/lib/server/data";

export const dynamic = 'force-dynamic';

export default async function InvoicingPage() {
  // Fetch all required data using the robust getDashboardData function
  const { sales, customers, profile } = await getDashboardData();

  return <InvoicingTable 
      initialSales={sales} 
      initialCustomers={customers} 
      initialProfile={profile} 
    />;
}
