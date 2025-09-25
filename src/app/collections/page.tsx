
'use client';
import { CollectionsTable } from "@/components/collections/collections-table";
import { useDataStore } from "@/lib/data-store";

export default function CollectionsPage() {
  const { reminders } = useDataStore();
  const collections = reminders.filter(r => r.type === 'Credit');
  return <CollectionsTable initialData={collections} />;
}
