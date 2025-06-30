'use server';

import { generateCupArt } from '@/ai/flows/generate-cup-art';
import { validateImageBackground } from '@/ai/flows/validate-image-background';
import { analyzeArtComplexity } from '@/ai/flows/analyze-art-complexity';
import { refineCupArt } from '@/ai/flows/refine-cup-art';
import type { OrderDetails } from '@/lib/types';
import { z } from 'zod';

const artGenerationSchema = z.object({
  eventDescription: z.string().min(10, 'A descrição precisa ter pelo menos 10 caracteres.'),
  cupName: z.string(),
});


export async function handleArtGeneration(cupName: string, prevState: any, formData: FormData) {
  const validatedFields = artGenerationSchema.safeParse({
    eventDescription: formData.get('eventDescription'),
    cupName: cupName,
  });

  if (!validatedFields.success) {
    return {
      success: false,
      error: validatedFields.error.errors.map((e) => e.message).join(', '),
    };
  }

  try {
    const result = await generateCupArt({
      eventDescription: validatedFields.data.eventDescription,
      cupName: validatedFields.data.cupName,
    });
    if (!result.imageUrl) {
      return { success: false, error: 'A IA não conseguiu gerar uma imagem. Tente uma descrição diferente.' };
    }
    return { success: true, imageUrl: result.imageUrl };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Ocorreu um erro inesperado ao gerar a arte.' };
  }
}

export async function handleImageValidation(imageDataUri: string) {
  try {
    const result = await validateImageBackground({ imageDataUri });
    return { success: true, isValid: result.hasValidBackground, reasoning: result.reasoning };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Falha ao validar a imagem.' };
  }
}

export async function handleArtAnalysis(artDataUri: string, description: string) {
  try {
    const result = await analyzeArtComplexity({ artDataUri, description });
    return { success: true, analysis: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Falha ao analisar a complexidade da arte.' };
  }
}

export async function handleFinalizeOrder(orderDetails: OrderDetails) {
  console.log('Pedido finalizado:', orderDetails);
  // Here you would typically save the order to a database,
  // process payment, send confirmation emails, etc.
  return { success: true, orderId: `order_${Date.now()}` };
}

export async function handleArtRefinement(baseImageDataUri: string, refinementInstructions: string) {
    try {
        const result = await refineCupArt({ baseImageDataUri, refinementInstructions });
        return { success: true, imageUrl: result.refinedImageDataUri };
    } catch (error) {
        console.error("Refinement error:", error);
        return { success: false, error: "Falha ao refinar a arte. Tente uma instrução diferente." };
    }
}
