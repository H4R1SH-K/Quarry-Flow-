
import { ExpenseTable } from "@/components/expenses/expense-table";
import { getExpenses } from "@/lib/server/data";

export default async function ExpensesPage() {
  const expenses = await getExpenses();
  return <ExpenseTable initialData={expenses} />;
}
