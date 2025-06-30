import Image from "next/image";
import type { CupModel } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const cupModels: CupModel[] = [
  { id: 'long-drink', name: 'Copo Long Drink', imageUrl: 'https://placehold.co/400x400.png', basePrice: 2.50, 'data-ai-hint': 'long drink cup' },
  { id: 'yard-cup', name: 'Copo Yard Cup', imageUrl: 'https://placehold.co/400x400.png', basePrice: 4.00, 'data-ai-hint': 'yard cup' },
  { id: 'twister', name: 'Copo Twister com Tampa', imageUrl: 'https://placehold.co/400x400.png', basePrice: 3.75, 'data-ai-hint': 'twister cup' },
  { id: 'caldereta', name: 'Copo Caldereta', imageUrl: 'https://placehold.co/400x400.png', basePrice: 2.20, 'data-ai-hint': 'caldereta cup' },
];

interface CupSelectorProps {
  onSelect: (cup: CupModel) => void;
}

export function CupSelector({ onSelect }: CupSelectorProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">1. Escolha o Modelo do Copo</CardTitle>
        <CardDescription>Selecione o copo que melhor combina com seu evento.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {cupModels.map((cup) => (
            <div key={cup.id} className="group relative">
              <Card className="overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
                <CardContent className="p-0">
                  <div className="aspect-square relative">
                    <Image
                      src={cup.imageUrl}
                      alt={cup.name}
                      fill
                      className="object-cover"
                      data-ai-hint={cup['data-ai-hint']}
                    />
                  </div>
                  <div className="p-4 border-t">
                    <h3 className="font-bold text-center">{cup.name}</h3>
                    <p className="text-sm text-muted-foreground text-center mt-1">
                      A partir de R$ {cup.basePrice.toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Button onClick={() => onSelect(cup)} className="mt-4 w-full" variant="secondary">
                Selecionar
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
