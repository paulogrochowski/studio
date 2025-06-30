// src/ai/flows/refine-cup-art.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow for refining AI-generated cup art based on user instructions.
 *
 * - refineCupArt - The main function to refine the cup art.
 * - RefineCupArtInput - The input type for the refineCupArt function.
 * - RefineCupArtOutput - The output type for the refineCupArt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RefineCupArtInputSchema = z.object({
  baseImageDataUri: z
    .string()
    .describe(
      "The base image of the cup art to refine, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  refinementInstructions: z.string().describe('Instructions on how to refine the cup art.'),
});
export type RefineCupArtInput = z.infer<typeof RefineCupArtInputSchema>;

const RefineCupArtOutputSchema = z.object({
  refinedImageDataUri: z
    .string()
    .describe(
      "The refined image of the cup art, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type RefineCupArtOutput = z.infer<typeof RefineCupArtOutputSchema>;

export async function refineCupArt(input: RefineCupArtInput): Promise<RefineCupArtOutput> {
  return refineCupArtFlow(input);
}

const prompt = ai.definePrompt({
  name: 'refineCupArtPrompt',
  input: {schema: RefineCupArtInputSchema},
  output: {schema: RefineCupArtOutputSchema},
  prompt: `You are an expert in refining cup art designs based on user feedback.

  The user will provide a base image and instructions on how to refine the image.
  Your goal is to generate a new image that incorporates the user's feedback.

  Base Image: {{media url=baseImageDataUri}}
  Refinement Instructions: {{{refinementInstructions}}}

  Generate a new image of the cup art based on the instructions.  The output should be a data URI.
`,
});

const refineCupArtFlow = ai.defineFlow(
  {
    name: 'refineCupArtFlow',
    inputSchema: RefineCupArtInputSchema,
    outputSchema: RefineCupArtOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: [
        {media: {url: input.baseImageDataUri}},
        {text: input.refinementInstructions},
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    return {refinedImageDataUri: media!.url!};
  }
);
