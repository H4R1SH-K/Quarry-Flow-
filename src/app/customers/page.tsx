
'use client';

import dynamic from 'next/dynamic';

const CustomerTable = dynamic(
  () => import('@/components/customers/customer-table').then((mod) => mod.CustomerTable),
  { ssr: false }
);

export default function CustomersPage() {
  return (
    <CustomerTable />
  );
}
