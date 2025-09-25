
'use client';
import { ExpenseTable } from "@/components/expenses/expense-table";
import { useDataStore } from "@/lib/data-store";

export default function ExpensesPage() {
  const { expenses } = useDataStore();
  return <ExpenseTable initialData={expenses} />;
}
