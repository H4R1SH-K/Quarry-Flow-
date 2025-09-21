'use client';

import dynamic from 'next/dynamic';
import { TableSkeleton } from '@/components/ui/table-skeleton';

const ExpenseTable = dynamic(
  () => import('@/components/expenses/expense-table').then((mod) => mod.ExpenseTable),
  { 
    loading: () => <TableSkeleton />,
    ssr: false,
  }
);

export default function ExpensesPage() {
  return (
    <ExpenseTable />
  );
}
