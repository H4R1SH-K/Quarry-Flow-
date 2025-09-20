
'use client';

import dynamic from 'next/dynamic';

const ReminderTable = dynamic(
  () => import('@/components/reminders/reminder-table').then((mod) => mod.ReminderTable),
  { ssr: false }
);

export default function RemindersPage() {
  return (
    <ReminderTable />
  );
}
