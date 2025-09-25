
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useDataStore } from "@/lib/data-store";

export function RecentExpenses() {
  const { expenses } = useDataStore();
  const recent = expenses
    .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle className="font-headline">Recent Expenses</CardTitle>
                <CardDescription>Your last 5 expenses.</CardDescription>
            </div>
            <Link href="/expenses" className='text-sm text-primary hover:underline flex items-center'>
              View All <ArrowRight className='h-4 w-4 ml-1'/>
            </Link>
        </div>
      </CardHeader>
      <CardContent>
        {recent.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recent.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{expense.category}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{expense.item}</TableCell>
                  <TableCell>{new Date(expense.date).toLocaleDateString('en-IN')}</TableCell>
                  <TableCell className="text-right">₹{expense.amount.toLocaleString('en-IN')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex justify-center items-center h-48">
            <p className="text-sm text-muted-foreground">No recent expenses.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
