
import { ExpenseTable } from "@/components/expenses/expense-table";
import { getExpenses } from "@/lib/server/data";
import { initialState } from "@/lib/sample-data";

export default async function ExpensesPage() {
  const expenses = await getExpenses();
  const useSampleData = expenses.length === 0;
  return <ExpenseTable initialData={useSampleData ? initialState.expenses : expenses} />;
}
