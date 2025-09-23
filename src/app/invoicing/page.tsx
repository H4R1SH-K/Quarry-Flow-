
'use client';

import dynamic from 'next/dynamic';
import { FullPageLoader } from '@/components/ui/full-page-loader';

const InvoicingTable = dynamic(
  () => import('@/components/invoicing/invoicing-table').then((mod) => mod.InvoicingTable),
  { 
    ssr: false,
    loading: () => <FullPageLoader />
  }
);

export default function InvoicingPage() {
    return <InvoicingTable />;
}
