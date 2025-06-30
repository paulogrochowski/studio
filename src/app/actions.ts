'use server';

import { generateCupArt } from '@/ai/flows/generate-cup-art';
import { analyzeArtComplexity } from '@/ai/flows/analyze-art-complexity';
import { refineCupArt } from '@/ai/flows/refine-cup-art';
import { z } from 'zod';

const eventFormSchema = z.object({
  eventDescription: z.string().min(10, "Por favor, descreva seu evento com mais detalhes."),
});

type ArtGenerationResult = {
  success: true;
  imageUrl: string;
} | {
  success: false;
  error: string;
};

export async function handleArtGeneration(cupModelName: string, prevState: any, formData: FormData): Promise<ArtGenerationResult> {
  const validatedFields = eventFormSchema.safeParse({
    eventDescription: formData.get('eventDescription'),
  });

  if (!validatedFields.success) {
    return { success: false, error: "Dados inválidos." };
  }
  
  const { eventDescription } = validatedFields.data;

  try {
    const result = await generateCupArt({ 
      cupModel: cupModelName, 
      eventDescription 
    });
    
    if (!result.generatedArt) {
      return { success: false, error: "A IA não conseguiu gerar uma arte. Tente novamente com uma descrição diferente." };
    }

    return { success: true, imageUrl: result.generatedArt };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Ocorreu um erro ao gerar a arte. Tente novamente." };
  }
}


type ArtRefinementResult = {
  success: true;
  imageUrl: string;
} | {
  success: false;
  error: string;
};

export async function handleArtRefinement(baseImageDataUri: string, refinementInstructions: string): Promise<ArtRefinementResult> {
  if (!refinementInstructions || refinementInstructions.trim().length === 0) {
    return { success: false, error: "Por favor, forneça instruções para o refinamento." };
  }

  try {
    const result = await refineCupArt({ baseImageDataUri, refinementInstructions });
    
    if (!result.refinedImageDataUri) {
      return { success: false, error: "A IA não conseguiu refinar a arte. Tente novamente." };
    }

    return { success: true, imageUrl: result.refinedImageDataUri };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Ocorreu um erro ao refinar a arte. Tente novamente." };
  }
}

type ArtAnalysisResult = {
  success: true;
  complexityScore: number;
  reasoning: string;
} | {
  success: false;
  error: string;
};

export async function handleArtAnalysis(artDataUri: string, description: string): Promise<ArtAnalysisResult> {
  try {
    const result = await analyzeArtComplexity({ artDataUri, description });
    return { success: true, complexityScore: result.complexityScore, reasoning: result.reasoning };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Ocorreu um erro ao analisar a arte." };
  }
}