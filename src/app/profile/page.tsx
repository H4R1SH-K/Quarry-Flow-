
import { ProfilePageClient } from "@/components/profile/profile-page-client";
import { getProfile } from "@/lib/server/data";
import { initialState } from "@/lib/sample-data";

export default async function ProfilePage() {
  const profile = await getProfile();
  const initialData = profile || initialState.profile;
  return <ProfilePageClient initialData={initialData} />;
}
