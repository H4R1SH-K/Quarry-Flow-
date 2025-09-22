
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
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useDataStore } from '@/lib/data-store';
import type { Reminder } from '@/lib/types';
import { PlusCircle, Pencil } from 'lucide-react';


interface CollectionFormProps {
    reminderToEdit?: Reminder;
}

export function CollectionForm({ reminderToEdit }: CollectionFormProps) {
  const { addReminder, updateReminder } = useDataStore();
  const [isOpen, setIsOpen] = useState(false);
  
  const [details, setDetails] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<"Pending" | "Completed">('Pending');
  const [relatedToName, setRelatedToName] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (isOpen && reminderToEdit) {
      setDetails(reminderToEdit.details);
      setDueDate(reminderToEdit.dueDate);
      setStatus(reminderToEdit.status);
      setRelatedToName(reminderToEdit.relatedToName || '');
      setAmount(reminderToEdit.amount ? String(reminderToEdit.amount) : '');
    } else if (!isOpen) {
        resetForm();
    }
  }, [reminderToEdit, isOpen]);

  const resetForm = () => {
    setDetails('');
    setDueDate('');
    setStatus('Pending');
    setRelatedToName('');
    setAmount('');
  };

  const handleSave = () => {
    const reminderData = {
      type: 'Credit' as const,
      details,
      dueDate,
      status,
      relatedToName,
      amount: Number(amount) || 0,
    };

    if (reminderToEdit) {
      updateReminder({ ...reminderToEdit, ...reminderData });
    } else {
      addReminder({ id: String(Date.now()), ...reminderData });
    }
    setIsOpen(false);
  };

  const triggerButton = reminderToEdit ? (
    <Button variant="ghost" size="icon">
      <Pencil className="h-4 w-4" />
    </Button>
  ) : (
    <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Collection</Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{triggerButton}</DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{reminderToEdit ? 'Edit Collection' : 'Add New Collection'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="details" className="text-right">Details</Label>
                <Textarea id="details" value={details} onChange={(e) => setDetails(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">Amount</Label>
                <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount to collect" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dueDate" className="text-right">Due Date</Label>
                <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="relatedToName" className="text-right">Customer</Label>
                <Input id="relatedToName" value={relatedToName} onChange={(e) => setRelatedToName(e.target.value)} placeholder="Enter customer name" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">Status</Label>
                <Select value={status} onValueChange={(value: "Pending" | "Completed") => setStatus(value)}>
                    <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                </Select>
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                <Button type="submit" onClick={handleSave}>Save Collection</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}
