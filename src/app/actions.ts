'use server';

import { smartReminderSetup } from '@/ai/flows/smart-reminder-setup';
import { z } from 'zod';

const schema = z.object({
  prompt: z.string().min(10, { message: 'Prompt must be at least 10 characters long.' }),
});

export interface FormState {
  message: string;
  success?: boolean;
}

export async function createSmartReminder(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = schema.safeParse({
    prompt: formData.get('prompt'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Invalid prompt. Please provide more details.',
    };
  }

  try {
    const result = await smartReminderSetup({ prompt: validatedFields.data.prompt });
    return {
      success: result.success,
      message: result.message,
    };
  } catch (error) {
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    };
  }
}
