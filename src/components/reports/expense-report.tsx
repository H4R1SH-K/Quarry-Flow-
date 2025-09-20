import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { expenseData } from "@/lib/data";
import { IndianRupee } from "lucide-react";

export function ExpenseReport() {
  const totalExpenses = expenseData.reduce((acc, expense) => {
    return acc + parseInt(expense.amount.replace(/[^0-9]/g, ""));
  }, 0);

  const expensesByCategory = expenseData.reduce((acc, expense) => {
    const category = expense.category;
    const amount = parseInt(expense.amount.replace(/[^0-9]/g, ""));
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += amount;
    return acc;
  }, {} as Record<string, number>);

  const topCategory = Object.entries(expensesByCategory).sort(
    (a, b) => b[1] - a[1]
  )[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Expense Report</CardTitle>
        <CardDescription>
          A summary of your business expenses.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Expenses
              </CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{totalExpenses.toLocaleString("en-IN")}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Top Expense Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{topCategory[0]}</div>
              <p className="text-xs text-muted-foreground">
                ₹{topCategory[1].toLocaleString("en-IN")}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-2">
            <h3 className="text-lg font-semibold">Expense Breakdown</h3>
            <Card>
                <CardContent className="pt-6">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Category</TableHead>
                            <TableHead>Item</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Date</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {expenseData.map((expense) => (
                            <TableRow key={expense.id}>
                            <TableCell className="font-medium">
                                {expense.category}
                            </TableCell>
                            <TableCell>{expense.item}</TableCell>
                            <TableCell>{expense.amount}</TableCell>
                            <TableCell>{expense.date}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
      </CardContent>
    </Card>
  );
}
