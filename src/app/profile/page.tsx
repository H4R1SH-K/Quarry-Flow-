
'use client';
import { ProfilePageClient } from "@/components/profile/profile-page-client";
import { useDataStore } from "@/lib/data-store";

export default function ProfilePage() {
  const { profile } = useDataStore();
  return <ProfilePageClient initialData={profile} />;
}
