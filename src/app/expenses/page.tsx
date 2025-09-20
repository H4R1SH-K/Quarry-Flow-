
'use client';

import dynamic from 'next/dynamic';

const ExpenseTable = dynamic(
  () => import('@/components/expenses/expense-table').then((mod) => mod.ExpenseTable),
  { ssr: false }
);

export default function ExpensesPage() {
  return (
    <ExpenseTable />
  );
}
