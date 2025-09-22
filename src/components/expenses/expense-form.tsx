
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDataStore } from '@/lib/data-store';
import type { Expense } from '@/lib/types';


interface ExpenseFormProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onFormClose: () => void;
    expense: Expense | null;
    trigger: React.ReactNode;
}

export function ExpenseForm({ isOpen, onOpenChange, onFormClose, expense, trigger }: ExpenseFormProps) {
  const { addExpense, updateExpense } = useDataStore();
  
  const [category, setCategory] = useState('');
  const [item, setItem] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [vehicle, setVehicle] = useState('');

  useEffect(() => {
    if (expense) {
      setCategory(expense.category);
      setItem(expense.item);
      setAmount(String(expense.amount));
      setDate(expense.date);
      setVehicle(expense.vehicle || '');
    } else {
        resetForm();
    }
  }, [expense, isOpen]);

  const resetForm = () => {
    setCategory('');
    setItem('');
    setAmount('');
    setDate('');
    setVehicle('');
  };

  const handleSave = () => {
    if (expense) {
      const updatedExpense: Expense = {
        ...expense,
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
    onFormClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent>
            <DialogHeader>
              <DialogTitle>{expense ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
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
              <DialogClose asChild><Button variant="outline" onClick={onFormClose}>Cancel</Button></DialogClose>
              <Button type="submit" onClick={handleSave}>Save Expense</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}
