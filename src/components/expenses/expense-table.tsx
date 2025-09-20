
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
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
import { Label } from "@/components/ui/label";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import type { Expense } from '@/lib/types';
import { useDataStore } from '@/lib/data-store';
import { format, isValid } from 'date-fns';

export function ExpenseTable() {
  const { expenses, addExpense, updateExpense, deleteExpense } = useDataStore();
  const [open, setOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const [category, setCategory] = useState('');
  const [item, setItem] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [vehicle, setVehicle] = useState('');

  useEffect(() => {
    if (editingExpense) {
      setCategory(editingExpense.category);
      setItem(editingExpense.item);
      setAmount(String(editingExpense.amount));
      setDate(editingExpense.date);
      setVehicle(editingExpense.vehicle || '');
      setOpen(true);
    }
  }, [editingExpense]);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setEditingExpense(null);
      resetForm();
    }
    setOpen(isOpen);
  };
  
  const resetForm = () => {
    setCategory('');
    setItem('');
    setAmount('');
    setDate('');
    setVehicle('');
  };

  const handleSaveExpense = () => {
    if (editingExpense) {
      const updatedExpense: Expense = {
        ...editingExpense,
        category,
        item,
        amount: Number(amount),
        date,
        vehicle,
      };
      updateExpense(updatedExpense);
    } else {
      const newExpense: Expense = {
        id: String(Date.now()),
        category,
        item,
        amount: Number(amount),
        date,
        vehicle,
      };
      addExpense(newExpense);
    }
    
    resetForm();
    setEditingExpense(null);
    setOpen(false);
  };

  const handleEditClick = (expense: Expense) => {
    setEditingExpense(expense);
  };

  const handleDelete = (id: string) => {
    deleteExpense(id);
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
       <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Expenses</h2>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingExpense ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="item" className="text-right">
                  Item/Description
                </Label>
                <Input id="item" value={item} onChange={(e) => setItem(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Amount
                </Label>
                <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Date
                </Label>
                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="vehicle" className="text-right">
                  Vehicle
                </Label>
                 <Input id="vehicle" value={vehicle} onChange={(e) => setVehicle(e.target.value)} placeholder="e.g. TN 01 AB 1234" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" onClick={handleSaveExpense}>Save Expense</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardContent className="pt-6">
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
              {expenses.length > 0 ? (
                expenses.map((expense) => {
                  return (
                    <TableRow key={expense.id}>
                      <TableCell className="font-medium">{expense.category}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{expense.item}</TableCell>
                      <TableCell>{expense.vehicle || 'N/A'}</TableCell>
                      <TableCell>₹{expense.amount.toLocaleString('en-IN')}</TableCell>
                      <TableCell>{expense.date && isValid(new Date(expense.date)) ? format(new Date(expense.date), 'PPP') : 'N/A'}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEditClick(expense)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
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
        </CardContent>
      </Card>
    </div>
  );
}
