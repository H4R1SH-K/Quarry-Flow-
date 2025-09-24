
'use client';

import { useState, useEffect, useTransition } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Profile } from '@/lib/types';
import { getProfile } from '@/lib/firebase-service';
import { ProfileForm } from './profile-form';

export function ProfilePageClient() {
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isPending, startTransition] = useTransition();
  
  useEffect(() => {
    startTransition(async () => {
      try {
        const profileData = await getProfile();
        setProfile(profileData);
      } catch (error) {
        console.error("Failed to fetch profile", error);
        toast({ title: 'Error', description: 'Could not load your profile.', variant: 'destructive' });
      }
    });
  }, [toast]);

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
          <ProfileForm initialData={profile} isPending={isPending} />
        </CardContent>
      </Card>
    </div>
  );
}

