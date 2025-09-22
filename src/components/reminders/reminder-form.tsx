
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


interface ReminderFormProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onFormClose: () => void;
    reminder: Reminder | null;
    trigger: React.ReactNode;
}

export function ReminderForm({ isOpen, onOpenChange, onFormClose, reminder, trigger }: ReminderFormProps) {
  const { addReminder, updateReminder } = useDataStore();
  
  const [type, setType] = useState<"Vehicle Permit" | "Insurance">("Vehicle Permit");
  const [details, setDetails] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<"Pending" | "Completed">('Pending');
  const [relatedTo, setRelatedTo] = useState<string | undefined>(undefined);
  const [relatedToName, setRelatedToName] = useState('');

  useEffect(() => {
    if (reminder) {
      setType(reminder.type as "Vehicle Permit" | "Insurance");
      setDetails(reminder.details);
      setDueDate(reminder.dueDate);
      setStatus(reminder.status);
      setRelatedTo(reminder.relatedTo);
      setRelatedToName(reminder.relatedToName || '');
    } else {
        resetForm();
    }
  }, [reminder, isOpen]);

  const resetForm = () => {
    setType("Vehicle Permit");
    setDetails('');
    setDueDate('');
    setStatus('Pending');
    setRelatedTo(undefined);
    setRelatedToName('');
  };

  const handleSave = () => {
    const reminderData = {
      type,
      details,
      dueDate,
      status,
      relatedTo,
      relatedToName,
    };
    if (reminder) {
      updateReminder({ ...reminder, ...reminderData });
    } else {
      addReminder({ id: String(Date.now()), ...reminderData, type: reminderData.type as any });
    }
    onFormClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent>
            <DialogHeader>
              <DialogTitle>{reminder ? 'Edit Reminder' : 'Add New Reminder'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">Type</Label>
                <Select value={type} onValueChange={(value: "Vehicle Permit" | "Insurance") => setType(value)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Vehicle Permit">Vehicle Permit</SelectItem>
                    <SelectItem value="Insurance">Insurance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="details" className="text-right">Details</Label>
                <Textarea id="details" value={details} onChange={(e) => setDetails(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dueDate" className="text-right">Due Date</Label>
                <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="relatedToName" className="text-right">Vehicle</Label>
                <Input id="relatedToName" value={relatedToName} onChange={(e) => setRelatedToName(e.target.value)} placeholder="Enter vehicle number" className="col-span-3" />
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
              <Button type="submit" onClick={handleSave}>Save Reminder</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}
