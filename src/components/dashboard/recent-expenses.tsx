
'use client';

import { useState, useEffect, useTransition } from 'react';
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
import { getExpenses } from "@/lib/firebase-service";
import type { Expense } from '@/lib/types';
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

export function RecentExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    startTransition(async () => {
      try {
        const fetchedExpenses = await getExpenses();
        // We only need the 5 most recent for this component
        const recent = fetchedExpenses
          .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5);
        setExpenses(recent);
      } catch (error) {
        toast({
          title: "Error",
          description: "Could not fetch recent expenses.",
          variant: "destructive"
        });
      }
    });
  }, [toast]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle className="font-headline">Recent Expenses</CardTitle>
                <CardDescription>Your last 5 expenses from the cloud.</CardDescription>
            </div>
            <Link href="/expenses" className='text-sm text-primary hover:underline flex items-center'>
              View All <ArrowRight className='h-4 w-4 ml-1'/>
            </Link>
        </div>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : expenses.length > 0 ? (
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
              {expenses.map((expense) => (
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
