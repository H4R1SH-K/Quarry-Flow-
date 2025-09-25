
import { ReminderTable } from "@/components/reminders/reminder-table";
import { getDashboardData } from "@/lib/server/data";

export default async function RemindersPage() {
  const { reminders } = await getDashboardData();
  const filteredReminders = reminders.filter(r => r.type !== 'Credit');
  return <ReminderTable initialData={filteredReminders} />;
}
