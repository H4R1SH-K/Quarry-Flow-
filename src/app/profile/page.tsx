
import { ProfilePageClient } from "@/components/profile/profile-page-client";
import { getDashboardData } from "@/lib/server/data";

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const { profile } = await getDashboardData();
  return <ProfilePageClient initialData={profile} />;
}
