
'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Bell, Sparkles, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Separator } from '../ui/separator';
import { differenceInDays, isValid } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import type { Reminder } from '@/lib/types';
import Link from 'next/link';
import { getReminders, saveReminder } from '@/lib/firebase-service';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';

export default function SmartReminder() {
  const formRef = React.useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isFetching, startFetching] = useTransition();

  const [isAnalyzing, startTransition] = useTransition();
  const [state, setState] = useState<{ message: string; success?: boolean; data?: any; }>({ message: '' });
  const [prompt, setPrompt] = useState('');

  const [open, setOpen] = React.useState(false);
  const [editingReminder, setEditingReminder] = React.useState<Reminder | null>(null);

  const [type, setType] = React.useState<"Vehicle Permit" | "Insurance">("Vehicle Permit");
  const [details, setDetails] = React.useState('');
  const [dueDate, setDueDate] = React.useState('');
  const [status, setStatus] = React.useState<"Pending" | "Completed">('Pending');
  const [relatedTo, setRelatedTo] = React.useState<string | undefined>(undefined);
  const [relatedToName, setRelatedToName] = React.useState('');

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const fetchReminders = () => {
    startFetching(async () => {
      try {
        const remindersData = await getReminders();
        setReminders(remindersData);
      } catch (error) {
        console.error("Failed to fetch reminders:", error);
      }
    });
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(async () => {
      try {
        const response = await fetch('/api/smart-reminder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt }),
        });
        const result = await response.json();
        
        setState(result);

        if (result.success && result.data && result.data.type !== 'Credit') {
          formRef.current?.reset();
          setPrompt('');
          setType(result.data.type as "Vehicle Permit" | "Insurance" || "Vehicle Permit");
          setDetails(result.data.details || '');
          setDueDate(result.data.dueDate || '');
          setRelatedToName(result.data.relatedToName || '');
          setOpen(true);
        }
      } catch (error) {
        console.error(error);
        setState({ success: false, message: 'An unexpected error occurred. Please try again.' });
      }
    });
  }

  React.useEffect(() => {
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

  const handleSaveReminder = async () => {
    const id = editingReminder?.id || String(Date.now());
    const reminderData: Reminder = { id, type, details, dueDate, status, relatedTo, relatedToName };
    
    try {
        await saveReminder(reminderData);
        toast({ title: editingReminder ? 'Reminder Updated' : 'Reminder Created', description: `Reminder "${details}" has been saved.` });
        fetchReminders();
        resetForm();
        setEditingReminder(null);
        setOpen(false);
    } catch(error) {
        toast({ title: 'Error', description: 'Could not save the reminder.', variant: 'destructive'});
    }
  };

  const upcomingRenewals = reminders
    .filter(r => r.status === 'Pending' && (r.type === 'Vehicle Permit' || r.type === 'Insurance') && r.dueDate && isValid(new Date(r.dueDate)))
    .sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 2);

  const getDaysLeft = (dueDate: string) => {
    if (!dueDate || !isValid(new Date(dueDate))) return null;
    const days = differenceInDays(new Date(dueDate), new Date());
    if (days < 0) return <span className="font-medium text-destructive">Overdue</span>
    if (days === 0) return <span className="font-medium text-destructive">Today</span>
    if (days <= 7) return <span className="font-medium text-orange-500">{days} days</span>
    return `${days} days`;
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bell className="h-6 w-6" />
          <CardTitle className="font-headline">Smart Reminders</CardTitle>
        </div>
        <CardDescription>
          Use AI to set reminders for permits and insurance.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 flex-grow flex flex-col">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-sm">Upcoming Renewals</h3>
            <Link href="/reminders" className='text-sm text-primary hover:underline flex items-center'>
              View All <ArrowRight className='h-4 w-4 ml-1'/>
            </Link>
          </div>
           {isFetching ? (
             <div className="text-sm text-center text-muted-foreground p-3 bg-muted/50 rounded-lg h-12 flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin"/>
             </div>
           ) : upcomingRenewals.length > 0 ? (
            <div className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg space-y-2">
              {upcomingRenewals.map((reminder, index) => (
                <React.Fragment key={reminder.id}>
                  <div className="flex items-center justify-between">
                    <p className='truncate max-w-[200px]'>{reminder.details}</p>
                    {isClient ? getDaysLeft(reminder.dueDate) : <Skeleton className="h-4 w-16" />}
                  </div>
                  {index < upcomingRenewals.length - 1 && <Separator />}
                </React.Fragment>
              ))}
            </div>
           ) : (
             <div className="text-sm text-center text-muted-foreground p-3 bg-muted/50 rounded-lg">
                No pending renewals.
             </div>
           )}
        </div>

        <form onSubmit={handleFormSubmit} ref={formRef} className="space-y-4 mt-auto">
          <div>
            <Textarea
              name="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., 'Remind me to renew insurance for TN 01 AB 1234, expiring on Dec 15, 2024'"
              className="min-h-[80px]"
            />
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
             <div className="flex-grow w-full">
              {state.message && !state.success && (
                <Alert variant={state.success ? 'default' : 'destructive'} className={cn(state.success ? 'border-green-500/50 text-green-700' : '')}>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle className="font-semibold">Error</AlertTitle>
                  <AlertDescription>{state.message}</AlertDescription>
                </Alert>
              )}
            </div>
             <Button type="submit" disabled={isAnalyzing} className="w-full sm:w-auto">
              {isAnalyzing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</> : 'Create Smart Reminder'}
              {!isAnalyzing && <Sparkles className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </form>
         <Dialog open={open} onOpenChange={handleOpenChange}>
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
      </CardContent>
    </Card>
  );
}
