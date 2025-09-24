
'use client';

import dynamic from 'next/dynamic';
import { FullPageLoader } from '@/components/ui/full-page-loader';

// The profile page requires client-side interaction for form input and data fetching.
// We make it a client component and dynamically import the form to handle state.
const ProfilePageClient = dynamic(
  () => import('@/components/profile/profile-page-client').then((mod) => mod.ProfilePageClient),
  { 
    ssr: false, 
    loading: () => <FullPageLoader /> 
  }
);

export default function ProfilePage() {
  return <ProfilePageClient />;
}
