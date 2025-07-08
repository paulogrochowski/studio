
'use server';

import { cookies } from 'next/headers';
import { generateCupArt } from '@/ai/flows/generate-cup-art';
import { analyzeArtComplexity } from '@/ai/flows/analyze-art-complexity';
import type { OrderDetails } from '@/lib/types';
import { refineCupArt } from '@/ai/flows/refine-cup-art';
import { validateImageBackground } from '@/ai/flows/validate-image-background';
import { optimizeProductSeo } from '@/ai/flows/optimize-product-seo';
import type { OptimizeProductSeoInput } from '@/ai/flows/optimize-product-seo';
import { generateAdCreative } from '@/ai/flows/generate-ad-creative';
import type { GenerateAdCreativeInput } from '@/ai/flows/generate-ad-creative';
import { optimizeAdCopy } from '@/ai/flows/optimize-ad-copy';
import type { OptimizeAdCopyInput } from '@/ai/flows/optimize-ad-copy';
import { analyzeMarketingQuality } from '@/ai/flows/analyze-marketing-quality';
import type { AnalyzeMarketingQualityInput } from '@/ai/flows/analyze-marketing-quality';


export async function handleArtGeneration(prompt: string) {
  try {
    const result = await generateCupArt({ eventDescription: prompt });
    // This is now simplified, as 3D controls handle placement.
    return { success: true, imageUrl: result.imageUrl, prompt: prompt };
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

export async function handleSeoOptimization(input: OptimizeProductSeoInput) {
    try {
        const result = await optimizeProductSeo(input);
        return { success: true, seoData: result };
    } catch (error) {
        console.error('Error optimizing SEO:', error);
        return { success: false, error: 'Falha ao otimizar o SEO. Tente novamente.' };
    }
}

export async function handleShippingCalculation(cep: string) {
    if (!cep || cep.replace(/\D/g, '').length !== 8) {
        return { success: false, error: 'CEP inválido. Por favor, digite um CEP com 8 dígitos.' };
    }
    
    // Mocked response
    const randomCost = 15 + Math.random() * 30; // Random cost between 15 and 45
    const randomTime = 3 + Math.floor(Math.random() * 10); // Random time between 3 and 12 days

    return { 
        success: true, 
        shippingCost: randomCost, 
        deliveryTime: `${randomTime} dias úteis` 
    };
}

export async function handleAdminAddProduct(formData: FormData) {
    const name = formData.get('name') as string;
    const basePrice = formData.get('basePrice') as string;
    const imageUrl = formData.get('imageUrl') as string;

    if (!name || !basePrice || !imageUrl) {
        return { success: false, error: "Todos os campos são obrigatórios." };
    }
    
    // In a real app, this would save the new product to a database.
    console.log('New Product to be added:', {
      name,
      basePrice: parseFloat(basePrice),
      imageUrl,
    });
    
    // Here you would revalidate the path to update the product list
    // revalidatePath('/admin/products');

    return { success: true };
}

export async function handleGenerateAdCreative(input: GenerateAdCreativeInput) {
    try {
        const result = await generateAdCreative(input);
        return { success: true, imageUrl: result.imageUrl };
    } catch (error) {
        console.error('Error generating ad creative:', error);
        return { success: false, error: 'Falha ao gerar o criativo do anúncio.' };
    }
}

export async function handleOptimizeAdCopy(input: OptimizeAdCopyInput) {
    try {
        const result = await optimizeAdCopy(input);
        return { success: true, adCopy: result };
    } catch (error) {
        console.error('Error optimizing ad copy:', error);
        return { success: false, error: 'Falha ao otimizar o texto do anúncio.' };
    }
}

export async function handleAnalyzeMarketingQuality(input: AnalyzeMarketingQualityInput) {
    try {
        const result = await analyzeMarketingQuality(input);
        return { success: true, analysis: result };
    } catch (error) {
        console.error('Error analyzing marketing quality:', error);
        return { success: false, error: 'Falha ao analisar a qualidade do marketing.' };
    }
}

export async function handleAdminAddCustomer(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;

    if (!name || !email) {
        return { success: false, error: "Nome e Email são obrigatórios." };
    }

    // In a real app, this would save the new customer to a database.
    console.log('New Customer to be added:', {
      name,
      email,
      phone: formData.get('phone'),
      cpf: formData.get('cpf'),
      address: formData.get('address'),
    });
    
    // Here you would revalidate the path to update the customer list
    // revalidatePath('/admin/customers');

    return { success: true };
}

export async function handleAdminLogin(formData: FormData) {
    const { redirect } = await import('next/navigation');
    
    const email = formData.get('email');
    const password = formData.get('password');
    const remember = formData.get('remember');

    // This is a prototype-only login.
    if (email === 'admin@coposmania.com' && password === '12345') {
      cookies().set('auth-token', 'admin-logged-in', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: remember ? 60 * 60 * 24 * 7 : undefined, // 1 week or session
          path: '/',
      });
      redirect('/admin');
    } else {
      redirect('/admin/login?error=true');
    }
}

export async function handleCustomerLogin(formData: FormData) {
    const { redirect } = await import('next/navigation');

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const remember = formData.get('remember');

    // Admin user check
    if (email.toLowerCase() === 'admin@coposmania.com') {
      if (password === '12345') {
        cookies().set('auth-token', 'admin-logged-in', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: remember ? 60 * 60 * 24 * 7 : undefined,
            path: '/',
        });
        redirect('/admin');
      } else {
        // Admin with wrong password
        redirect('/login?error=true');
      }
      return; // Important to prevent further execution
    }

    // Customer Login Simulation for prototype
    if (email && password) {
        console.log(`Customer login simulation for ${email}`);
        cookies().set('auth-token', 'customer-logged-in', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: remember ? 60 * 60 * 24 * 7 : undefined,
            path: '/',
        });
        redirect('/');
        return;
    }

    // Fallback for any other case (e.g., empty fields)
    redirect('/login?error=true');
}

export async function handleLogout() {
  const { redirect } = await import('next/navigation');
  cookies().delete('auth-token');
  redirect('/login');
}
