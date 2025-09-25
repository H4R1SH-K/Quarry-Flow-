
'use client';
import { InvoicingTable } from "@/components/invoicing/invoicing-table";
import { useDataStore } from "@/lib/data-store";

export default function InvoicingPage() {
  const { sales, customers, profile } = useDataStore();

  return <InvoicingTable 
      initialSales={sales} 
      initialCustomers={customers} 
      initialProfile={profile} 
    />;
}
