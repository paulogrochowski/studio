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
    const fullPrompt = `Gere uma arte no estilo vetorial/clipart para ser impressa em um copo, com base na seguinte descrição: "${input.eventDescription}".

REGRAS CRÍTICAS DE SAÍDA:
1. **NÃO INCLUA UM COPO:** A imagem gerada deve conter APENAS a arte descrita. NUNCA desenhe o copo.
2. **FUNDO TRANSPARENTE OBRIGATÓRIO:** O fundo da imagem final DEVE ser 100% transparente. Não use branco, preto ou qualquer outra cor de fundo. A saída deve ser um PNG com um canal alfa.
3. **SEM TEXTO, A MENOS QUE SOLICITADO:** Não inclua nenhuma palavra ou texto, a menos que seja especificamente pedido na descrição.`;
    
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
