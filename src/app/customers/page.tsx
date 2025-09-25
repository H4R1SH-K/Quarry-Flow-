
import { CustomerTable } from '@/components/customers/customer-table';
import { getDashboardData } from '@/lib/server/data';

// This is now a Server Component that fetches data and passes it down.
export default async function CustomersPage() {
  const { customers } = await getDashboardData();
  return <CustomerTable initialData={customers} />;
}
