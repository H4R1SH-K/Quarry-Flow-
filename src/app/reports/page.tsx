'use client';

import dynamic from 'next/dynamic';
import { DataManagement } from '@/components/reports/data-management';

const ExpenseReport = dynamic(
  () => import('@/components/reports/expense-report').then((mod) => mod.ExpenseReport),
  { ssr: false }
);

export default function ReportsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Reports</h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <ExpenseReport />
        </div>
        <div className="lg:col-span-1">
          <DataManagement />
        </div>
      </div>
    </div>
  );
}
