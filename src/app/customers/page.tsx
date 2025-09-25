
'use client';
import { CustomerTable } from '@/components/customers/customer-table';
import { useDataStore } from '@/lib/data-store';

export default function CustomersPage() {
  const { customers } = useDataStore();
  return <CustomerTable initialData={customers} />;
}
