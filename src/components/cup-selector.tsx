
'use client';

import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const cupTypes = [
  { name: 'Copo Long Drink', imageUrl: 'https://placehold.co/400x400.png', 'data-ai-hint': 'white cup' },
  { name: 'Copo Twister com Tampa', imageUrl: 'https://placehold.co/400x400.png', 'data-ai-hint': 'clear cup' },
  { name: 'Copo Caldereta', imageUrl: 'https://placehold.co/400x400.png', 'data-ai-hint': 'black cup' },
];

interface CupSelectorProps {
  onSelect: (cupType: string) => void;
}

export function CupSelector({ onSelect }: CupSelectorProps) {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-3xl">Passo 1: Escolha o Modelo do Copo</CardTitle>
        <CardDescription>Selecione o modelo base que você deseja personalizar.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cupTypes.map((type) => (
            <div key={type.name} className="flex flex-col items-center p-4 rounded-lg border bg-card text-card-foreground shadow-sm gap-4 transition-all hover:shadow-md hover:-translate-y-0.5 hover:border-primary">
               <div className="aspect-square relative w-full max-w-[200px] mb-4 rounded-lg bg-secondary/30">
                 <Image
                    src={type.imageUrl}
                    alt={type.name}
                    fill
                    className="object-contain transition-all p-4"
                    data-ai-hint={type['data-ai-hint']}
                  />
               </div>
               <h3 className="font-bold text-lg text-center h-12 flex items-center justify-center">{type.name}</h3>
               <Button onClick={() => onSelect(type.name)} className="w-full">
                 Personalizar
               </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
