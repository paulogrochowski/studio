
'use client';

import Image from "next/image";
import { useMemo, useState } from "react";
import type { CupModel } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const cupModels: CupModel[] = [
  // Long Drink
  { id: 'ld-white-opaque', name: 'Copo Long Drink', imageUrl: 'https://placehold.co/400x400.png', basePrice: 2.50, colorName: 'Branco', colorHex: '#FFFFFF', opacityType: 'Opaco', printableArea: { widthPercent: 85, heightPercent: 70 }, 'data-ai-hint': 'white cup' },
  { id: 'ld-black-opaque', name: 'Copo Long Drink', imageUrl: 'https://placehold.co/400x400.png', basePrice: 2.50, colorName: 'Preto', colorHex: '#000000', opacityType: 'Opaco', printableArea: { widthPercent: 85, heightPercent: 70 }, 'data-ai-hint': 'black cup' },
  { id: 'ld-blue-translucent', name: 'Copo Long Drink', imageUrl: 'https://placehold.co/400x400.png', basePrice: 2.70, colorName: 'Azul', colorHex: '#3b82f6', opacityType: 'Translúcido', printableArea: { widthPercent: 85, heightPercent: 70 }, 'data-ai-hint': 'blue cup' },
  { id: 'ld-pink-translucent', name: 'Copo Long Drink', imageUrl: 'https://placehold.co/400x400.png', basePrice: 2.70, colorName: 'Rosa', colorHex: '#ec4899', opacityType: 'Translúcido', printableArea: { widthPercent: 85, heightPercent: 70 }, 'data-ai-hint': 'pink cup' },
  
  // Twister
  { id: 'twister-clear-translucent', name: 'Copo Twister com Tampa', imageUrl: 'https://placehold.co/400x400.png', basePrice: 3.75, colorName: 'Transparente', colorHex: '#FFFFFF', opacityType: 'Translúcido', printableArea: { widthPercent: 90, heightPercent: 60 }, 'data-ai-hint': 'clear cup' },
  { id: 'twister-red-opaque', name: 'Copo Twister com Tampa', imageUrl: 'https://placehold.co/400x400.png', basePrice: 3.85, colorName: 'Vermelho', colorHex: '#ef4444', opacityType: 'Opaco', printableArea: { widthPercent: 90, heightPercent: 60 }, 'data-ai-hint': 'red cup' },

  // Caldereta
  { id: 'caldereta-black-opaque', name: 'Copo Caldereta', imageUrl: 'https://placehold.co/400x400.png', basePrice: 2.30, colorName: 'Preto', colorHex: '#000000', opacityType: 'Opaco', printableArea: { widthPercent: 95, heightPercent: 80 }, 'data-ai-hint': 'black cup' },
  { id: 'caldereta-clear-translucent', name: 'Copo Caldereta', imageUrl: 'https://placehold.co/400x400.png', basePrice: 2.40, colorName: 'Transparente', colorHex: '#FFFFFF', opacityType: 'Translúcido', printableArea: { widthPercent: 95, heightPercent: 80 }, 'data-ai-hint': 'clear cup' },
];

interface GroupedModel {
  name: string;
  printableArea?: { widthPercent: number; heightPercent: number; };
  variations: CupModel[];
  uniqueColors: { colorName: string; colorHex: string; }[];
  uniqueOpacities: string[];
}

interface CupSelectorProps {
  onSelect: (cup: CupModel) => void;
}

