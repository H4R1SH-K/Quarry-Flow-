'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '../ui/separator';
import { useDataStore } from '@/lib/data-store';
import { differenceInDays } from 'date-fns';
import { Banknote, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function CreditReminders() {
  const { reminders } = useDataStore();

  const upcomingCollections = reminders
    .filter(r => r.type === 'Credit' && r.status === 'Pending')
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
        {upcomingCollections.length > 0 ? (
          <div className="space-y-4">
            {upcomingCollections.map((reminder, index) => (
              <React.Fragment key={reminder.id}>
                <div className="grid gap-1 text-sm">
                  <div className="font-semibold">{reminder.relatedToName || 'Unknown'}</div>
                  <div className="flex justify-between">
                    <p className="text-muted-foreground truncate max-w-[200px]">{reminder.details}</p>
                    <p className="font-medium">{getDaysLeft(reminder.dueDate)}</p>
                  </div>
                </div>
                {index < upcomingCollections.length - 1 && <Separator />}
              </React.Fragment>
            ))}
             <Link href="/reminders" className='text-sm text-primary hover:underline flex items-center pt-2'>
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
