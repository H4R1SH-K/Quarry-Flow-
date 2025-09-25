
'use client';
import { SalesTable } from "@/components/sales/sales-table";
import { useDataStore } from "@/lib/data-store";

export default function SalesPage() {
  const { sales } = useDataStore();
  return <SalesTable initialData={sales} />;
}
