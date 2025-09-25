
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Profile } from '@/lib/types';
import { saveProfile } from '@/lib/firebase-service';
import { Skeleton } from '../ui/skeleton';

interface ProfileFormProps {
  initialData: Profile | null;
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState<Profile>(initialData || {
      name: '',
      email: '',
      phone: '',
      companyName: '',
      address: '',
    });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

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

  return (
    <div className="space-y-4">
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
    </div>
  );
}
