'use server';

import { smartReminderSetup } from '@/ai/flows/smart-reminder-setup';
import { z } from 'zod';
import { type Reminder } from '@/lib/types';

const schema = z.object({
  prompt: z.string().min(10, { message: 'Prompt must be at least 10 characters long.' }),
});

export interface FormState {
  message: string;
  success?: boolean;
  data?: Partial<Reminder> & { relatedToName?: string };
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
    if (result.success && result.type) {
      return {
        success: true,
        message: result.message,
        data: {
          type: result.type,
          details: result.details,
          dueDate: result.dueDate,
          relatedToName: result.relatedTo
        }
      }
    }
    return {
      success: result.success,
      message: result.message,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    };
  }
}
