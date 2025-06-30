'use server';
/**
 * @fileOverview This file defines a Genkit flow for editing an image based on user instructions.
 *
 * - editImage - The main function to edit an image.
 * - EditImageInput - The input type for the editImage function.
 * - EditImageOutput - The output type for the editImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EditImageInputSchema = z.object({
  baseImageDataUri: z
    .string()
    .describe(
      "The base image to edit, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  instruction: z.string().describe('Instructions on how to edit the image.'),
});
export type EditImageInput = z.infer<typeof EditImageInputSchema>;

const EditImageOutputSchema = z.object({
  editedImage: z
    .string()
    .describe(
      "The edited image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type EditImageOutput = z.infer<typeof EditImageOutputSchema>;

export async function editImage(input: EditImageInput): Promise<EditImageOutput> {
  return editImageFlow(input);
}

const editImageFlow = ai.defineFlow(
  {
    name: 'editImageFlow',
    inputSchema: EditImageInputSchema,
    outputSchema: EditImageOutputSchema,
  },
  async (input) => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: [
        {media: {url: input.baseImageDataUri}},
        {text: input.instruction},
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media?.url) {
      throw new Error('The AI failed to generate an edited image.');
    }

    return {editedImage: media.url};
  }
);
