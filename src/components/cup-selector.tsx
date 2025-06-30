
'use client';

import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const LONG_DRINK_SVG = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2MCAxMjAiPjxwYXRoIGQ9Ik01LDAgSDU1IEw1MCwxMjAgSDEwIFoiIGZpbGw9ImJsYWNrIi8+PC9zdmc+';
const TWISTER_SVG = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA3MCAxNDAiPjxwYXRoIGQ9Ik0wIDEwaDcwdjE1SDB6TTEwIDMwaDUwbC01IDEwMEgxNXpNMzIgMGg2djEwaC02eiIgZmlsbD0iYmxhY2siLz48L3N2Zz4=';
const CALDERETA_SVG = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4MCAxMDAiPjxwYXRoIGQ9Ik01LDAgSDc1IEw2NSwxMDAgSDE1IFoiIGZpbGw9ImJsYWNrIi8+PC9zdmc+';

const cupTypes = [
  { name: 'Copo Long Drink', imageUrl: LONG_DRINK_SVG, 'data-ai-hint': 'white cup' },
  { name: 'Copo Twister com Tampa', imageUrl: TWISTER_SVG, 'data-ai-hint': 'clear cup' },
  { name: 'Copo Caldereta', imageUrl: CALDERETA_SVG, 'data-ai-hint': 'black cup' },
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
