
import { smartReminderSetup } from '@/ai/flows/smart-reminder-setup';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  prompt: z.string().min(10, { message: 'Prompt must be at least 10 characters long.' }),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const validatedFields = schema.safeParse(body);

  if (!validatedFields.success) {
    return NextResponse.json({
      success: false,
      message: 'Invalid prompt. Please provide more details.',
    }, { status: 400 });
  }

  try {
    const result = await smartReminderSetup({ prompt: validatedFields.data.prompt });
    const responseData = {
        success: result.success,
        message: result.message,
        data: result.success ? {
            type: result.type,
            details: result.details,
            dueDate: result.dueDate,
            relatedToName: result.relatedTo
        } : undefined
    };
    return NextResponse.json(responseData);
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
