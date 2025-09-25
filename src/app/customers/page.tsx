
import { CustomerTable } from '@/components/customers/customer-table';
import { getCustomers } from '@/lib/server/data';
import { initialState } from '@/lib/sample-data';

// This is now a Server Component that fetches data and passes it down.
export default async function CustomersPage() {
  const customers = await getCustomers();
  const useSampleData = customers.length === 0;
  return <CustomerTable initialData={useSampleData ? initialState.customers : customers} />;
}
