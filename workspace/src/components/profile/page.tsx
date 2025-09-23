
'use client';

import { useState, useEffect, useTransition } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Profile } from '@/lib/types';
import { getProfile, saveProfile } from '@/lib/firebase-service';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfilePage() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState<Profile>({
      name: '',
      email: '',
      phone: '',
      companyName: '',
      address: '',
    });

  useEffect(() => {
    startTransition(async () => {
      try {
        const profileData = await getProfile();
        if (profileData) {
          setFormData(profileData);
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
        toast({ title: 'Error', description: 'Could not load your profile.', variant: 'destructive' });
      }
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveProfile(formData);
      toast({
        title: 'Profile Updated',
        description: 'Your personal details have been saved.',
      });
    } catch (error) {
      console.error("Failed to save profile:", error);
      toast({ title: 'Error', description: 'Could not save your profile.', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const ProfileSkeleton = () => (
    <div className="space-y-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-10 w-full" />
          </div>
           <div className="space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="col-span-1 space-y-2 md:col-span-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
        <div className="flex justify-end">
           <Skeleton className="h-10 w-28" />
        </div>
      </div>
  );

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
        <CardContent className="space-y-4">
          {isPending ? <ProfileSkeleton /> : (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Full Name (or Auditor's Name)</Label>
                  <Input id="name" placeholder="e.g. John Doe" value={formData.name} onChange={handleChange} disabled={isSaving} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input id="companyName" placeholder="e.g. QuarryFlow Inc." value={formData.companyName} onChange={handleChange} disabled={isSaving} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" value={formData.email} onChange={handleChange} disabled={isSaving} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" value={formData.phone} onChange={handleChange} disabled={isSaving} />
                </div>
                <div className="col-span-1 space-y-2 md:col-span-2">
                  <Label htmlFor="address">Company Address</Label>
                  <Textarea id="address" placeholder="Enter your full company address" value={formData.address} onChange={handleChange} disabled={isSaving} />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Details
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
