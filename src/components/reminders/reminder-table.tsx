
'use client';

import { useState, useEffect, useTransition } from 'react';
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
import { Bell, Trash2, Search, Loader2 } from "lucide-react";
import type { Reminder } from '@/lib/types';
import { differenceInDays, format, isValid } from 'date-fns';
import { ReminderForm } from './reminder-form';
import { getReminders, deleteReminderById, saveReminder } from '@/lib/firebase-service';
import { useToast } from '@/hooks/use-toast';

export function ReminderTable() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const allReminders = reminders.filter(r => r.type !== 'Credit');

  const fetchReminders = () => {
    startTransition(async () => {
        try {
            const remindersData = await getReminders();
            setReminders(remindersData);
        } catch (error) {
            console.error("Failed to fetch reminders:", error);
            toast({ title: "Error", description: "Could not fetch reminders.", variant: "destructive" });
        }
    });
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleDelete = async (id: string) => {
    try {
        await deleteReminderById(id);
        fetchReminders();
        toast({ title: "Reminder Deleted", description: "The reminder has been deleted." });
    } catch (error) {
        console.error("Failed to delete reminder:", error);
        toast({ title: "Error", description: "Could not delete reminder.", variant: "destructive" });
    }
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
        <ReminderForm onSave={fetchReminders} />
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
          {isPending ? (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
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
                       <ReminderForm reminderToEdit={reminder} onSave={fetchReminders} />
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
