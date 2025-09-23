
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
import type { Expense } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { saveExpense } from '@/lib/firebase-service';
import { PlusCircle, Pencil } from 'lucide-react';


interface ExpenseFormProps {
    expenseToEdit?: Expense;
    onSave?: () => void;
}

export function ExpenseForm({ expenseToEdit, onSave }: ExpenseFormProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  
  const [category, setCategory] = useState('');
  const [item, setItem] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [vehicle, setVehicle] = useState('');

  useEffect(() => {
    if (isOpen && expenseToEdit) {
      setCategory(expenseToEdit.category);
      setItem(expenseToEdit.item);
      setAmount(String(expenseToEdit.amount));
      setDate(expenseToEdit.date);
      setVehicle(expenseToEdit.vehicle || '');
    } else if (!isOpen) {
        resetForm();
    }
  }, [expenseToEdit, isOpen]);

  const resetForm = () => {
    setCategory('');
    setItem('');
    setAmount('');
    setDate('');
    setVehicle('');
  };

  const handleSave = async () => {
    const id = expenseToEdit ? expenseToEdit.id : String(Date.now());
    const expenseData: Expense = {
      id,
      category,
      item,
      amount: Number(amount),
      date,
      vehicle,
    };
    
    try {
      await saveExpense(expenseData);
      toast({
        title: expenseToEdit ? 'Expense Updated' : 'Expense Added',
        description: `Expense "${item}" has been saved.`,
      });
      onSave?.();
      setIsOpen(false);
    } catch (error) {
       console.error("Failed to save expense:", error);
       toast({
         title: 'Error',
         description: 'Could not save the expense.',
         variant: 'destructive',
       });
    }
  };
  
  const triggerButton = expenseToEdit ? (
    <Button variant="ghost" size="icon">
      <Pencil className="h-4 w-4" />
    </Button>
  ) : (
    <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Expense</Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{triggerButton}</DialogTrigger>
        <DialogContent>
            <DialogHeader>
              <DialogTitle>{expenseToEdit ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
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
              <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
              <Button type="submit" onClick={handleSave}>Save Expense</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}
