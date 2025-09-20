'use client';

import { useRef, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '../ui/button';
import { Download, Upload, Database, Combine, ArrowRight } from 'lucide-react';
import { useDataStore } from '@/lib/data-store';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '../ui/separator';
import { migrateToFirestore, importToFirestore } from '@/lib/firestore';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

export function DataManagement() {
  const { sales, customers, vehicles, expenses, reminders } = useDataStore();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMigrating, setIsMigrating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

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
      description: "Your local data has been downloaded as a JSON file.",
    });
  };

  const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') {
          throw new Error("Could not read the file.");
        }
        const data = JSON.parse(text);
        
        setIsImporting(true);
        await importToFirestore(data);

        toast({
          title: "Import Successful",
          description: "Your data has been imported to Firestore from the JSON file.",
        });

      } catch (error) {
         toast({
          title: "Import Failed",
          description: "The selected file is not a valid JSON backup or an error occurred during import.",
          variant: "destructive",
        });
        console.error("Import failed:", error);
      } finally {
         if(fileInputRef.current) {
            fileInputRef.current.value = '';
         }
         setIsImporting(false);
      }
    };
    reader.readAsText(file);
  };

  const triggerFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleMigration = async () => {
    setIsMigrating(true);
    try {
        const data = { sales, customers, vehicles, expenses, reminders };
        await migrateToFirestore(data);
        toast({
            title: "Migration Successful",
            description: "Your local data has been migrated to Firestore.",
        });
    } catch (error) {
        toast({
            title: "Migration Failed",
            description: "An error occurred while migrating your data to Firestore.",
            variant: "destructive",
        });
        console.error("Migration failed:", error);
    } finally {
        setIsMigrating(false);
    }
  }


  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
            <Database className="h-6 w-6"/>
            <CardTitle className="font-headline">Data Management</CardTitle>
        </div>
        <CardDescription>
          Migrate, backup, or import your application data to Firestore.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
            <AlertTitle className='font-semibold'>Move to the Cloud</AlertTitle>
            <AlertDescription>
                Migrate your data from local browser storage to Firestore for a more permanent and secure solution. Once migrated, your app will work with cloud data.
            </AlertDescription>
        </Alert>

        <Card className='p-4'>
            <CardTitle className='text-lg font-headline mb-2'>Migrate to Firestore</CardTitle>
            <CardDescription className='mb-4'>
                Click the button below to move all your existing local data (customers, sales, etc.) to Firestore. This is a one-time process.
            </CardDescription>
            <Button onClick={handleMigration} disabled={isMigrating}>
                {isMigrating ? 'Migrating...' : 'Migrate Local Data to Firestore'}
                <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </Card>

         <Card className='p-4'>
            <CardTitle className='text-lg font-headline mb-2'>Import & Backup</CardTitle>
            <div className="flex flex-col gap-4">
                <div>
                    <p className='text-sm text-muted-foreground mb-2'>Import new records into Firestore from a JSON backup file.</p>
                     <Button onClick={triggerFilePicker} variant="outline" disabled={isImporting}>
                        {isImporting ? 'Importing...' : 'Import from JSON to Firestore'}
                        <Upload className="ml-2 h-4 w-4" />
                    </Button>
                </div>
                <Separator />
                <div>
                    <p className='text-sm text-muted-foreground mb-2'>Create a backup of your current local data. This is useful before migrating.</p>
                     <Button onClick={handleBackup} variant='secondary'>
                        <Download className="mr-2 h-4 w-4" />
                        Backup Local Data
                    </Button>
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelected}
                    className="hidden"
                    accept=".json"
                />
            </div>
        </Card>

      </CardContent>
    </Card>
  );
}
