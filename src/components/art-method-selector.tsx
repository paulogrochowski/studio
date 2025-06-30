'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Brush, UploadCloud, Wand2, Ban } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArtMethodSelectorProps {
  onSelect: (method: 'ai' | 'upload' | 'draw' | 'plain') => void;
  onGoBack: () => void;
}

const creationMethods = [
  {
    method: 'ai' as const,
    icon: Wand2,
    title: 'Gerar com IA',
    description: 'Descreva sua ideia e nossa IA criará uma arte exclusiva.',
  },
  {
    method: 'upload' as const,
    icon: UploadCloud,
    title: 'Enviar sua Arte',
    description: 'Faça o upload de uma imagem com fundo branco ou transparente.',
  },
  {
    method: 'draw' as const,
    icon: Brush,
    title: 'Desenhar na Hora',
    description: 'Use nossa ferramenta de desenho para criar sua própria arte.',
  },
  {
    method: 'plain' as const,
    icon: Ban,
    title: 'Sem Arte (Copo Liso)',
    description: 'Prossiga para o orçamento sem adicionar nenhuma arte.',
  },
];

export function ArtMethodSelector({ onSelect, onGoBack }: ArtMethodSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">2. Como você quer personalizar?</CardTitle>
        <CardDescription>
          Escolha como criar a arte para o seu copo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {creationMethods.map(({ method, icon: Icon, title, description }) => (
            <button
              key={method}
              onClick={() => onSelect(method)}
              className={cn(
                "group text-left p-3 rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 hover:border-primary"
              )}
            >
              <Icon className="w-6 h-6 mb-2 text-primary transition-transform group-hover:scale-110" />
              <h3 className="font-bold text-base mb-1">{title}</h3>
              <p className="text-xs text-muted-foreground">{description}</p>
            </button>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={onGoBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </CardFooter>
    </Card>
  );
}
