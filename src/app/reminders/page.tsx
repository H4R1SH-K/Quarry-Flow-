
import { ReminderTable } from "@/components/reminders/reminder-table";
import { getReminders } from "@/lib/server/data";
import { initialState } from "@/lib/sample-data";

export default async function RemindersPage() {
  const reminders = await getReminders();
  const useSampleData = reminders.length === 0;
  const filteredReminders = (useSampleData ? initialState.reminders : reminders).filter(r => r.type !== 'Credit');
  return <ReminderTable initialData={filteredReminders} />;
}
