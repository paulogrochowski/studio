'use server';

/**
 * @fileOverview This flow validates if an image has a transparent or solid white background.
 *
 * - validateImageBackground - Analyzes the image and returns validation status.
 * - ValidateImageBackgroundInput - The input type for validateImageBackground.
 * - ValidateImageBackgroundOutput - The output type for validateImageBackground.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateImageBackgroundInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "The image to validate, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});

export type ValidateImageBackgroundInput = z.infer<
  typeof ValidateImageBackgroundInputSchema
>;

const ValidateImageBackgroundOutputSchema = z.object({
  hasValidBackground: z
    .boolean()
    .describe(
      'True if the image background is either transparent or solid white. False otherwise.'
    ),
  reasoning: z
    .string()
    .describe(
      'A brief explanation for the validation result. For example, "The image has a transparent background." or "The image has a colored background."'
    ),
});

export type ValidateImageBackgroundOutput = z.infer<
  typeof ValidateImageBackgroundOutputSchema
>;

export async function validateImageBackground(
  input: ValidateImageBackgroundInput
): Promise<ValidateImageBackgroundOutput> {
  return validateImageBackgroundFlow(input);
}

const validateImageBackgroundPrompt = ai.definePrompt({
  name: 'validateImageBackgroundPrompt',
  input: {schema: ValidateImageBackgroundInputSchema},
  output: {schema: ValidateImageBackgroundOutputSchema},
  prompt: `You are an image analysis expert. Your task is to determine if the background of the provided image is either transparent or solid white.

Analyze the following image:
{{media url=imageDataUri}}

Respond with 'hasValidBackground: true' if the background is entirely transparent or solid white.
Respond with 'hasValidBackground: false' if the background has any other colors, gradients, or elements.
Provide a brief reasoning for your decision.`,
});

const validateImageBackgroundFlow = ai.defineFlow(
  {
    name: 'validateImageBackgroundFlow',
    inputSchema: ValidateImageBackgroundInputSchema,
    outputSchema: ValidateImageBackgroundOutputSchema,
  },
  async input => {
    const {output} = await validateImageBackgroundPrompt(input);
    return output!;
  }
);
