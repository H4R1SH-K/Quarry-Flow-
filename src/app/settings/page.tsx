
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
import { Upload, Cloud, LogIn, LogOut, Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { importToFirestore } from '@/app/settings/actions';
import { getFirebaseApp } from '@/lib/firebase';
import { getAuth, onAuthStateChanged, signInWithRedirect, GoogleAuthProvider, signOut, type User } from 'firebase/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';


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
                 if (currentUser) {
                    toast({
                        title: 'Signed In',
                        description: `Welcome, ${currentUser.displayName || currentUser.email}.`,
                    });
                }
            }, (error) => {
                console.error("Auth State Error:", error);
                setIsAuthLoading(false);
            });

            return () => unsubscribe();
        } else {
            setFirebaseConfigured(false);
            setIsAuthLoading(false);
        }
    }, [toast]);

    const handleGoogleSignIn = async () => {
        const app = getFirebaseApp();
        if (!app) {
            toast({
                title: 'Firebase Not Configured',
                description: 'Cannot sign in because Firebase is not configured.',
                variant: 'destructive',
            });
            return;
        }
        const auth = getAuth(app);
        const provider = new GoogleAuthProvider();
        
        setIsAuthLoading(true);
        try {
            await signInWithRedirect(auth, provider);
            // The onAuthStateChanged listener will handle the result.
        } catch (error: any) {
            setIsAuthLoading(false);
            console.error('Sign-in redirect error:', error);
            if(error.code === 'auth/unauthorized-domain') {
                 toast({
                    title: 'Sign-In Failed: Domain Not Authorized',
                    description: 'Please authorize localhost in your Firebase project settings and then do a hard refresh (Cmd+Shift+R).',
                    variant: 'destructive',
                    duration: 10000,
                });
            } else {
                toast({
                    title: 'Sign-In Error',
                    description: error.message || 'An unknown error occurred during sign-in.',
                    variant: 'destructive',
                });
            }
        }
    };

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
    
    const AuthFixInstruction = () => (
        <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Action Required to Enable Login</AlertTitle>
            <AlertDescription>
                To use Google Sign-In, you must authorize `localhost` in your Firebase project.
                <ol className="list-decimal pl-5 mt-2 space-y-1">
                    <li>Go to the <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="font-bold underline">Firebase Console</a> and select your project.</li>
                    <li>Navigate to **Authentication** {'>'} **Settings** {'>'} **Authorized domains**.</li>
                    <li>Click **Add domain** and enter `localhost`.</li>
                </ol>
                <p className="mt-2">After adding the domain, please do a **hard refresh** of this page (Cmd+Shift+R or Ctrl+Shift+R) and try again.</p>
            </AlertDescription>
        </Alert>
    );

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
                <div className="flex items-center justify-center h-24">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="ml-2">Authenticating...</span>
                </div>
            )
        }
        if (user) {
             return (
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <span>Signed in as {user.displayName || user.email}</span>
                    <Button onClick={handleSignOut} variant="ghost" size="sm" disabled={isActionPending}><LogOut className="mr-2 h-4 w-4" /> Sign Out</Button>
                </div>
            )
        }
        return (
            <div className="flex flex-col gap-4">
                <AuthFixInstruction />
                <Button onClick={handleGoogleSignIn} disabled={isAuthLoading || !firebaseConfigured}>
                    {isAuthLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
                     Sign in with Google
                </Button>
                 <div className='text-xs text-muted-foreground'>
                    <p>Sign in to enable cloud data synchronization, offline access, and backup.</p>
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
                      <CardTitle className="font-headline">Cloud Features</CardTitle>
                    </div>
                    <CardDescription>
                      Sign in with your Google Account to enable cloud sync, backup, and multi-device access.
                    </CardDescription>
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
