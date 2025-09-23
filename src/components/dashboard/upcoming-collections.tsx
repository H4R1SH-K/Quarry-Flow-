
'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '../ui/separator';
import { differenceInDays, isValid } from 'date-fns';
import { Banknote, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { getReminders } from '@/lib/firebase-service';
import type { Reminder } from '@/lib/types';

export function UpcomingCollections() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      try {
        const remindersData = await getReminders();
        setReminders(remindersData);
      } catch (error) {
        console.error("Failed to fetch collections:", error);
      }
    });
  }, []);

  const upcomingCollections = reminders
    .filter(r => r.type === 'Credit' && r.status === 'Pending' && r.dueDate && isValid(new Date(r.dueDate)))
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);
  
  const getDaysLeft = (dueDate: string) => {
    const days = differenceInDays(new Date(dueDate), new Date());
    if (days < 0) return <span className="font-medium text-destructive">Overdue</span>
    if (days === 0) return <span className="font-medium text-destructive">Today</span>
    if (days <= 7) return <span className="font-medium text-orange-500">{days} days left</span>
    return `${days} days left`;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Banknote className="h-6 w-6" />
          <CardTitle className="font-headline">Upcoming Collections</CardTitle>
        </div>
        <CardDescription>
          Your next three credit collections.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isPending ? (
            <div className="flex justify-center items-center h-48">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        ) : upcomingCollections.length > 0 ? (
          <div className="space-y-4">
            {upcomingCollections.map((reminder, index) => (
              <React.Fragment key={reminder.id}>
                <div className="grid gap-1 text-sm">
                  <div className="flex justify-between">
                    <p className="font-semibold">{reminder.relatedToName || 'Unknown'}</p>
                     {reminder.amount && <p className="font-semibold">₹{reminder.amount.toLocaleString('en-IN')}</p>}
                  </div>
                  <div className="flex justify-between">
                    <p className="text-muted-foreground truncate max-w-[200px]">{reminder.details}</p>
                    <p className="font-medium">{getDaysLeft(reminder.dueDate)}</p>
                  </div>
                </div>
                {index < upcomingCollections.length - 1 && <Separator />}
              </React.Fragment>
            ))}
             <Link href="/collections" className='text-sm text-primary hover:underline flex items-center pt-2'>
              View All Collections <ArrowRight className='h-4 w-4 ml-1'/>
            </Link>
          </div>
        ) : (
          <div className="text-sm text-center text-muted-foreground py-8">
            No pending credit collections.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
