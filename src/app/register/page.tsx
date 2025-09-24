
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getFirebaseApp } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const GoogleIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2">
        <title>Google</title>
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.62-4.55 1.62-3.87 0-7.02-3.15-7.02-7.02s3.15-7.02 7.02-7.02c2.2 0 3.68.86 4.54 1.64l2.43-2.43C18.62 3.25 15.9 2 12.48 2c-6.19 0-11.2 5.01-11.2 11.2s5.01 11.2 11.2 11.2c6.5 0 10.74-4.4 10.74-10.92 0-.75-.07-1.42-.2-2.08h-10.54z"/>
    </svg>
);


export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const app = getFirebaseApp();
    if (!app) {
      setError("Firebase is not configured. Please contact support.");
      setIsLoading(false);
      return;
    }

    const auth = getAuth(app);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast({
        title: 'Account Created',
        description: 'You have successfully signed up. Please sign in.',
      });
      router.push('/login'); // Redirect to login page after successful registration
    } catch (err: any) {
      console.error('Sign-up error:', err);
      setError(err.message || 'An unknown error occurred.');
       toast({
        title: 'Sign-Up Error',
        description: err.message || 'An unknown error occurred during sign-up.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

   const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    const app = getFirebaseApp();
    if (!app) {
      setError("Firebase is not configured.");
      setIsGoogleLoading(false);
      return;
    }
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({
        title: 'Account Created',
        description: 'Welcome!',
      });
      router.push('/');
    } catch (err: any) {
       console.error('Google sign-in error:', err);
       setError(err.message || 'An unknown error occurred.');
       toast({
        title: 'Sign-Up Error',
        description: err.message || 'Could not sign up with Google.',
        variant: 'destructive',
      });
    } finally {
        setIsGoogleLoading(false);
    }
  }
  
    const AuthFixInstruction = () => (
        <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Action Required: Enable Sign-in Methods</AlertTitle>
            <AlertDescription>
                <p className='text-xs'>To use these sign-in options, you must enable them in your Firebase project.</p>
                <p className="font-bold my-2 text-xs">Follow these steps:</p>
                <ol className="list-decimal pl-4 mt-2 space-y-1 text-xs">
                    <li>Go to the <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="underline">Firebase Console</a>.</li>
                    <li>Navigate to **Authentication** > **Sign-in method**.</li>
                    <li>Enable the **Email/Password** provider.</li>
                    <li>Enable the **Google** provider.</li>
                </ol>
            </AlertDescription>
        </Alert>
    );

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Create an Account</CardTitle>
          <CardDescription>Enter your details below to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <AuthFixInstruction />
          <form onSubmit={handleSignUp} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
               <div className="relative">
                <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-8"
                />
               </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
               <div className="relative">
                <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-8"
                />
               </div>
                <p className="text-xs text-muted-foreground">Password should be at least 6 characters long.</p>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading || isGoogleLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
          </form>
           <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
           <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading || isGoogleLoading}>
             {isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon />}
              Google
            </Button>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
