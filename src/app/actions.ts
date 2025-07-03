'use server';

import { generateCupArt } from '@/ai/flows/generate-cup-art';
import { analyzeArtComplexity } from '@/ai/flows/analyze-art-complexity';
import type { OrderDetails } from '@/lib/types';
import { refineCupArt } from '@/ai/flows/refine-cup-art';
import { validateImageBackground } from '@/ai/flows/validate-image-background';


export async function handleArtGeneration(prompt: string) {
  try {
    const result = await generateCupArt({ eventDescription: prompt });
    return { success: true, imageUrl: result.imageUrl };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Falha ao gerar a arte. Tente novamente.' };
  }
}

export async function handleArtAnalysis(artDataUri: string, description: string) {
    try {
        const result = await analyzeArtComplexity({ artDataUri, description });
        return { success: true, analysis: { score: result.complexityScore, reasoning: result.reasoning } };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Falha ao analisar a arte.' };
    }
}

// A fake action to simulate finalizing an order
export async function handleFinalizeOrder(details: OrderDetails) {
    console.log("Order finalized:", details);
    // In a real app, this would save to a database, process payment, etc.
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
}

export async function handleRefineArt(baseImageDataUri: string, refinementInstructions: string) {
    try {
        const result = await refineCupArt({ baseImageDataUri, refinementInstructions });
        return { success: true, imageUrl: result.refinedImageDataUri };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Falha ao refinar a arte. Tente novamente.' };
    }
}

export async function handleValidateArtBackground(imageDataUri: string) {
    try {
        const result = await validateImageBackground({ imageDataUri });
        return { success: true, validation: result };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Falha ao validar a imagem.' };
    }
}
