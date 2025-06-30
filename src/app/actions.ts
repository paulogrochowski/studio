'use server';

import { editImage } from '@/ai/flows/generate-cup-art'; // path is old, but functions are new
import { z } from 'zod';

const editImageFormSchema = z.object({
  baseImage: z.string().min(1, "Please upload an image."),
  instruction: z.string().min(3, "Please provide a valid edit instruction."),
});

type EditImageResult = {
  success: true;
  imageUrl: string;
} | {
  success: false;
  error: string;
};

export async function handleImageEdit(prevState: any, formData: FormData): Promise<EditImageResult> {
  const validatedFields = editImageFormSchema.safeParse({
    baseImage: formData.get('baseImage'),
    instruction: formData.get('instruction'),
  });

  if (!validatedFields.success) {
    return { 
      success: false, 
      error: validatedFields.error.errors.map(e => e.message).join(', ') 
    };
  }
  
  const { baseImage: baseImageDataUri, instruction } = validatedFields.data;

  try {
    const result = await editImage({ 
      baseImageDataUri, 
      instruction 
    });
    
    if (!result.editedImage) {
      return { success: false, error: "The AI failed to return an image. Please try a different instruction." };
    }

    return { success: true, imageUrl: result.editedImage };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred during image editing.";
    return { success: false, error: errorMessage };
  }
}
