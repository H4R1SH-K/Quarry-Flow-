
import { CustomerTable } from '@/components/customers/customer-table';
import { getCustomers } from '@/lib/server/data';

// This is now a Server Component that fetches data and passes it down.
export default async function CustomersPage() {
  const customers = await getCustomers();
  return <CustomerTable initialData={customers} />;
}
