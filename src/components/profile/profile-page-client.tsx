
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { User } from 'lucide-react';
import type { Profile } from '@/lib/types';
import { ProfileForm } from './profile-form';

interface ProfilePageClientProps {
  initialData: Profile | null;
}

export function ProfilePageClient({ initialData }: ProfilePageClientProps) {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Personal & Company Details</h2>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-6 w-6" />
            <CardTitle className="font-headline">Your Information</CardTitle>
          </div>
          <CardDescription>
            This information will be used for generating reports and other official documents.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm initialData={initialData} />
        </CardContent>
      </Card>
    </div>
  );
}