export function CupSelector({ onSelect }: CupSelectorProps) {
  // Group models by name and pre-calculate unique properties
  const groupedModels = useMemo<Record<string, GroupedModel>>(() => {
    const groups: Record<string, Omit<GroupedModel, 'uniqueColors' | 'uniqueOpacities'>> = {};
    for (const cup of cupModels) {
      if (!groups[cup.name]) {
        groups[cup.name] = {
          name: cup.name,
          printableArea: cup.printableArea,
          variations: [],
        };
      }
      groups[cup.name].variations.push(cup);
    }
    
    // Add unique properties
    return Object.fromEntries(Object.entries(groups).map(([name, group]) => {
      const colors = new Map<string, string>();
      group.variations.forEach(v => {
        if(v.colorName && v.colorHex) colors.set(v.colorName, v.colorHex)
      });
      const uniqueColors = Array.from(colors.entries()).map(([colorName, colorHex]) => ({ colorName, colorHex }));
      
      const opacities = new Set<string>();
      group.variations.forEach(v => {
        if (v.opacityType) opacities.add(v.opacityType);
      });
      const uniqueOpacities = Array.from(opacities);

      return [name, { ...group, uniqueColors, uniqueOpacities }];
    }));
  }, []);

  // State to hold the selected variation ID for each group
  const [selectedVariations, setSelectedVariations] = useState<Record<string, string>>(() => {
    const initialState: Record<string, string> = {};
    for (const name in groupedModels) {
      initialState[name] = groupedModels[name].variations[0].id;
    }
    return initialState;
  });

  const handleSelectionChange = (groupName: string, newColor?: string, newOpacity?: string) => {
    const currentVariation = cupModels.find(c => c.id === selectedVariations[groupName])!;
    const currentColor = newColor || currentVariation.colorName;
    const currentOpacity = newOpacity || currentVariation.opacityType;

    const group = groupedModels[groupName];
    let bestMatch = group.variations.find(v => v.colorName === currentColor && v.opacityType === currentOpacity);

    // If no exact match, find the first available with the selected color or opacity
    if (!bestMatch) {
      bestMatch = group.variations.find(v => v.colorName === currentColor) || group.variations.find(v => v.opacityType === currentOpacity) || group.variations[0];
    }
    
    setSelectedVariations(prev => ({
      ...prev,
      [groupName]: bestMatch.id,
    }));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">1. Escolha o Modelo do Copo</CardTitle>
        <CardDescription>Selecione o copo, a cor e a opacidade que melhor combinam com seu evento.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.values(groupedModels).map((group) => {
            const selected = cupModels.find(c => c.id === selectedVariations[group.name])!;
            const availableOpacitiesForSelectedColor = new Set(
              group.variations
                .filter(v => v.colorName === selected.colorName)
                .map(v => v.opacityType)
            );

            return (
              <div key={group.name} className="flex flex-col">
                <Card className="overflow-hidden transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1 flex-grow">
                  <CardContent className="p-4 flex flex-col h-full">
                    <div className="aspect-square relative w-full mb-4">
                      <Image
                        src={selected.imageUrl}
                        alt={selected.name}
                        fill
                        className="object-cover transition-all"
                        data-ai-hint={selected['data-ai-hint']}
                        key={selected.id} // Force re-render on image change
                      />
                    </div>
                    
                    <div className="flex-grow space-y-4">
                        <h3 className="font-bold text-center text-lg">{group.name}</h3>

                        {group.uniqueColors.length > 1 && (
                            <div className="space-y-2">
                                <Label className="font-semibold">Cor: <span className="font-normal text-muted-foreground">{selected.colorName}</span></Label>
                                <div className="flex flex-wrap gap-2">
                                {group.uniqueColors.map(color => (
                                    <button
                                    key={color.colorName}
                                    title={color.colorName}
                                    onClick={() => handleSelectionChange(group.name, color.colorName)}
                                    className={cn(
                                        "w-8 h-8 rounded-full border-2 transition-transform hover:scale-110",
                                        selected.colorName === color.colorName ? 'ring-2 ring-offset-2 ring-primary' : 'border-card',
                                        color.colorHex === '#FFFFFF' && 'border-gray-300' // special case for white
                                    )}
                                    style={{ backgroundColor: color.colorHex }}
                                    />
                                ))}
                                </div>
                            </div>
                        )}
                        
                        {group.uniqueOpacities.length > 1 && (
                            <div className="space-y-2">
                                <Label className="font-semibold">Acabamento</Label>
                                <RadioGroup
                                    value={selected.opacityType}
                                    onValueChange={(opacity) => handleSelectionChange(group.name, undefined, opacity)}
                                    className="flex gap-4"
                                >
                                    {group.uniqueOpacities.map(opacity => (
                                        <div key={opacity} className="flex items-center space-x-2">
                                            <RadioGroupItem 
                                                value={opacity} 
                                                id={`${group.name}-${opacity}`}
                                                disabled={!availableOpacitiesForSelectedColor.has(opacity)}
                                            />
                                            <Label htmlFor={`${group.name}-${opacity}`} className={cn("font-normal", !availableOpacitiesForSelectedColor.has(opacity) && "text-muted-foreground/50")}>{opacity}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>
                        )}
                    </div>

                    <div className="pt-4 mt-auto">
                        <p className="text-xl font-bold text-primary text-center">
                            R$ {selected.basePrice.toFixed(2).replace('.', ',')}
                            <span className="text-sm font-normal text-muted-foreground"> /un.</span>
                        </p>
                    </div>
                  </CardContent>
                </Card>
                <Button onClick={() => onSelect(selected)} className="mt-4 w-full">
                  Selecionar este Modelo
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
