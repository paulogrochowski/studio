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
    const fullPrompt = `INSTRUÇÕES CRÍTICAS E OBRIGATÓRIAS:
1.  **NÃO DESENHE O COPO:** A imagem final deve conter APENAS a arte para ser estampada. É estritamente proibido desenhar o copo, sua forma, ou qualquer coisa que se assemelhe a um copo. A arte deve ser totalmente ISOLADA.
2.  **FUNDO 100% TRANSPARENTE:** Esta é a regra mais importante. A imagem gerada DEVE ter um fundo completamente transparente (canal alfa). NÃO inclua nenhum fundo branco, preto, colorido, com gradiente ou qualquer outro tipo. O fundo precisa ser VAZIO para que a arte possa ser aplicada corretamente sobre o copo.

Agora, gere uma arte no estilo vetorial/clipart, limpa e de alta qualidade, com base na seguinte descrição: "${input.eventDescription}".`;
    
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: fullPrompt,
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
