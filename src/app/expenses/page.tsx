
'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { TableSkeleton } from '@/components/ui/table-skeleton';

const ExpenseTable = dynamic(
  () => import('@/components/expenses/expense-table').then((mod) => mod.ExpenseTable),
  { 
    ssr: false,
  }
);

export default function ExpensesPage() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <ExpenseTable />
    </Suspense>
  );
}
