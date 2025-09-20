'use client';

import { useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '../ui/button';
import { Download, Upload, Database } from 'lucide-react';
import { useDataStore } from '@/lib/data-store';
import { useToast } from '@/hooks/use-toast';

export function DataManagement() {
  const { sales, customers, vehicles, expenses, reminders, restoreData } = useDataStore();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBackup = () => {
    const data = {
      sales,
      customers,
      vehicles,
      expenses,
      reminders,
    };
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `quarryflow_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
     toast({
      title: "Backup Successful",
      description: "Your data has been downloaded.",
      variant: "default"
    });
  };

  const handleRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') {
          throw new Error('File is not a valid text file.');
        }
        const data = JSON.parse(text);
        
        // Basic validation
        if (data.sales && data.customers && data.vehicles && data.expenses && data.reminders) {
            restoreData(data);
             toast({
              title: "Restore Successful",
              description: "Your data has been restored from the backup file.",
              variant: "default",
            });
        } else {
             toast({
              title: "Invalid Backup File",
              description: "The selected file is not a valid backup.",
              variant: "destructive",
            });
        }
      } catch (error) {
         toast({
          title: "Restore Failed",
          description: "Could not parse the backup file. Please ensure it's a valid JSON file.",
          variant: "destructive",
        });
        console.error("Restore failed:", error);
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleRestoreClick = () => {
    fileInputRef.current?.click();
  };


  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
            <Database className="h-6 w-6"/>
            <CardTitle className="font-headline">Data Management</CardTitle>
        </div>
        <CardDescription>
          Backup your application data or restore it from a file.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className='text-sm text-muted-foreground'>
            <p>Your data is automatically saved to this browser. Use these options to create a manual backup or restore data on a different device.</p>
        </div>
        <div className="flex flex-col gap-2">
          <Button onClick={handleBackup}>
            <Download className="mr-2 h-4 w-4" />
            Backup Data
          </Button>
          <Button onClick={handleRestoreClick} variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Restore Data
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleRestore}
            className="hidden"
            accept="application/json"
          />
        </div>
      </CardContent>
    </Card>
  );
}
