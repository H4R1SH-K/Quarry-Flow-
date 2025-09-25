
import { CollectionsTable } from "@/components/collections/collections-table";
import { getDashboardData } from "@/lib/server/data";

export default async function CollectionsPage() {
  const { reminders } = await getDashboardData();
  const collections = reminders.filter(r => r.type === 'Credit');
  return <CollectionsTable initialData={collections} />;
}
