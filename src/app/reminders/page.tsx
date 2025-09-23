
'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { TableSkeleton } from '@/components/ui/table-skeleton';

const ReminderTable = dynamic(
  () => import('@/components/reminders/reminder-table').then((mod) => mod.ReminderTable),
  { 
    ssr: false,
  }
);

export default function RemindersPage() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <ReminderTable />
    </Suspense>
  );
}
