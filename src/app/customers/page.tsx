
'use client';

import dynamic from 'next/dynamic';
import { FullPageLoader } from '@/components/ui/full-page-loader';

const CustomerTable = dynamic(
  () => import('@/components/customers/customer-table').then((mod) => mod.CustomerTable),
  { 
    ssr: false, 
    loading: () => <FullPageLoader />
  }
);

export default function CustomersPage() {
  return <CustomerTable />;
}
