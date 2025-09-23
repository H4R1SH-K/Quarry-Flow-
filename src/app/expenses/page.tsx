
'use client';

import dynamic from 'next/dynamic';
import { FullPageLoader } from '@/components/ui/full-page-loader';

const ExpenseTable = dynamic(
  () => import('@/components/expenses/expense-table').then((mod) => mod.ExpenseTable),
  { 
    ssr: false,
    loading: () => <FullPageLoader />
  }
);

export default function ExpensesPage() {
  return <ExpenseTable />;
}
