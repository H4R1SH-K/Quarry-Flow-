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
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Pencil, Banknote } from "lucide-react";
import type { Reminder } from '@/lib/types';
import { useDataStore } from '@/lib/data-store';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { differenceInDays, format } from 'date-fns';

export function CollectionsTable() {
  const { reminders, addReminder, updateReminder } = useDataStore();
  const [open, setOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);

  const [details, setDetails] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<"Pending" | "Completed">('Pending');
  const [relatedToName, setRelatedToName] = useState('');
  
  const collections = reminders.filter(r => r.type === 'Credit');

  useEffect(() => {
    if (editingReminder) {
      setDetails(editingReminder.details);
      setDueDate(editingReminder.dueDate);
      setStatus(editingReminder.status);
      setRelatedToName(editingReminder.relatedToName || '');
      setOpen(true);
    }
  }, [editingReminder]);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setEditingReminder(null);
      resetForm();
    }
    setOpen(isOpen);
  };
  
  const resetForm = () => {
    setDetails('');
    setDueDate('');
    setStatus('Pending');
    setRelatedToName('');
  };

  const handleSaveReminder = () => {
    const reminderData = {
      type: 'Credit' as const,
      details,
      dueDate,
      status,
      relatedToName,
    };
    if (editingReminder) {
      updateReminder({ ...editingReminder, ...reminderData });
    } else {
      addReminder({ id: String(Date.now()), ...reminderData });
    }
    resetForm();
    setEditingReminder(null);
    setOpen(false);
  };

  const handleEditClick = (reminder: Reminder) => {
    setEditingReminder(reminder);
  };
  
  const getDaysLeft = (dueDate: string) => {
    const days = differenceInDays(new Date(dueDate), new Date());
    if (days < 0) return <span className="text-destructive">Overdue</span>
    if (days === 0) return <span className="text-destructive">Today</span>
    if (days <= 7) return <span className="text-orange-500">{days} days</span>
    return `${days} days`;
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
            <Banknote className="h-6 w-6"/>
            <h2 className="text-3xl font-bold tracking-tight font-headline">Collections</h2>
        </div>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Collection
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingReminder ? 'Edit Collection' : 'Add New Collection'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="details" className="text-right">Details</Label>
                <Textarea id="details" value={details} onChange={(e) => setDetails(e.target.value)} className="col-span-3" />
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
              <Button type="submit" onClick={handleSaveReminder}>Save Collection</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Details</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Time Left</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {collections.length > 0 ? (
                collections.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).map((reminder) => (
                  <TableRow key={reminder.id}>
                    <TableCell className="max-w-[250px] truncate font-medium">{reminder.details}</TableCell>
                    <TableCell>{format(new Date(reminder.dueDate), 'PPP')}</TableCell>
                    <TableCell>{getDaysLeft(reminder.dueDate)}</TableCell>
                    <TableCell>{reminder.relatedToName || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={reminder.status === "Pending" ? "destructive" : "default"}>
                        {reminder.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       <Button variant="ghost" size="icon" onClick={() => handleEditClick(reminder)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No collections found.
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
