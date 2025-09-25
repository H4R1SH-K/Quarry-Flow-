
import { ExpenseTable } from "@/components/expenses/expense-table";
import { getDashboardData } from "@/lib/server/data";

export default async function ExpensesPage() {
  const { expenses } = await getDashboardData();
  return <ExpenseTable initialData={expenses} />;
}
