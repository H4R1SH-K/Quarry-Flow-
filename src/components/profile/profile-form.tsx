
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, User, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Profile } from '@/lib/types';
import { useDataStore } from '@/lib/data-store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';


interface ProfileFormProps {
  initialData: Profile | null;
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const { updateProfile } = useDataStore();
  
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
    updateProfile(formData);
    toast({
      title: 'Profile Updated',
      description: 'Your details have been saved.',
    });
    setIsSaving(false);
  };

  return (
    <Tabs defaultValue="personal" className="space-y-4">
      <div className='flex justify-between items-end'>
        <TabsList>
          <TabsTrigger value="personal">
            <User className="mr-2 h-4 w-4" />
            Personal
          </TabsTrigger>
          <TabsTrigger value="company">
            <Building className="mr-2 h-4 w-4" />
            Company
          </TabsTrigger>
        </TabsList>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save All Details
        </Button>
      </div>

      <TabsContent value="personal">
        <Card>
          <CardHeader>
            <CardTitle>Personal Details</CardTitle>
            <CardDescription>
              This information is for your personal identification.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Your Full Name (or Auditor's Name)</Label>
                <Input id="name" placeholder="e.g. John Doe" value={formData.name} onChange={handleChange} disabled={isSaving} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={formData.email} onChange={handleChange} disabled={isSaving} />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="company">
        <Card>
            <CardHeader>
                <CardTitle>Company Details</CardTitle>
                <CardDescription>
                This information will be used for generating reports and other official documents.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input id="companyName" placeholder="e.g. QuarryFlow Inc." value={formData.companyName} onChange={handleChange} disabled={isSaving} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" value={formData.phone} onChange={handleChange} disabled={isSaving} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="address">Company Address</Label>
                    <Textarea id="address" placeholder="Enter your full company address" value={formData.address} onChange={handleChange} disabled={isSaving} />
                </div>
            </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
