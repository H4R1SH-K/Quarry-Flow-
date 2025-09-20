'use server';

/**
 * @fileOverview This file defines a Genkit flow for setting up smart reminders for permit, insurance, and license expiry dates.
 *
 * - smartReminderSetup - A function that takes a prompt and sets up reminders accordingly.
 * - SmartReminderSetupInput - The input type for the smartReminderSetup function.
 * - SmartReminderSetupOutput - The return type for the smartReminderSetup function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartReminderSetupInputSchema = z.object({
  prompt: z
    .string()
    .describe(
      'A prompt containing the details for setting up reminders, including permit, insurance, and license expiry dates.'
    ),
});
export type SmartReminderSetupInput = z.infer<typeof SmartReminderSetupInputSchema>;

const SmartReminderSetupOutputSchema = z.object({
  success: z.boolean().describe('Whether the reminder setup was successful.'),
  message: z.string().describe('A message indicating the outcome of the reminder setup.'),
});
export type SmartReminderSetupOutput = z.infer<typeof SmartReminderSetupOutputSchema>;

export async function smartReminderSetup(input: SmartReminderSetupInput): Promise<SmartReminderSetupOutput> {
  return smartReminderSetupFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartReminderSetupPrompt',
  input: {schema: SmartReminderSetupInputSchema},
  output: {schema: SmartReminderSetupOutputSchema},
  prompt: `You are a virtual assistant that helps business owners set up reminders for important dates such as permit, insurance, and license expiry dates.

  Based on the provided prompt, extract the necessary information and create reminders accordingly. Return a success status and a message indicating the outcome.

  Prompt: {{{prompt}}}

  Ensure that the reminders are created with appropriate lead times to prevent service disruptions.
  If the prompt asks to extract any information which cannot be extracted, set the success to false.  Otherwise, set success to true.
  Reply with a message indicating whether all reminders could be created or not. Do not implement the reminder creation in the prompt, just set the success to false if information is missing.  The reminder creation will be implemented by the client.`,
});

const smartReminderSetupFlow = ai.defineFlow(
  {
    name: 'smartReminderSetupFlow',
    inputSchema: SmartReminderSetupInputSchema,
    outputSchema: SmartReminderSetupOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
