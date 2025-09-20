import { ExpenseReport } from "@/components/reports/expense-report";

export default function ReportsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <h2 className="text-3xl font-bold tracking-tight font-headline">Reports</h2>
      <ExpenseReport />
    </div>
  );
}
