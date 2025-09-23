
'use client';

import dynamic from 'next/dynamic';
import { FullPageLoader } from '@/components/ui/full-page-loader';

const CollectionsTable = dynamic(
  () => import('@/components/collections/collections-table').then((mod) => mod.CollectionsTable),
  { 
    ssr: false,
    loading: () => <FullPageLoader />
  }
);

export default function CollectionsPage() {
  return <CollectionsTable />;
}
