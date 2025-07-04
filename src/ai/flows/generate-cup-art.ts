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
1.  **NÃO DESENHE O COPO:** A imagem final deve conter SOMENTE a arte solicitada (objetos, textos, etc.). É estritamente proibido desenhar o copo, a forma do copo, ou qualquer coisa que se pareça com um copo. A arte deve ser ISOLADA. O resultado final é apenas a arte que será estampada no copo.
2.  **FUNDO 100% TRANSPARENTE:** A imagem DEVE ter um fundo completamente transparente (canal alfa). Nenhum fundo de cor sólida (branco, preto, etc.) ou gradiente é permitido. O fundo deve ser vazio.

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
