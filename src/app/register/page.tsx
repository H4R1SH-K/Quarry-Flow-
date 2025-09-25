
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirebaseApp } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
        description: 'Welcome! You are now signed in.',
      });
      router.push('/');
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

  const AuthFixInstruction = () => (
      <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Action Required: Enable Sign-in Method</AlertTitle>
          <AlertDescription>
              <p className='text-xs'>To use email & password sign-in, you must enable it in your new Firebase project.</p>
              <p className="font-bold my-2 text-xs">Follow these steps:</p>
              <ol className="list-decimal pl-4 mt-2 space-y-1 text-xs">
                  <li>Go to the <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="underline">Firebase Console</a>.</li>
                  <li>Select your project: **studio-9564969490-82816**.</li>
                  <li>Navigate to **Authentication** > **Sign-in method**.</li>
                  <li>Enable the **Email/Password** provider.</li>
                  <li>
                    Under **Authorized Domains**, ensure `localhost` is listed. If not, add it.
                  </li>
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
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
          </form>
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
