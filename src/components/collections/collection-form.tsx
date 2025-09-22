
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


interface CollectionFormProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onFormClose: () => void;
    reminder: Reminder | null;
    trigger: React.ReactNode;
}

export function CollectionForm({ isOpen, onOpenChange, onFormClose, reminder, trigger }: CollectionFormProps) {
  const { addReminder, updateReminder } = useDataStore();
  
  const [details, setDetails] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<"Pending" | "Completed">('Pending');
  const [relatedToName, setRelatedToName] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (reminder) {
      setDetails(reminder.details);
      setDueDate(reminder.dueDate);
      setStatus(reminder.status);
      setRelatedToName(reminder.relatedToName || '');
      setAmount(reminder.amount ? String(reminder.amount) : '');
    } else {
        resetForm();
    }
  }, [reminder, isOpen]);

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

    if (reminder) {
      updateReminder({ ...reminder, ...reminderData });
    } else {
      addReminder({ id: String(Date.now()), ...reminderData });
    }
    onFormClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{reminder ? 'Edit Collection' : 'Add New Collection'}</DialogTitle>
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
                <DialogClose asChild><Button variant="outline" onClick={onFormClose}>Cancel</Button></DialogClose>
                <Button type="submit" onClick={handleSave}>Save Collection</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}
