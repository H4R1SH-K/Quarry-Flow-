
'use client';
import { ReminderTable } from "@/components/reminders/reminder-table";
import { useDataStore } from "@/lib/data-store";


export default function RemindersPage() {
  const { reminders } = useDataStore();
  const filteredReminders = reminders.filter(r => r.type !== 'Credit');
  return <ReminderTable initialData={filteredReminders} />;
}
