
'use client';

import { useRef, useState, useEffect, useTransition } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Cloud, Loader2, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { importToFirestore } from '@/app/settings/actions';
import { getFirebaseApp } from '@/lib/firebase';
import { 
    getAuth, 
    onAuthStateChanged, 
    signOut, 
    type User,
} from 'firebase/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from 'next/link';


export default function SettingsPage() {
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const importMode = useRef<'import_cloud' | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [firebaseConfigured, setFirebaseConfigured] = useState(false);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const [isActionPending, startTransition] = useTransition();

    useEffect(() => {
        const app = getFirebaseApp();
        if (app) {
            setFirebaseConfigured(true);
            const auth = getAuth(app);
            const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
                setUser(currentUser);
                setIsAuthLoading(false);
            }, (error) => {
                console.error("Auth State Error:", error);
                setIsAuthLoading(false);
            });

            return () => unsubscribe();
        } else {
            setFirebaseConfigured(false);
            setIsAuthLoading(false);
        }
    }, []);

    const handleSignOut = async () => {
        const app = getFirebaseApp();
        if (!app) return;
        const auth = getAuth(app);
        try {
            await signOut(auth);
            setUser(null);
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

                if (importMode.current === 'import_cloud') {
                    if (!user) {
                        toast({ title: 'Authentication Required', description: 'Please sign in to import to the cloud.', variant: 'destructive'});
                        return;
                    }
                    startTransition(async () => {
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
                    });
                }
            } catch (error) {
                toast({ title: "Invalid File", description: "The selected file is not a valid JSON file.", variant: "destructive" });
            } finally {
                if(fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                importMode.current = null;
            }
        };
        reader.readAsText(file);
    };

    const triggerFilePicker = (mode: 'import_cloud') => {
        importMode.current = mode;
        fileInputRef.current?.click();
    };

    const AuthContent = () => {
        if (!firebaseConfigured) {
            return (
                <div className="text-sm text-destructive-foreground bg-destructive p-3 rounded-md">
                    Firebase is not configured. Cloud features are unavailable. Please add your Firebase configuration to enable them.
                </div>
            )
        }
        if (isAuthLoading) {
             return (
                <div className="flex items-center justify-center h-48">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="ml-2">Please wait...</span>
                </div>
            )
        }
        if (user) {
             return (
                <div className="flex flex-col items-start gap-4 p-4 bg-muted rounded-lg">
                    <p>Signed in as <span className="font-semibold">{user.email}</span>.</p>
                    <Button onClick={handleSignOut} variant="ghost" disabled={isActionPending}><LogOut className="mr-2 h-4 w-4" /> Sign Out</Button>
                </div>
            )
        }
        return (
            <div className="flex flex-col gap-4">
                <p>Sign in to enable cloud sync, backup, and multi-device access.</p>
                <div className="flex gap-2">
                    <Button asChild>
                        <Link href="/login">Sign In</Link>
                    </Button>
                    <Button asChild variant="secondary">
                        <Link href="/register">Create Account</Link>
                    </Button>
                </div>
            </div>
        )
    };

    return (
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight font-headline">Settings</h2>
            </div>
            
            <Tabs defaultValue="cloud" className="space-y-4">
              <TabsList>
                <TabsTrigger value="cloud">Cloud & Authentication</TabsTrigger>
                <TabsTrigger value="data">Data Management</TabsTrigger>
              </TabsList>
              
              <TabsContent value="cloud">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Cloud className="h-6 w-6"/>
                      <CardTitle className="font-headline">Cloud Status</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <AuthContent />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="data">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-headline">Data Management</CardTitle>
                    <CardDescription>
                      Manage your application data.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="font-semibold">Import to Cloud</h3>
                      <p className='text-sm text-muted-foreground'>
                        Import a local backup file directly to the cloud. This will merge the backup with your existing cloud data without overwriting.
                      </p>
                      <Button 
                        onClick={() => triggerFilePicker('import_cloud')} 
                        variant="outline" 
                        disabled={isActionPending || !user}
                      >
                        {isActionPending && importMode.current === 'import_cloud' ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="mr-2 h-4 w-4" />
                        )}
                        Import Backup to Cloud
                      </Button>
                      {!user && <p className="text-xs text-destructive">Please sign in to import data to the cloud.</p>}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

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
