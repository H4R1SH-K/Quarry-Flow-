
'use client';

import { useRef, useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Upload, Database, Combine, Cloud, Trash2, LogIn, LogOut } from 'lucide-react';
import { useDataStore } from '@/lib/data-store';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { migrateToFirestore, importToFirestore } from '@/app/settings/actions';
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
} from "@/components/ui/alert-dialog";
import { getFirebaseApp } from '@/lib/firebase';
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, type User } from 'firebase/auth';


export default function SettingsPage() {
    const { sales, customers, vehicles, expenses, reminders, restoreData, importData, clearData } = useDataStore();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const importMode = useRef<'restore' | 'import' | 'import_cloud' | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [firebaseConfigured, setFirebaseConfigured] = useState(false);


    useEffect(() => {
        const app = getFirebaseApp();
        if (app) {
            setFirebaseConfigured(true);
            const auth = getAuth(app);
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                setUser(user);
            });
            return () => unsubscribe();
        } else {
            setFirebaseConfigured(false);
        }
    }, []);

    const handleGoogleSignIn = async () => {
        const app = getFirebaseApp();
        if (!app) return;
        const auth = getAuth(app);
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            toast({
                title: 'Signed In',
                description: 'You have successfully signed in with Google.',
            });
        } catch (error) {
            console.error("Google Sign-In Error:", error);
            toast({
                title: 'Sign-In Failed',
                description: 'Could not sign in with Google. Please try again.',
                variant: 'destructive',
            });
        }
    };

    const handleSignOut = async () => {
        const app = getFirebaseApp();
        if (!app) return;
        const auth = getAuth(app);
        try {
            await signOut(auth);
            toast({
                title: 'Signed Out',
                description: 'You have successfully signed out.',
            });
        } catch (error) {
            console.error("Sign-Out Error:", error);
            toast({
                title: 'Sign-Out Failed',
                description: 'Could not sign out. Please try again.',
                variant: 'destructive',
            });
        }
    };

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
        if (!user) {
            toast({ title: 'Authentication Required', description: 'Please sign in to sync your data.', variant: 'destructive'});
            return;
        }
        const data = { sales, customers, vehicles, expenses, reminders };
        const result = await migrateToFirestore(data);
        if (result.success) {
            toast({
                title: 'Cloud Sync Successful',
                description: result.message,
            });
        } else {
            toast({
                title: 'Cloud Sync Failed',
                description: result.message,
                variant: 'destructive',
            });
        }
    };

    const handleFileSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
                     if (!user) {
                        toast({ title: 'Authentication Required', description: 'Please sign in to import to the cloud.', variant: 'destructive'});
                        return;
                    }
                    const result = await importToFirestore(data);
                    if (result.success) {
                        toast({
                            title: "Cloud Import Successful",
                            description: result.message,
                        });
                    } else {
                         toast({
                            title: "Cloud Import Failed",
                            description: result.message,
                            variant: "destructive",
                        });
                    }
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

    const handleClearData = () => {
        clearData();
        toast({
            title: 'Local Data Cleared',
            description: 'All your local application data has been removed.',
        });
    }

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
                    Backup, restore, import, or clear your application data stored in your browser.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className='text-sm text-muted-foreground'>
                        <p>Your data is automatically saved in your browser. Use these options to manage your data.</p>
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

                        <Button onClick={() => triggerFilePicker('restore')} variant="outline">
                            <Upload className="mr-2 h-4 w-4" />
                            Restore (Overwrite Local)
                        </Button>

                        <Separator className='my-2'/>
                        
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Clear Local Data
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete all your
                                    local application data from this browser.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleClearData}>
                                    Yes, clear all data
                                </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                    <div className='text-xs text-muted-foreground pt-2 space-y-1'>
                        <p><span className='font-semibold'>Import & Merge:</span> Adds new records from a file to your local data.</p>
                        <p><span className='font-semibold'>Restore (Overwrite):</span> Replaces all current local data with the data from a file.</p>
                        <p><span className='font-semibold text-destructive'>Clear Local Data:</span> Erases all data stored in your browser.</p>
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
                     {!firebaseConfigured ? (
                        <div className="text-sm text-destructive-foreground bg-destructive p-3 rounded-md">
                            Firebase is not configured. Cloud features are unavailable. Please add your Firebase configuration to enable them.
                        </div>
                    ) : user ? (
                        <div className="flex flex-col gap-2">
                            <div className="text-sm text-muted-foreground p-3 bg-muted rounded-md flex items-center justify-between">
                                <span>Signed in as {user.displayName || user.email}</span>
                                <Button onClick={handleSignOut} variant="ghost" size="sm"><LogOut className="mr-2 h-4 w-4" /> Sign Out</Button>
                            </div>
                            <Button onClick={handleCloudSync}>
                                <Cloud className="mr-2 h-4 w-4" />
                                Sync to Cloud (One-time)
                            </Button>
                            <Button onClick={() => triggerFilePicker('import_cloud')} variant="outline">
                                <Upload className="mr-2 h-4 w-4" />
                                Import Backup to Cloud
                            </Button>
                            <div className='text-xs text-muted-foreground pt-2'>
                                <p><span className='font-semibold'>Sync to Cloud:</span> Pushes all your current local data to the cloud.</p>
                                <p><span className='font-semibold'>Import Backup to Cloud:</span> Upload a backup file directly to the cloud, merging its content.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            <Button onClick={handleGoogleSignIn}>
                                <LogIn className="mr-2 h-4 w-4" /> Sign in with Google
                            </Button>
                             <div className='text-xs text-muted-foreground pt-2'>
                                <p>Sign in to enable cloud data synchronization and backup.</p>
                            </div>
                        </div>
                    )}
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
