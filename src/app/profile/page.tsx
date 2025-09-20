
'use client';

import { useState, useEffect } from 'react';
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
import { User } from 'lucide-react';
import { useDataStore } from '@/lib/data-store';
import { useToast } from '@/hooks/use-toast';
import type { Profile } from '@/lib/types';

export default function ProfilePage() {
  const { profile, updateProfile } = useDataStore();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<Profile>(
    profile || {
      name: '',
      email: '',
      phone: '',
      companyName: '',
      address: '',
    }
  );

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = () => {
    updateProfile(formData);
    toast({
      title: 'Profile Updated',
      description: 'Your personal details have been saved.',
    });
  };

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Personal Details</h2>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-6 w-6" />
            <CardTitle className="font-headline">Your Information</CardTitle>
          </div>
          <CardDescription>
            This information will be used for generating reports and other documents.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={formData.name} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input id="companyName" value={formData.companyName} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" value={formData.phone} onChange={handleChange} />
            </div>
            <div className="col-span-1 space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" value={formData.address} onChange={handleChange} />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSave}>Save Details</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
