
import { CollectionsTable } from "@/components/collections/collections-table";
import { getReminders } from "@/lib/server/data";

export default async function CollectionsPage() {
  const reminders = await getReminders();
  const collections = reminders.filter(r => r.type === 'Credit');
  return <CollectionsTable initialData={collections} />;
}
