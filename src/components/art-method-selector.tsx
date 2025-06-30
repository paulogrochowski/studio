'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Ban, Brush, UploadCloud, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArtMethodSelectorProps {
  onSelect: (method: 'ai' | 'upload' | 'draw' | 'plain') => void;
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

export function ArtMethodSelector({ onSelect }: ArtMethodSelectorProps) {
  return (
    <Card className="bg-transparent border-none shadow-none">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {creationMethods.map(({ method, icon: Icon, title, description }) => (
            <button
              key={method}
              onClick={() => onSelect(method)}
              className={cn(
                "group text-left p-4 rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 hover:border-primary"
              )}
            >
              <Icon className="w-8 h-8 mb-3 text-primary transition-transform group-hover:scale-110" />
              <h3 className="font-bold text-lg mb-1">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
