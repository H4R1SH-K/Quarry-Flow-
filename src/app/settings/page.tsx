
'use client';

import { useRef, useState, useTransition } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Loader2, Trash2, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useDataStore } from '@/lib/data-store';


export default function SettingsPage() {
    const { toast } = useToast();
    const { importData, clearData, ...allData } = useDataStore();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isActionPending, startTransition] = useTransition();

    const handleFileSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = e.target?.result;
            if (typeof text !== 'string') {
                toast({ title: "Error", description: "Could not read the file.", variant: "destructive" });
                return;
            }
            try {
                const data = JSON.parse(text);
                startTransition(() => {
                    importData(data);
                    toast({
                        title: "Import Successful",
                        description: "Your data has been imported from the backup file.",
                    });
                });
            } catch (error) {
                toast({ title: "Invalid File", description: "The selected file is not a valid JSON file.", variant: "destructive" });
            } finally {
                if(fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        };
        reader.readAsText(file);
    };

    const triggerFilePicker = () => {
        fileInputRef.current?.click();
    };

    const handleClearData = () => {
      startTransition(() => {
        clearData();
        toast({ title: 'Local Data Cleared', description: 'Your local application data has been wiped.' });
        window.location.reload();
      });
    }

    const handleBackup = () => {
        startTransition(() => {
            const { sales, customers, vehicles, expenses, reminders, profile, auditLogs } = allData;
            const backupData = { sales, customers, vehicles, expenses, reminders, profile, auditLogs };
            const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'backup.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            toast({ title: 'Backup Successful', description: 'Your local data has been downloaded.' });
        });
    }


    return (
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight font-headline">Settings</h2>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Data Management</CardTitle>
                <CardDescription>
                  Manage your local application data. All data is stored in your browser.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-semibold">Backup Data</h3>
                  <p className='text-sm text-muted-foreground'>
                    Download a complete backup of all your data as a JSON file.
                  </p>
                  <Button 
                    onClick={handleBackup} 
                    variant="outline" 
                    disabled={isActionPending}
                  >
                    {isActionPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="mr-2 h-4 w-4" />
                    )}
                    Backup Local Data
                  </Button>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Import Data</h3>
                  <p className='text-sm text-muted-foreground'>
                    Import a local backup file. This will merge the backup with your existing data without overwriting.
                  </p>
                  <Button 
                    onClick={triggerFilePicker} 
                    variant="outline" 
                    disabled={isActionPending}
                  >
                    {isActionPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="mr-2 h-4 w-4" />
                    )}
                    Import from Backup
                  </Button>
                </div>
                <div className="space-y-2 rounded-lg border border-destructive p-4">
                  <h3 className="font-semibold text-destructive">Clear All Data</h3>
                  <p className='text-sm text-muted-foreground'>
                    Permanently delete all data from this application stored in your browser. This action cannot be undone.
                  </p>
                   <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" disabled={isActionPending}>
                           {isActionPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                           Clear All Data
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action is irreversible. It will permanently delete all your data, including sales, customers, expenses, and settings from your browser.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleClearData} className="bg-destructive hover:bg-destructive/90">
                            Yes, delete everything
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
