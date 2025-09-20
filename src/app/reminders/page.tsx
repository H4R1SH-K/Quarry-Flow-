
import dynamic from 'next/dynamic';
import { TableSkeleton } from '@/components/ui/table-skeleton';

const ReminderTable = dynamic(
  () => import('@/components/reminders/reminder-table').then((mod) => mod.ReminderTable),
  { 
    loading: () => <TableSkeleton />
  }
);

export default function RemindersPage() {
  return (
    <ReminderTable />
  );
}
