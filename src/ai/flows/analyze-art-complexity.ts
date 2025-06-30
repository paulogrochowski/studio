'use server';

/**
 * @fileOverview This flow analyzes the complexity of a generated art image.
 *
 * - analyzeArtComplexity - Analyzes the art complexity and returns a score.
 * - AnalyzeArtComplexityInput - The input type for analyzeArtComplexity.
 * - AnalyzeArtComplexityOutput - The output type for analyzeArtComplexity.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeArtComplexityInputSchema = z.object({
  artDataUri: z
    .string()
    .describe(
      "The art image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z.string().describe('The description of the event style.'),
});

export type AnalyzeArtComplexityInput = z.infer<
  typeof AnalyzeArtComplexityInputSchema
>;

const AnalyzeArtComplexityOutputSchema = z.object({
  complexityScore: z
    .number()
    .describe(
      'A score representing the complexity of the art, higher values indicate more complex art.'
    ),
  reasoning: z
    .string()
    .describe(
      'The reasoning behind the complexity score, including factors like number of colors, details, and resolution.'
    ),
});

export type AnalyzeArtComplexityOutput = z.infer<
  typeof AnalyzeArtComplexityOutputSchema
>;

export async function analyzeArtComplexity(
  input: AnalyzeArtComplexityInput
): Promise<AnalyzeArtComplexityOutput> {
  return analyzeArtComplexityFlow(input);
}

const analyzeArtComplexityPrompt = ai.definePrompt({
  name: 'analyzeArtComplexityPrompt',
  input: {schema: AnalyzeArtComplexityInputSchema},
  output: {schema: AnalyzeArtComplexityOutputSchema},
  prompt: `You are an expert art critic specializing in evaluating the complexity of digital art.

You will analyze the provided art image and its description to determine a complexity score.
Consider factors such as the number of colors, level of detail, and image resolution.
Provide a reasoning for the assigned score.

Description: {{{description}}}
Art Image: {{media url=artDataUri}}

Please provide a complexity score between 1 (simplest) and 10 (most complex) and your reasoning.
`,
});

const analyzeArtComplexityFlow = ai.defineFlow(
  {
    name: 'analyzeArtComplexityFlow',
    inputSchema: AnalyzeArtComplexityInputSchema,
    outputSchema: AnalyzeArtComplexityOutputSchema,
  },
  async input => {
    const {output} = await analyzeArtComplexityPrompt(input);
    return output!;
  }
);
