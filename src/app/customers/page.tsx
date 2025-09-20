
import dynamic from 'next/dynamic';
import { TableSkeleton } from '@/components/ui/table-skeleton';

const CustomerTable = dynamic(
  () => import('@/components/customers/customer-table').then((mod) => mod.CustomerTable),
  { 
    loading: () => <TableSkeleton /> 
  }
);

export default function CustomersPage() {
  return (
    <CustomerTable />
  );
}
