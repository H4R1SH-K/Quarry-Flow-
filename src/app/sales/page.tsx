
'use client';

import dynamic from 'next/dynamic';
import { FullPageLoader } from '@/components/ui/full-page-loader';

const SalesTable = dynamic(
  () => import('@/components/sales/sales-table').then((mod) => mod.SalesTable),
  { 
    ssr: false,
    loading: () => <FullPageLoader />
  }
);

export default function SalesPage() {
    return <SalesTable />;
}
