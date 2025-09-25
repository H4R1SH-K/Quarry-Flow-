
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Trash2, Search, Loader2 } from "lucide-react";
import type { Expense } from '@/lib/types';
import { format, isValid } from 'date-fns';
import { ExpenseForm } from './expense-form';
import { getExpenses, deleteExpenseById } from '@/lib/firebase-service';
import { useToast } from '@/hooks/use-toast';
import { useDebounce } from '@/hooks/use-debounce';
import { Skeleton } from '../ui/skeleton';

interface ExpenseTableProps {
  initialData: Expense[];
}

export function ExpenseTable({ initialData }: ExpenseTableProps) {
  const [expenses, setExpenses] = useState<Expense[]>(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setExpenses(initialData);
  }, [initialData]);

  const fetchExpenses = async () => {
    setIsLoading(true);
    try {
      const expensesData = await getExpenses();
      setExpenses(expensesData);
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
      toast({ title: "Error", description: "Could not fetch expenses.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteExpenseById(id);
      fetchExpenses(); // Refetch
      toast({ title: "Expense Deleted", description: "The expense record has been deleted." });
    } catch (error) {
      console.error("Failed to delete expense:", error);
      toast({ title: "Error", description: "Could not delete the expense record.", variant: "destructive" });
    }
  }

  const filteredExpenses = expenses.filter(expense =>
    expense.category.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    expense.item.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    (expense.vehicle && expense.vehicle.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
  );

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
       <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Expenses</h2>
        <ExpenseForm onSave={fetchExpenses} />
      </div>
      <Card>
        <CardContent className="pt-6">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 sm:w-[300px]"
              />
            </div>
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense) => {
                  return (
                    <TableRow key={expense.id}>
                      <TableCell className="font-medium">{expense.category}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{expense.item}</TableCell>
                      <TableCell>{expense.vehicle || 'N/A'}</TableCell>
                      <TableCell>₹{expense.amount.toLocaleString('en-IN')}</TableCell>
                      <TableCell>
                        {isClient && expense.date && isValid(new Date(expense.date)) ? format(new Date(expense.date), 'PPP') : <Skeleton className="h-4 w-24" />}
                      </TableCell>
                      <TableCell className="text-right">
                        <ExpenseForm expenseToEdit={expense} onSave={fetchExpenses} />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this expense record.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(expense.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No expenses found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
