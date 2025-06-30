import Image from "next/image";
import type { CupModel } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const cupModels: CupModel[] = [
  { id: 'long-drink-white', name: 'Copo Long Drink', imageUrl: 'https://placehold.co/400x400.png', basePrice: 2.50, colorName: 'Branco', opacityType: 'Opaco', printableArea: { widthPercent: 85, heightPercent: 70 }, 'data-ai-hint': 'white cup' },
  { id: 'long-drink-blue', name: 'Copo Long Drink', imageUrl: 'https://placehold.co/400x400.png', basePrice: 2.70, colorName: 'Azul', opacityType: 'Translúcido', printableArea: { widthPercent: 85, heightPercent: 70 }, 'data-ai-hint': 'blue cup' },
  { id: 'twister-clear', name: 'Copo Twister com Tampa', imageUrl: 'https://placehold.co/400x400.png', basePrice: 3.75, colorName: 'Transparente', opacityType: 'Translúcido', printableArea: { widthPercent: 90, heightPercent: 60 }, 'data-ai-hint': 'twister cup' },
  { id: 'caldereta-black', name: 'Copo Caldereta', imageUrl: 'https://placehold.co/400x400.png', basePrice: 2.30, colorName: 'Preto', opacityType: 'Opaco', printableArea: { widthPercent: 95, heightPercent: 80 }, 'data-ai-hint': 'black cup' },
];

interface CupSelectorProps {
  onSelect: (cup: CupModel) => void;
}

export function CupSelector({ onSelect }: CupSelectorProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">1. Escolha o Modelo do Copo</CardTitle>
        <CardDescription>Selecione o copo que melhor combina com seu evento. Veja as cores e tipos disponíveis.</CardDescription>
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
                    <p className="text-sm text-center font-semibold text-primary/90">{cup.colorName} {cup.opacityType}</p>
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
