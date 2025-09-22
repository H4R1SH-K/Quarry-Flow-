
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


interface ReminderFormProps {
    reminderToEdit?: Reminder;
}

export function ReminderForm({ reminderToEdit }: ReminderFormProps) {
  const { addReminder, updateReminder } = useDataStore();
  const [isOpen, setIsOpen] = useState(false);
  
  const [type, setType] = useState<"Vehicle Permit" | "Insurance">("Vehicle Permit");
  const [details, setDetails] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<"Pending" | "Completed">('Pending');
  const [relatedTo, setRelatedTo] = useState<string | undefined>(undefined);
  const [relatedToName, setRelatedToName] = useState('');

  useEffect(() => {
    if (isOpen && reminderToEdit) {
      setType(reminderToEdit.type as "Vehicle Permit" | "Insurance");
      setDetails(reminderToEdit.details);
      setDueDate(reminderToEdit.dueDate);
      setStatus(reminderToEdit.status);
      setRelatedTo(reminderToEdit.relatedTo);
      setRelatedToName(reminderToEdit.relatedToName || '');
    } else if (!isOpen) {
        resetForm();
    }
  }, [reminderToEdit, isOpen]);

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
    if (reminderToEdit) {
      updateReminder({ ...reminderToEdit, ...reminderData });
    } else {
      addReminder({ id: String(Date.now()), ...reminderData, type: reminderData.type as any });
    }
    setIsOpen(false);
  };
  
  const triggerButton = reminderToEdit ? (
    <Button variant="ghost" size="icon">
      <Pencil className="h-4 w-4" />
    </Button>
  ) : (
    <Button><PlusCircle className="mr-2 h-4 w-4" />Add Reminder</Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{triggerButton}</DialogTrigger>
        <DialogContent>
            <DialogHeader>
              <DialogTitle>{reminderToEdit ? 'Edit Reminder' : 'Add New Reminder'}</DialogTitle>
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
              <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
              <Button type="submit" onClick={handleSave}>Save Reminder</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}
