
'use client';

import Image from "next/image";
import { useMemo, useState } from "react";
import type { CupModel } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

const cupModels: CupModel[] = [
  // --- Long Drink ---
  // Branco Opaco
  { id: 'ld-white-opaque', name: 'Copo Long Drink', imageUrl: 'https://placehold.co/400x400.png', basePrice: 2.50, colorName: 'Branco', colorHex: '#FFFFFF', opacityType: 'Opaco', rimColor: 'Nenhuma', printableArea: { widthPercent: 85, heightPercent: 70 }, 'data-ai-hint': 'white cup' },
  { id: 'ld-white-opaque-gold', name: 'Copo Long Drink', imageUrl: 'https://placehold.co/400x400.png', basePrice: 3.00, colorName: 'Branco', colorHex: '#FFFFFF', opacityType: 'Opaco', rimColor: 'Dourada', printableArea: { widthPercent: 85, heightPercent: 70 }, 'data-ai-hint': 'white cup' },
  { id: 'ld-white-opaque-silver', name: 'Copo Long Drink', imageUrl: 'https://placehold.co/400x400.png', basePrice: 3.00, colorName: 'Branco', colorHex: '#FFFFFF', opacityType: 'Opaco', rimColor: 'Prateada', printableArea: { widthPercent: 85, heightPercent: 70 }, 'data-ai-hint': 'white cup' },
  // Branco Translúcido
  { id: 'ld-white-translucent', name: 'Copo Long Drink', imageUrl: 'https://placehold.co/400x400.png', basePrice: 2.70, colorName: 'Branco', colorHex: '#FFFFFF', opacityType: 'Translúcido', rimColor: 'Nenhuma', printableArea: { widthPercent: 85, heightPercent: 70 }, 'data-ai-hint': 'white cup' },
  { id: 'ld-white-translucent-gold', name: 'Copo Long Drink', imageUrl: 'https://placehold.co/400x400.png', basePrice: 3.20, colorName: 'Branco', colorHex: '#FFFFFF', opacityType: 'Translúcido', rimColor: 'Dourada', printableArea: { widthPercent: 85, heightPercent: 70 }, 'data-ai-hint': 'white cup' },
  { id: 'ld-white-translucent-silver', name: 'Copo Long Drink', imageUrl: 'https://placehold.co/400x400.png', basePrice: 3.20, colorName: 'Branco', colorHex: '#FFFFFF', opacityType: 'Translúcido', rimColor: 'Prateada', printableArea: { widthPercent: 85, heightPercent: 70 }, 'data-ai-hint': 'white cup' },
  // Preto Opaco
  { id: 'ld-black-opaque', name: 'Copo Long Drink', imageUrl: 'https://placehold.co/400x400.png', basePrice: 2.50, colorName: 'Preto', colorHex: '#000000', opacityType: 'Opaco', rimColor: 'Nenhuma', printableArea: { widthPercent: 85, heightPercent: 70 }, 'data-ai-hint': 'black cup' },
  { id: 'ld-black-opaque-gold', name: 'Copo Long Drink', imageUrl: 'https://placehold.co/400x400.png', basePrice: 3.00, colorName: 'Preto', colorHex: '#000000', opacityType: 'Opaco', rimColor: 'Dourada', printableArea: { widthPercent: 85, heightPercent: 70 }, 'data-ai-hint': 'black cup' },
  { id: 'ld-black-opaque-silver', name: 'Copo Long Drink', imageUrl: 'https://placehold.co/400x400.png', basePrice: 3.00, colorName: 'Preto', colorHex: '#000000', opacityType: 'Opaco', rimColor: 'Prateada', printableArea: { widthPercent: 85, heightPercent: 70 }, 'data-ai-hint': 'black cup' },
  // Preto Translúcido
  { id: 'ld-black-translucent', name: 'Copo Long Drink', imageUrl: 'https://placehold.co/400x400.png', basePrice: 2.70, colorName: 'Preto', colorHex: '#000000', opacityType: 'Translúcido', rimColor: 'Nenhuma', printableArea: { widthPercent: 85, heightPercent: 70 }, 'data-ai-hint': 'black cup' },
  { id: 'ld-black-translucent-gold', name: 'Copo Long Drink', imageUrl: 'https://placehold.co/400x400.png', basePrice: 3.20, colorName: 'Preto', colorHex: '#000000', opacityType: 'Translúcido', rimColor: 'Dourada', printableArea: { widthPercent: 85, heightPercent: 70 }, 'data-ai-hint': 'black cup' },
  { id: 'ld-black-translucent-silver', name: 'Copo Long Drink', imageUrl: 'https://placehold.co/400x400.png', basePrice: 3.20, colorName: 'Preto', colorHex: '#000000', opacityType: 'Translúcido', rimColor: 'Prateada', printableArea: { widthPercent: 85, heightPercent: 70 }, 'data-ai-hint': 'black cup' },
  // Azul Opaco
  { id: 'ld-blue-opaque', name: 'Copo Long Drink', imageUrl: 'https://placehold.co/400x400.png', basePrice: 2.50, colorName: 'Azul', colorHex: '#3b82f6', opacityType: 'Opaco', rimColor: 'Nenhuma', printableArea: { widthPercent: 85, heightPercent: 70 }, 'data-ai-hint': 'blue cup' },
  { id: 'ld-blue-opaque-gold', name: 'Copo Long Drink', imageUrl: 'https://placehold.co/400x400.png', basePrice: 3.00, colorName: 'Azul', colorHex: '#3b82f6', opacityType: 'Opaco', rimColor: 'Dourada', printableArea: { widthPercent: 85, heightPercent: 70 }, 'data-ai-hint': 'blue cup' },
  { id: 'ld-blue-opaque-silver', name: 'Copo Long Drink', imageUrl: 'https://placehold.co/400x400.png', basePrice: 3.00, colorName: 'Azul', colorHex: '#3b82f6', opacityType: 'Opaco', rimColor: 'Prateada', printableArea: { widthPercent: 85, heightPercent: 70 }, 'data-ai-hint': 'blue cup' },
  // Azul Translúcido
  { id: 'ld-blue-translucent', name: 'Copo Long Drink', imageUrl: 'https://placehold.co/400x400.png', basePrice: 2.70, colorName: 'Azul', colorHex: '#3b82f6', opacityType: 'Translúcido', rimColor: 'Nenhuma', printableArea: { widthPercent: 85, heightPercent: 70 }, 'data-ai-hint': 'blue cup' },
  { id: 'ld-blue-translucent-gold', name: 'Copo Long Drink', imageUrl: 'https://placehold.co/400x400.png', basePrice: 3.20, colorName: 'Azul', colorHex: '#3b82f6', opacityType: 'Translúcido', rimColor: 'Dourada', printableArea: { widthPercent: 85, heightPercent: 70 }, 'data-ai-hint': 'blue cup' },
  { id: 'ld-blue-translucent-silver', name: 'Copo Long Drink', imageUrl: 'https://placehold.co/400x400.png', basePrice: 3.20, colorName: 'Azul', colorHex: '#3b82f6', opacityType: 'Translúcido', rimColor: 'Prateada', printableArea: { widthPercent: 85, heightPercent: 70 }, 'data-ai-hint': 'blue cup' },
  // Rosa Opaco
  { id: 'ld-pink-opaque', name: 'Copo Long Drink', imageUrl: 'https://placehold.co/400x400.png', basePrice: 2.50, colorName: 'Rosa', colorHex: '#ec4899', opacityType: 'Opaco', rimColor: 'Nenhuma', printableArea: { widthPercent: 85, heightPercent: 70 }, 'data-ai-hint': 'pink cup' },
  { id: 'ld-pink-opaque-gold', name: 'Copo Long Drink', imageUrl: 'https://placehold.co/400x400.png', basePrice: 3.00, colorName: 'Rosa', colorHex: '#ec4899', opacityType: 'Opaco', rimColor: 'Dourada', printableArea: { widthPercent: 85, heightPercent: 70 }, 'data-ai-hint': 'pink cup' },
  { id: 'ld-pink-opaque-silver', name: 'Copo Long Drink', imageUrl: 'https://placehold.co/400x400.png', basePrice: 3.00, colorName: 'Rosa', colorHex: '#ec4899', opacityType: 'Opaco', rimColor: 'Prateada', printableArea: { widthPercent: 85, heightPercent: 70 }, 'data-ai-hint': 'pink cup' },
  // Rosa Translúcido
  { id: 'ld-pink-translucent', name: 'Copo Long Drink', imageUrl: 'https://placehold.co/400x400.png', basePrice: 2.70, colorName: 'Rosa', colorHex: '#ec4899', opacityType: 'Translúcido', rimColor: 'Nenhuma', printableArea: { widthPercent: 85, heightPercent: 70 }, 'data-ai-hint': 'pink cup' },
  { id: 'ld-pink-translucent-gold', name: 'Copo Long Drink', imageUrl: 'https://placehold.co/400x400.png', basePrice: 3.20, colorName: 'Rosa', colorHex: '#ec4899', opacityType: 'Translúcido', rimColor: 'Dourada', printableArea: { widthPercent: 85, heightPercent: 70 }, 'data-ai-hint': 'pink cup' },
  { id: 'ld-pink-translucent-silver', name: 'Copo Long Drink', imageUrl: 'https://placehold.co/400x400.png', basePrice: 3.20, colorName: 'Rosa', colorHex: '#ec4899', opacityType: 'Translúcido', rimColor: 'Prateada', printableArea: { widthPercent: 85, heightPercent: 70 }, 'data-ai-hint': 'pink cup' },

  // --- Twister ---
  // Branco Opaco
  { id: 'twister-white-opaque', name: 'Copo Twister com Tampa', imageUrl: 'https://placehold.co/400x400.png', basePrice: 3.85, colorName: 'Branco', colorHex: '#FFFFFF', opacityType: 'Opaco', rimColor: 'Nenhuma', printableArea: { widthPercent: 90, heightPercent: 60 }, 'data-ai-hint': 'white cup' },
  { id: 'twister-white-opaque-gold', name: 'Copo Twister com Tampa', imageUrl: 'https://placehold.co/400x400.png', basePrice: 4.35, colorName: 'Branco', colorHex: '#FFFFFF', opacityType: 'Opaco', rimColor: 'Dourada', printableArea: { widthPercent: 90, heightPercent: 60 }, 'data-ai-hint': 'white cup' },
  { id: 'twister-white-opaque-silver', name: 'Copo Twister com Tampa', imageUrl: 'https://placehold.co/400x400.png', basePrice: 4.35, colorName: 'Branco', colorHex: '#FFFFFF', opacityType: 'Opaco', rimColor: 'Prateada', printableArea: { widthPercent: 90, heightPercent: 60 }, 'data-ai-hint': 'white cup' },
  // Cristal Translúcido
  { id: 'twister-clear-translucent', name: 'Copo Twister com Tampa', imageUrl: 'https://placehold.co/400x400.png', basePrice: 3.75, colorName: 'Cristal', colorHex: '#FFFFFF', opacityType: 'Translúcido', rimColor: 'Nenhuma', printableArea: { widthPercent: 90, heightPercent: 60 }, 'data-ai-hint': 'clear cup' },
  { id: 'twister-clear-translucent-gold', name: 'Copo Twister com Tampa', imageUrl: 'https://placehold.co/400x400.png', basePrice: 4.25, colorName: 'Cristal', colorHex: '#FFFFFF', opacityType: 'Translúcido', rimColor: 'Dourada', printableArea: { widthPercent: 90, heightPercent: 60 }, 'data-ai-hint': 'clear cup' },
  { id: 'twister-clear-translucent-silver', name: 'Copo Twister com Tampa', imageUrl: 'https://placehold.co/400x400.png', basePrice: 4.25, colorName: 'Cristal', colorHex: '#FFFFFF', opacityType: 'Translúcido', rimColor: 'Prateada', printableArea: { widthPercent: 90, heightPercent: 60 }, 'data-ai-hint': 'clear cup' },
  // Vermelho Opaco
  { id: 'twister-red-opaque', name: 'Copo Twister com Tampa', imageUrl: 'https://placehold.co/400x400.png', basePrice: 3.85, colorName: 'Vermelho', colorHex: '#ef4444', opacityType: 'Opaco', rimColor: 'Nenhuma', printableArea: { widthPercent: 90, heightPercent: 60 }, 'data-ai-hint': 'red cup' },
  { id: 'twister-red-opaque-gold', name: 'Copo Twister com Tampa', imageUrl: 'https://placehold.co/400x400.png', basePrice: 4.35, colorName: 'Vermelho', colorHex: '#ef4444', opacityType: 'Opaco', rimColor: 'Dourada', printableArea: { widthPercent: 90, heightPercent: 60 }, 'data-ai-hint': 'red cup' },
  { id: 'twister-red-opaque-silver', name: 'Copo Twister com Tampa', imageUrl: 'https://placehold.co/400x400.png', basePrice: 4.35, colorName: 'Vermelho', colorHex: '#ef4444', opacityType: 'Opaco', rimColor: 'Prateada', printableArea: { widthPercent: 90, heightPercent: 60 }, 'data-ai-hint': 'red cup' },
  // Vermelho Translúcido
  { id: 'twister-red-translucent', name: 'Copo Twister com Tampa', imageUrl: 'https://placehold.co/400x400.png', basePrice: 4.05, colorName: 'Vermelho', colorHex: '#ef4444', opacityType: 'Translúcido', rimColor: 'Nenhuma', printableArea: { widthPercent: 90, heightPercent: 60 }, 'data-ai-hint': 'red cup' },
  { id: 'twister-red-translucent-gold', name: 'Copo Twister com Tampa', imageUrl: 'https://placehold.co/400x400.png', basePrice: 4.55, colorName: 'Vermelho', colorHex: '#ef4444', opacityType: 'Translúcido', rimColor: 'Dourada', printableArea: { widthPercent: 90, heightPercent: 60 }, 'data-ai-hint': 'red cup' },
  { id: 'twister-red-translucent-silver', name: 'Copo Twister com Tampa', imageUrl: 'https://placehold.co/400x400.png', basePrice: 4.55, colorName: 'Vermelho', colorHex: '#ef4444', opacityType: 'Translúcido', rimColor: 'Prateada', printableArea: { widthPercent: 90, heightPercent: 60 }, 'data-ai-hint': 'red cup' },

  // --- Caldereta ---
  // Preto Opaco
  { id: 'caldereta-black-opaque', name: 'Copo Caldereta', imageUrl: 'https://placehold.co/400x400.png', basePrice: 2.30, colorName: 'Preto', colorHex: '#000000', opacityType: 'Opaco', rimColor: 'Nenhuma', printableArea: { widthPercent: 95, heightPercent: 80 }, 'data-ai-hint': 'black cup' },
  { id: 'caldereta-black-opaque-gold', name: 'Copo Caldereta', imageUrl: 'https://placehold.co/400x400.png', basePrice: 2.80, colorName: 'Preto', colorHex: '#000000', opacityType: 'Opaco', rimColor: 'Dourada', printableArea: { widthPercent: 95, heightPercent: 80 }, 'data-ai-hint': 'black cup' },
  { id: 'caldereta-black-opaque-silver', name: 'Copo Caldereta', imageUrl: 'https://placehold.co/400x400.png', basePrice: 2.80, colorName: 'Preto', colorHex: '#000000', opacityType: 'Opaco', rimColor: 'Prateada', printableArea: { widthPercent: 95, heightPercent: 80 }, 'data-ai-hint': 'black cup' },
  // Preto Translúcido
  { id: 'caldereta-black-translucent', name: 'Copo Caldereta', imageUrl: 'https://placehold.co/400x400.png', basePrice: 2.50, colorName: 'Preto', colorHex: '#000000', opacityType: 'Translúcido', rimColor: 'Nenhuma', printableArea: { widthPercent: 95, heightPercent: 80 }, 'data-ai-hint': 'black cup' },
  { id: 'caldereta-black-translucent-gold', name: 'Copo Caldereta', imageUrl: 'https://placehold.co/400x400.png', basePrice: 3.00, colorName: 'Preto', colorHex: '#000000', opacityType: 'Translúcido', rimColor: 'Dourada', printableArea: { widthPercent: 95, heightPercent: 80 }, 'data-ai-hint': 'black cup' },
  { id: 'caldereta-black-translucent-silver', name: 'Copo Caldereta', imageUrl: 'https://placehold.co/400x400.png', basePrice: 3.00, colorName: 'Preto', colorHex: '#000000', opacityType: 'Translúcido', rimColor: 'Prateada', printableArea: { widthPercent: 95, heightPercent: 80 }, 'data-ai-hint': 'black cup' },
  // Branco Opaco
  { id: 'caldereta-white-opaque', name: 'Copo Caldereta', imageUrl: 'https://placehold.co/400x400.png', basePrice: 2.20, colorName: 'Branco', colorHex: '#FFFFFF', opacityType: 'Opaco', rimColor: 'Nenhuma', printableArea: { widthPercent: 95, heightPercent: 80 }, 'data-ai-hint': 'white cup' },
  { id: 'caldereta-white-opaque-gold', name: 'Copo Caldereta', imageUrl: 'https://placehold.co/400x400.png', basePrice: 2.70, colorName: 'Branco', colorHex: '#FFFFFF', opacityType: 'Opaco', rimColor: 'Dourada', printableArea: { widthPercent: 95, heightPercent: 80 }, 'data-ai-hint': 'white cup' },
  { id: 'caldereta-white-opaque-silver', name: 'Copo Caldereta', imageUrl: 'https://placehold.co/400x400.png', basePrice: 2.70, colorName: 'Branco', colorHex: '#FFFFFF', opacityType: 'Opaco', rimColor: 'Prateada', printableArea: { widthPercent: 95, heightPercent: 80 }, 'data-ai-hint': 'white cup' },
  // Cristal Translúcido
  { id: 'caldereta-clear-translucent', name: 'Copo Caldereta', imageUrl: 'https://placehold.co/400x400.png', basePrice: 2.40, colorName: 'Cristal', colorHex: '#FFFFFF', opacityType: 'Translúcido', rimColor: 'Nenhuma', printableArea: { widthPercent: 95, heightPercent: 80 }, 'data-ai-hint': 'clear cup' },
  { id: 'caldereta-clear-translucent-gold', name: 'Copo Caldereta', imageUrl: 'https://placehold.co/400x400.png', basePrice: 2.90, colorName: 'Cristal', colorHex: '#FFFFFF', opacityType: 'Translúcido', rimColor: 'Dourada', printableArea: { widthPercent: 95, heightPercent: 80 }, 'data-ai-hint': 'clear cup' },
  { id: 'caldereta-clear-translucent-silver', name: 'Copo Caldereta', imageUrl: 'https://placehold.co/400x400.png', basePrice: 2.90, colorName: 'Cristal', colorHex: '#FFFFFF', opacityType: 'Translúcido', rimColor: 'Prateada', printableArea: { widthPercent: 95, heightPercent: 80 }, 'data-ai-hint': 'clear cup' },
];

