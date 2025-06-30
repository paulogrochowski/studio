'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating cup art based on a description.
 *
 * - generateCupArt - The main function to generate the art.
 * - GenerateCupArtInput - The input type for the generateCupArt function.
 * - GenerateCupArtOutput - The output type for the generateCupArt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCupArtInputSchema = z.object({
  eventDescription: z.string().describe('A descrição detalhada do evento e da arte desejada.'),
  cupName: z.string().describe('O nome do modelo do copo para contextualizar o tamanho e formato da arte.'),
});
export type GenerateCupArtInput = z.infer<typeof GenerateCupArtInputSchema>;

const GenerateCupArtOutputSchema = z.object({
  imageUrl: z
    .string()
    .describe(
      "A URL da imagem da arte gerada, como uma data URI que deve incluir um MIME type e usar Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateCupArtOutput = z.infer<typeof GenerateCupArtOutputSchema>;

export async function generateCupArt(input: GenerateCupArtInput): Promise<GenerateCupArtOutput> {
  return generateCupArtFlow(input);
}

const generateCupArtFlow = ai.defineFlow(
  {
    name: 'generateCupArtFlow',
    inputSchema: GenerateCupArtInputSchema,
    outputSchema: GenerateCupArtOutputSchema,
  },
  async (input) => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `Crie uma arte para um copo personalizado do modelo "${input.cupName}". A arte deve ter um fundo transparente e um estilo de arte vetorial (limpo, com poucas cores, como um ícone ou clipart). A descrição do evento é: "${input.eventDescription}".`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media?.url) {
      throw new Error('The AI failed to generate an image.');
    }

    return {imageUrl: media.url};
  }
);
