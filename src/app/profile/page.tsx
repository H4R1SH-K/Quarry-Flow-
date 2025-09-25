
import { ProfilePageClient } from "@/components/profile/profile-page-client";
import { getProfile } from "@/lib/server/data";

export default async function ProfilePage() {
  const profile = await getProfile();
  return <ProfilePageClient initialData={profile} />;
}