interface GroupedModel {
  name: string;
  printableArea?: { widthPercent: number; heightPercent: number; };
  variations: CupModel[];
  uniqueColors: { colorName: string; colorHex: string; }[];
  uniqueOpacities: string[];
  uniqueRimColors: ('Nenhuma' | 'Dourada' | 'Prateada')[];
  previewImage: string;
}

interface CupSelectorProps {
  onSelect: (cup: CupModel) => void;
}

export function CupSelector({ onSelect }: CupSelectorProps) {
  const groupedModels = useMemo<Record<string, GroupedModel>>(() => {
    const groups: Record<string, Omit<GroupedModel, 'uniqueColors' | 'uniqueOpacities' | 'uniqueRimColors' | 'previewImage'>> = {};
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
      
      const rimColors = new Set<'Nenhuma' | 'Dourada' | 'Prateada'>();
      group.variations.forEach(v => {
        if (v.rimColor) rimColors.add(v.rimColor);
      });
      const uniqueRimColors = Array.from(rimColors).sort((a,b) => a === 'Nenhuma' ? -1 : b === 'Nenhuma' ? 1 : a.localeCompare(b));


      const previewImage = group.variations[0].imageUrl;

      return [name, { ...group, uniqueColors, uniqueOpacities, uniqueRimColors, previewImage }];
    }));
  }, []);

  const [activeGroupName, setActiveGroupName] = useState<string>(Object.keys(groupedModels)[0]);

  const [selectedVariations, setSelectedVariations] = useState<Record<string, string>>(() => {
    const initialState: Record<string, string> = {};
    for (const name in groupedModels) {
      initialState[name] = groupedModels[name].variations[0].id;
    }
    return initialState;
  });

  const handleSelectionChange = (groupName: string, newColor?: string, newOpacity?: string, newRim?: 'Nenhuma' | 'Dourada' | 'Prateada') => {
    const currentVariation = cupModels.find(c => c.id === selectedVariations[groupName])!;
    const currentColor = newColor || currentVariation.colorName;
    const currentOpacity = newOpacity || currentVariation.opacityType;
    const currentRim = newRim || currentVariation.rimColor;

    const group = groupedModels[groupName];
    let bestMatch = group.variations.find(v => v.colorName === currentColor && v.opacityType === currentOpacity && v.rimColor === currentRim);

    // Fallback if the specific combination doesn't exist (it should, with the new data)
    if (!bestMatch) {
      bestMatch = group.variations.find(v => v.colorName === currentColor && v.opacityType === currentOpacity) || group.variations.find(v => v.colorName === currentColor) || group.variations[0];
    }
    
    setSelectedVariations(prev => ({
      ...prev,
      [groupName]: bestMatch!.id,
    }));
  };

  const activeGroup = groupedModels[activeGroupName];
  const selectedVariation = cupModels.find(c => c.id === selectedVariations[activeGroupName])!;
  
  const availableOpacitiesForSelectedColor = new Set(
    activeGroup.variations
      .filter(v => v.colorName === selectedVariation.colorName && v.rimColor === selectedVariation.rimColor)
      .map(v => v.opacityType)
  );

  const availableRimColorsForSelectedColorAndOpacity = new Set(
    activeGroup.variations
      .filter(v => v.colorName === selectedVariation.colorName && v.opacityType === selectedVariation.opacityType)
      .map(v => v.rimColor)
  );


  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">1. Escolha o Modelo do Copo</CardTitle>
        <CardDescription>Selecione um modelo na lista e personalize a cor e o acabamento.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="md:col-span-3">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="flex flex-col items-center">
                  <div className="aspect-square relative w-full mb-4 rounded-lg bg-secondary/30">
                    <Image
                      src={selectedVariation.imageUrl}
                      alt={selectedVariation.name}
                      fill
                      className="object-contain transition-all p-4"
                      data-ai-hint={selectedVariation['data-ai-hint']}
                      key={selectedVariation.id}
                    />
                  </div>
                  <h3 className="font-bold text-center text-2xl font-headline">{activeGroup.name}</h3>
                   <p className="text-xl font-bold text-primary text-center">
                      R$ {selectedVariation.basePrice.toFixed(2).replace('.', ',')}
                      <span className="text-sm font-normal text-muted-foreground"> /un.</span>
                  </p>
              </div>
              <div className="space-y-6">
                {activeGroup.uniqueColors.length > 1 && (
                    <div className="space-y-2">
                        <Label className="font-semibold">Cor: <span className="font-normal text-muted-foreground">{selectedVariation.colorName}</span></Label>
                        <div className="flex flex-wrap gap-2">
                        {activeGroup.uniqueColors.map(color => (
                            <button
                            key={color.colorName}
                            title={color.colorName}
                            onClick={() => handleSelectionChange(activeGroup.name, color.colorName)}
                            className={cn(
                                "w-8 h-8 rounded-full border-2 transition-transform hover:scale-110",
                                selectedVariation.colorName === color.colorName ? 'ring-2 ring-offset-2 ring-primary' : 'border-card',
                                color.colorHex === '#FFFFFF' && 'border-gray-300'
                            )}
                            style={{ backgroundColor: color.colorHex }}
                            />
                        ))}
                        </div>
                    </div>
                )}
                
                {activeGroup.uniqueOpacities.length > 1 && (
                    <div className="space-y-2">
                        <Label className="font-semibold">Acabamento</Label>
                        <RadioGroup
                            value={selectedVariation.opacityType}
                            onValueChange={(opacity) => handleSelectionChange(activeGroup.name, undefined, opacity)}
                            className="flex gap-4"
                        >
                            {activeGroup.uniqueOpacities.map(opacity => (
                                <div key={opacity} className="flex items-center space-x-2">
                                    <RadioGroupItem 
                                        value={opacity} 
                                        id={`${activeGroup.name}-${opacity}`}
                                        disabled={!availableOpacitiesForSelectedColor.has(opacity)}
                                    />
                                    <Label htmlFor={`${activeGroup.name}-${opacity}`} className={cn("font-normal", !availableOpacitiesForSelectedColor.has(opacity) && "text-muted-foreground/50")}>{opacity}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>
                )}

                {activeGroup.uniqueRimColors.length > 1 && (
                    <div className="space-y-2">
                        <Label className="font-semibold">Borda</Label>
                        <RadioGroup
                            value={selectedVariation.rimColor}
                            onValueChange={(rim) => handleSelectionChange(activeGroup.name, undefined, undefined, rim as any)}
                            className="flex gap-4"
                        >
                            {activeGroup.uniqueRimColors.map(rim => (
                                <div key={rim} className="flex items-center space-x-2">
                                    <RadioGroupItem
                                        value={rim}
                                        id={`${activeGroup.name}-rim-${rim}`}
                                        disabled={!availableRimColorsForSelectedColorAndOpacity.has(rim)}
                                    />
                                    <Label htmlFor={`${activeGroup.name}-rim-${rim}`} className={cn("font-normal", !availableRimColorsForSelectedColorAndOpacity.has(rim) && "text-muted-foreground/50")}>{rim}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="md:col-span-1">
             <Label className="font-semibold mb-2 block">Modelos Disponíveis</Label>
             <ScrollArea className="h-full max-h-[450px] pr-4">
                <div className="grid grid-cols-2 gap-3">
                  {Object.values(groupedModels).map((group) => (
                    <button
                      key={group.name}
                      onClick={() => setActiveGroupName(group.name)}
                      className={cn(
                        "flex flex-col items-center gap-2 p-2 rounded-lg border text-center transition-colors",
                        group.name === activeGroupName ? 'bg-primary/10 border-primary ring-2 ring-primary' : 'bg-card hover:bg-secondary/50'
                      )}
                    >
                      <div className="relative w-20 h-20 bg-secondary/30 rounded-md shrink-0">
                        <Image
                          src={group.previewImage}
                          alt={group.name}
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                      <span className="font-medium text-xs h-8 flex items-center">{group.name}</span>
                    </button>
                  ))}
                </div>
             </ScrollArea>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => onSelect(selectedVariation)} size="lg" className="w-full md:w-auto md:ml-auto">
            Selecionar este Copo e Avançar
        </Button>
      </CardFooter>
    </Card>
  );
}
