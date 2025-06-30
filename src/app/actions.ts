'use server';
import { generateImage, type GenerateImageInput } from '@/ai/flows/generate-image';
import { editImage, type EditImageInput } from '@/ai/flows/edit-image';

export async function handleGenerateImage(input: GenerateImageInput) {
    try {
        const result = await generateImage(input);
        return { success: true, imageUrl: result.imageUrl };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Falha ao gerar a imagem. Tente um prompt diferente.' };
    }
}

export async function handleEditImage(input: EditImageInput) {
    try {
        const result = await editImage(input);
        return { success: true, imageUrl: result.editedImageDataUri };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Falha ao editar a imagem. Tente uma instrução diferente.' };
    }
}
