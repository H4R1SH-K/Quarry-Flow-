
import { CollectionsTable } from "@/components/collections/collections-table";
import { getReminders } from "@/lib/server/data";
import { initialState } from "@/lib/sample-data";

export default async function CollectionsPage() {
  const reminders = await getReminders();
  const useSampleData = reminders.length === 0;
  const collections = (useSampleData ? initialState.reminders : reminders).filter(r => r.type === 'Credit');
  return <CollectionsTable initialData={collections} />;
}
