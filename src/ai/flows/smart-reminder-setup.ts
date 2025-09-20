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
  type: z.enum(["Vehicle Permit", "Insurance", "Credit"]).optional().describe("The type of the reminder."),
  details: z.string().optional().describe("The details of the reminder."),
  dueDate: z.string().optional().describe("The due date for the reminder in YYYY-MM-DD format."),
  relatedTo: z.string().optional().describe("A vehicle number or customer name this reminder is related to."),
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
  prompt: `You are a virtual assistant that helps business owners set up reminders for important dates such as vehicle permits, insurance expiry, and credit collections.

  Based on the provided prompt, extract the necessary information and return it in the output schema.
  - The 'type' should be one of "Vehicle Permit", "Insurance", or "Credit".
  - The 'details' should be a concise description of the reminder.
  - The 'dueDate' must be in YYYY-MM-DD format. Today's date is ${new Date().toISOString().split('T')[0]}.
  - The 'relatedTo' should contain a vehicle registration number or a customer/vendor name if mentioned.
  - Set 'success' to true if you can extract at least a 'type' and 'details'. Otherwise, set it to false.
  - The 'message' should confirm what has been extracted or state what is missing.

  Prompt: {{{prompt}}}

  Example:
  Prompt: "Remind me to renew the insurance for truck TN 01 AB 1234, expiring on December 15th, 2024"
  Output: { type: "Insurance", details: "Renew insurance for truck TN 01 AB 1234", dueDate: "2024-12-15", relatedTo: "TN 01 AB 1234", success: true, message: "Reminder details extracted." }
  
  Example 2:
  Prompt: "Need to collect 5000 from 'Rajesh Kumar' by next Friday."
  Output: { type: "Credit", details: "Collect 5000 from 'Rajesh Kumar'", dueDate: <date for next Friday>, relatedTo: "Rajesh Kumar", success: true, message: "Reminder details extracted." }
  `,
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
