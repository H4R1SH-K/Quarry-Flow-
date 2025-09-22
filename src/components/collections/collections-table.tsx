
'use client';

import { useState } from 'react';
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
import { Banknote, Trash2, Search } from "lucide-react";
import type { Reminder } from '@/lib/types';
import { useDataStore } from '@/lib/data-store';
import { differenceInDays, format, isValid } from 'date-fns';
import { CollectionForm } from './collection-form';

export function CollectionsTable() {
  const { reminders, deleteReminder } = useDataStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  const collections = reminders.filter(r => r.type === 'Credit');

  const handleDelete = (id: string) => {
    deleteReminder(id);
  }
  
  const getDaysLeft = (dueDate: string) => {
    if (!dueDate || !isValid(new Date(dueDate))) return 'N/A';
    const days = differenceInDays(new Date(dueDate), new Date());
    if (days < 0) return <span className="text-destructive">Overdue</span>
    if (days === 0) return <span className="text-destructive">Today</span>
    if (days <= 7) return <span className="text-orange-500">{days} days</span>
    return `${days} days`;
  }

  const filteredCollections = collections.filter(reminder => 
    reminder.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (reminder.relatedToName && reminder.relatedToName.toLowerCase().includes(searchTerm.toLowerCase()))
  );


  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
            <Banknote className="h-6 w-6"/>
            <h2 className="text-3xl font-bold tracking-tight font-headline">Collections</h2>
        </div>
        <CollectionForm />
      </div>
      <Card>
        <CardContent className="pt-6">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search collections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 sm:w-[300px]"
              />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Details</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Time Left</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCollections.length > 0 ? (
                filteredCollections.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).map((reminder) => (
                  <TableRow key={reminder.id}>
                    <TableCell className="max-w-[250px] truncate font-medium">{reminder.details}</TableCell>
                    <TableCell>₹{reminder.amount?.toLocaleString('en-IN') || 'N/A'}</TableCell>
                    <TableCell>{reminder.dueDate && isValid(new Date(reminder.dueDate)) ? format(new Date(reminder.dueDate), 'PPP') : 'N/A'}</TableCell>
                    <TableCell>{getDaysLeft(reminder.dueDate)}</TableCell>
                    <TableCell>{reminder.relatedToName || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={reminder.status === "Pending" ? "destructive" : "default"}>
                        {reminder.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       <CollectionForm reminderToEdit={reminder} />
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
                              This action cannot be undone. This will permanently delete this collection record.
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
