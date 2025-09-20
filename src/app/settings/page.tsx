'use client';

import { useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Upload, Database, Combine, Cloud } from 'lucide-react';
import { useDataStore } from '@/lib/data-store';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { migrateToFirestore, importToFirestore } from '@/app/settings/actions';

export default function SettingsPage() {
    const { sales, customers, vehicles, expenses, reminders, restoreData, importData } = useDataStore();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const importMode = useRef<'restore' | 'import' | 'import_cloud' | null>(null);

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
        description: "Your data has been downloaded as a JSON file.",
        });
    };

    const handleCloudSync = async () => {
        try {
            const data = { sales, customers, vehicles, expenses, reminders };
            await migrateToFirestore(data);
            toast({
                title: 'Cloud Sync Successful',
                description: 'Your local data has been synced to the cloud.',
            });
        } catch (error) {
            console.error('Cloud Sync Error:', error);
            toast({
                title: 'Cloud Sync Failed',
                description: 'Could not sync data to the cloud. Please try again.',
                variant: 'destructive',
            });
        }
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
            
            const hasAnyData = ['sales', 'customers', 'vehicles', 'expenses', 'reminders'].some(key => Array.isArray(data[key]));

            if (hasAnyData) {
                if(importMode.current === 'import') {
                    importData(data);
                    toast({
                        title: "Local Import Successful",
                        description: "Your data has been merged from the backup file.",
                    });
                } else if (importMode.current === 'restore') {
                    restoreData(data);
                    toast({
                        title: "Local Restore Successful",
                        description: "Your data has been restored from the backup file.",
                    });
                } else if (importMode.current === 'import_cloud') {
                    await importToFirestore(data);
                     toast({
                        title: "Cloud Import Successful",
                        description: "Backup has been imported to the cloud.",
                    });
                }
            } else {
                toast({
                title: "Invalid Backup File",
                description: "The selected file is not a valid backup.",
                variant: "destructive",
                });
            }
        } catch (error) {
            toast({
            title: "Operation Failed",
            description: "The selected file is not a valid JSON backup or an error occurred.",
            variant: "destructive",
            });
            console.error("Restore/Import failed:", error);
        } finally {
            if(fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            importMode.current = null;
        }
        };
        reader.readAsText(file);
    };

    const triggerFilePicker = (mode: 'restore' | 'import' | 'import_cloud') => {
        importMode.current = mode;
        fileInputRef.current?.click();
    };

    return (
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight font-headline">Settings</h2>
            </div>
            
             <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Database className="h-6 w-6"/>
                        <CardTitle className="font-headline">Local Data Management</CardTitle>
                    </div>
                    <CardDescription>
                    Backup, restore, or import your application data stored in your browser.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className='text-sm text-muted-foreground'>
                        <p>Your data is automatically saved in your browser. Use these options to create a manual backup or restore data from a file.</p>
                    </div>
                    <div className="flex flex-col gap-2">
                    <Button onClick={handleBackup}>
                        <Download className="mr-2 h-4 w-4" />
                        Backup Data
                    </Button>
                    
                    <Separator className='my-2'/>

                    <Button onClick={() => triggerFilePicker('import')} variant="outline">
                        <Combine className="mr-2 h-4 w-4" />
                        Import & Merge Data (Local)
                    </Button>

                    <Button onClick={() => triggerFilePicker('restore')} variant="destructive">
                        <Upload className="mr-2 h-4 w-4" />
                        Restore (Overwrite Local)
                    </Button>
                    </div>
                    <div className='text-xs text-muted-foreground pt-2'>
                        <p><span className='font-semibold'>Import & Merge:</span> Adds new records from a file to your local data.</p>
                        <p><span className='font-semibold'>Restore (Overwrite):</span> Replaces all current local data with the data from a file.</p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Cloud className="h-6 w-6"/>
                        <CardTitle className="font-headline">Cloud Sync</CardTitle>
                    </div>
                    <CardDescription>
                    Sync your data with your Google Account for backup and access across devices.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col gap-2">
                        <Button onClick={handleCloudSync}>
                            <Cloud className="mr-2 h-4 w-4" />
                            Sync to Cloud (One-time)
                        </Button>
                        <Button onClick={() => triggerFilePicker('import_cloud')} variant="outline">
                            <Upload className="mr-2 h-4 w-4" />
                            Import Backup to Cloud
                        </Button>
                    </div>
                     <div className='text-xs text-muted-foreground pt-2'>
                        <p><span className='font-semibold'>Sync to Cloud:</span> Pushes all your current local data to the cloud.</p>
                        <p><span className='font-semibold'>Import Backup to Cloud:</span> Upload a backup file directly to the cloud, merging its content.</p>
                    </div>
                </CardContent>
            </Card>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelected}
                className="hidden"
                accept=".json"
            />
        </div>
    );
}
