
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
import { PlusCircle, Pencil, Bell, Trash2, Search } from "lucide-react";
import type { Reminder } from '@/lib/types';
import { useDataStore } from '@/lib/data-store';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { differenceInDays, format, isValid } from 'date-fns';

export function ReminderTable() {
  const { reminders, addReminder, updateReminder, deleteReminder } = useDataStore();
  const [open, setOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [type, setType] = useState<"Vehicle Permit" | "Insurance">("Vehicle Permit");
  const [details, setDetails] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<"Pending" | "Completed">('Pending');
  const [relatedTo, setRelatedTo] = useState<string | undefined>(undefined);
  const [relatedToName, setRelatedToName] = useState('');

  const allReminders = reminders.filter(r => r.type !== 'Credit');

  useEffect(() => {
    if (editingReminder) {
      setType(editingReminder.type as "Vehicle Permit" | "Insurance");
      setDetails(editingReminder.details);
      setDueDate(editingReminder.dueDate);
      setStatus(editingReminder.status);
      setRelatedTo(editingReminder.relatedTo);
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
    setType("Vehicle Permit");
    setDetails('');
    setDueDate('');
    setStatus('Pending');
    setRelatedTo(undefined);
    setRelatedToName('');
  };

  const handleSaveReminder = () => {
    const reminderData = {
      type,
      details,
      dueDate,
      status,
      relatedTo,
      relatedToName,
    };
    if (editingReminder) {
      updateReminder({ ...editingReminder, ...reminderData });
    } else {
      addReminder({ id: String(Date.now()), ...reminderData, type: reminderData.type as any });
    }
    resetForm();
    setEditingReminder(null);
    setOpen(false);
  };

  const handleEditClick = (reminder: Reminder) => {
    setEditingReminder(reminder);
  };

  const handleDelete = (id: string) => {
    deleteReminder(id);
  }
  
  const getRelatedName = (reminder: Reminder) => {
    return reminder.relatedToName || 'N/A';
  }

  const getDaysLeft = (dueDate: string) => {
    if (!dueDate || !isValid(new Date(dueDate))) return 'N/A';
    const days = differenceInDays(new Date(dueDate), new Date());
    if (days < 0) return <span className="text-destructive">Overdue</span>
    if (days === 0) return <span className="text-destructive">Today</span>
    if (days <= 7) return <span className="text-orange-500">{days} days</span>
    return `${days} days`;
  }

  const filteredReminders = allReminders.filter(reminder => 
    reminder.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (reminder.relatedToName && reminder.relatedToName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
            <Bell className="h-6 w-6"/>
            <h2 className="text-3xl font-bold tracking-tight font-headline">Reminders</h2>
        </div>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Reminder
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingReminder ? 'Edit Reminder' : 'Add New Reminder'}</DialogTitle>
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
              <Button type="submit" onClick={handleSaveReminder}>Save Reminder</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardContent className="pt-6">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search reminders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 sm:w-[300px]"
              />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Time Left</TableHead>
                <TableHead>Related To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReminders.length > 0 ? (
                filteredReminders.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).map((reminder) => (
                  <TableRow key={reminder.id}>
                    <TableCell className="font-medium">{reminder.type}</TableCell>
                    <TableCell className="max-w-[250px] truncate">{reminder.details}</TableCell>
                    <TableCell>{reminder.dueDate && isValid(new Date(reminder.dueDate)) ? format(new Date(reminder.dueDate), 'PPP') : 'N/A'}</TableCell>
                    <TableCell>{getDaysLeft(reminder.dueDate)}</TableCell>
                    <TableCell>{getRelatedName(reminder)}</TableCell>
                    <TableCell>
                      <Badge variant={reminder.status === "Pending" ? "destructive" : "default"}>
                        {reminder.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       <Button variant="ghost" size="icon" onClick={() => handleEditClick(reminder)}>
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
                              This action cannot be undone. This will permanently delete this reminder.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(reminder.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No reminders found.
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
