'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { expenseData } from '@/lib/data';
import { IndianRupee, FileDown } from 'lucide-react';
import { Button } from '../ui/button';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export function ExpenseReport() {
  const totalExpenses = expenseData.reduce((acc, expense) => {
    // Ensure amount is a string and remove currency symbols/commas before parsing
    const amount = Number(String(expense.amount).replace(/[^0-9.-]+/g, ''));
    return acc + amount;
  }, 0);

  const expensesByCategory = expenseData.reduce((acc, expense) => {
    const category = expense.category;
    const amount = Number(String(expense.amount).replace(/[^0-9.-]+/g, ''));
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += amount;
    return acc;
  }, {} as Record<string, number>);

  const topCategory =
    Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1])[0] || ['N/A', 0];

  const handleExport = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text('Expense Report', 15, 20);

    doc.setFontSize(12);
    doc.text(`Total Expenses: ₹${totalExpenses.toLocaleString('en-IN')}`, 15, 30);
    doc.text(`Top Expense Category: ${topCategory[0]} (₹${topCategory[1].toLocaleString('en-IN')})`, 15, 38);

    (doc as any).autoTable({
      startY: 45,
      head: [['Category', 'Item', 'Amount', 'Date']],
      body: expenseData.map(e => [e.category, e.item, e.amount, e.date]),
    });

    doc.save('expense-report.pdf');
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-headline">Expense Report</CardTitle>
          <CardDescription>A summary of your business expenses.</CardDescription>
        </div>
        <Button onClick={handleExport}>
          <FileDown className="mr-2 h-4 w-4" />
          Export as PDF
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{totalExpenses.toLocaleString('en-IN')}
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
                ₹{topCategory[1].toLocaleString('en-IN')}
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
                  {expenseData.map(expense => (
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
