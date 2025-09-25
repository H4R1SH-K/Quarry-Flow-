
'use client';

import dynamic from 'next/dynamic';
import { FullPageLoader } from '@/components/ui/full-page-loader';

export const dynamic = 'force-dynamic';

const ExpenseReport = dynamic(
  () => import('@/components/reports/expense-report').then((mod) => mod.ExpenseReport),
  { 
    ssr: false,
    loading: () => <FullPageLoader />
  }
);

export default function ReportsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Reports</h2>
      </div>
      <div className="grid grid-cols-1 gap-4">
        <ExpenseReport />
      </div>
    </div>
  );
}
