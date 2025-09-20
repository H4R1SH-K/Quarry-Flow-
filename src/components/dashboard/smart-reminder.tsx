'use client';

import React from 'react';
import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';
import { createSmartReminder, type FormState } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Bell, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Separator } from '../ui/separator';

const initialState: FormState = {
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? 'Analyzing...' : 'Create Smart Reminder'}
      <Sparkles className="ml-2 h-4 w-4" />
    </Button>
  );
}

export function SmartReminder() {
  const [state, formAction] = useActionState(createSmartReminder, initialState);
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bell className="h-6 w-6" />
          <CardTitle className="font-headline">Smart Reminders</CardTitle>
        </div>
        <CardDescription>
          Use AI to set reminders for permits, insurance, and licenses.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-sm">Upcoming Renewals</h3>
          <div className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between">
              <p>Vehicle Permit - TN 01 AB 1234</p>
              <p className="font-medium text-destructive">5 days</p>
            </div>
            <Separator className="my-2" />
            <div className="flex items-center justify-between">
              <p>General Business Insurance</p>
              <p className="font-medium">28 days</p>
            </div>
          </div>
        </div>

        <form action={formAction} ref={formRef} className="space-y-4">
          <div>
            <Textarea
              name="prompt"
              placeholder="e.g., 'Remind me to renew the insurance for truck TN 01 AB 1234, expiring on December 15th, 2024'"
              className="min-h-[80px]"
            />
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
             <div className="flex-grow w-full">
              {state.message && (
                <Alert variant={state.success ? 'default' : 'destructive'} className={cn(state.success ? 'border-green-500/50 text-green-700' : '')}>
                  {state.success ? <CheckCircle2 className="h-4 w-4"/> : <AlertCircle className="h-4 w-4" />}
                  <AlertTitle className="font-semibold">{state.success ? 'Success' : 'Error'}</AlertTitle>
                  <AlertDescription>{state.message}</AlertDescription>
                </Alert>
              )}
            </div>
            <SubmitButton />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
