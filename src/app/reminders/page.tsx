
import { ReminderTable } from "@/components/reminders/reminder-table";
import { getReminders } from "@/lib/server/data";

export default async function RemindersPage() {
  const reminders = await getReminders();
  const filteredReminders = reminders.filter(r => r.type !== 'Credit');
  return <ReminderTable initialData={filteredReminders} />;
}
