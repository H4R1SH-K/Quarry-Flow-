
'use client';

import dynamic from 'next/dynamic';
import { FullPageLoader } from '@/components/ui/full-page-loader';

const ReminderTable = dynamic(
  () => import('@/components/reminders/reminder-table').then((mod) => mod.ReminderTable),
  { 
    ssr: false,
    loading: () => <FullPageLoader />
  }
);

export default function RemindersPage() {
  return <ReminderTable />;
}
