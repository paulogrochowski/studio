'use client';
import { useState, useTransition } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { handleArtRefinement } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2, ArrowLeft } from 'lucide-react';
import type { GeneratedArt, CupModel } from '@/lib/types';
import { Label } from './ui/label';

interface ArtGalleryProps {
  initialArt: GeneratedArt;
  cup: CupModel;
  onSelectArt: (art: GeneratedArt) => void;
  onRegenerate: () => void;
}

export function ArtGallery({ initialArt, cup, onSelectArt, onRegenerate }: ArtGalleryProps) {
  const [currentArt, setCurrentArt] = useState(initialArt);
  const [refinementInput, setRefinementInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  
  const isAIArt = initialArt.prompt !== "Arte enviada pelo usuário";

  const handleRefine = async () => {
    if (!refinementInput) return;
    startTransition(async () => {
      const result = await handleArtRefinement(currentArt.imageUrl, refinementInput);
      if (result.success) {
        setCurrentArt({ imageUrl: result.imageUrl, prompt: initialArt.prompt });
        setRefinementInput('');
        toast({ title: "Arte refinada!", description: "Sua arte foi atualizada com sucesso." });
      } else {
        toast({
          variant: 'destructive',
          title: 'Erro ao refinar',
          description: result.error,
        });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-3xl">3. Revise sua Arte</CardTitle>
        <CardDescription>
          Esta é a arte para o seu copo. Você pode fazer ajustes ou voltar para escolher outra.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-full aspect-square rounded-lg overflow-hidden border bg-secondary/50 shadow-inner">
            <Image src={currentArt.imageUrl} alt="Arte para o copo" fill className="object-contain p-4" />
            <div 
              className="absolute inset-0 bg-no-repeat bg-contain bg-center opacity-20 pointer-events-none"
              style={{ backgroundImage: `url(${cup.imageUrl})`}}
            ></div>
          </div>
          <Button onClick={() => onSelectArt(currentArt)} size="lg" className="w-full">
            Gostei, usar esta arte!
          </Button>
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="refine" className="font-bold">Fazer um ajuste fino na arte</Label>
            <Textarea
              id="refine"
              placeholder="Ex: 'Adicione mais estrelas', 'Mude a cor do texto para dourado', 'Remova o fundo'..."
              value={refinementInput}
              onChange={(e) => setRefinementInput(e.target.value)}
              rows={4}
            />
            <Button onClick={handleRefine} disabled={isPending} className="w-full">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Refinar com IA
            </Button>
          </div>
          <div className="space-y-2">
            <p className="font-bold">Não gostou do resultado?</p>
            <Button onClick={onRegenerate} variant="outline" className="w-full">
                {isAIArt ? (
                    <><Wand2 className="mr-2 h-4 w-4" /> Gerar uma nova arte do zero</>
                ) : (
                    <><ArrowLeft className="mr-2 h-4 w-4" /> Voltar e enviar outra arte</>
                )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
