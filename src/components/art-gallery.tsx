
'use client';
import { useState, useTransition, useMemo, useRef, useEffect, useActionState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { handleArtGeneration, handleArtAnalysis, handleImageValidation } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2, Type, Download, Trash2, Palette, Box, UploadCloud, Settings2, HelpCircle, ArrowLeft, PaintBucket, ChevronsUpDown } from 'lucide-react';
import type { GeneratedArt, CupModel, OrderDetails } from '@/lib/types';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Slider } from './ui/slider';
import { Separator } from './ui/separator';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from './ui/tooltip';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { DrawingCanvas } from './drawing-canvas';
import { QuoteSummary } from './quote-summary';
import { Loader } from './loader';

const LONG_DRINK_SVG = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2MCAxMjAiPjxwYXRoIGQ9Ik01LDAgSDU1IEw1MCwxMjAgSDEwIFoiIGZpbGw9ImJsYWNrIi8+PC9zdmc+';
const TWISTER_SVG = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA3MCAxNDAiPjxwYXRoIGQ9Ik0wIDEwaDcwdjE1SDB6TTEwIDMwaDUwbC01IDEwMEgxNXpNMzIgMGg2djEwaC02eiIgZmlsbD0iYmxhY2siLz48L3N2Zz4=';
const CALDERETA_SVG = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4MCAxMDAiPjxwYXRoIGQ9Ik01LDAgSDc1IEw2NSwxMDAgSDE1IFoiIGZpbGw9ImJsYWNrIi8+PC9zdmc+';

const cupModelsData: CupModel[] = [
  // --- Long Drink ---
  { id: 'ld-white-opaque', name: 'Copo Long Drink', imageUrl: LONG_DRINK_SVG, basePrice: 2.50, colorName: 'Branco', colorHex: '#FFFFFF', opacityType: 'Opaco', rimColor: 'Nenhuma', printableArea: { widthPercent: 85, heightPercent: 70, width_mm: 58, height_mm: 80 }, 'data-ai-hint': 'white cup' },
  { id: 'ld-white-opaque-gold', name: 'Copo Long Drink', imageUrl: LONG_DRINK_SVG, basePrice: 3.00, colorName: 'Branco', colorHex: '#FFFFFF', opacityType: 'Opaco', rimColor: 'Dourada', printableArea: { widthPercent: 85, heightPercent: 70, width_mm: 58, height_mm: 80 }, 'data-ai-hint': 'white cup' },
  { id: 'ld-white-opaque-silver', name: 'Copo Long Drink', imageUrl: LONG_DRINK_SVG, basePrice: 3.00, colorName: 'Branco', colorHex: '#FFFFFF', opacityType: 'Opaco', rimColor: 'Prateada', printableArea: { widthPercent: 85, heightPercent: 70, width_mm: 58, height_mm: 80 }, 'data-ai-hint': 'white cup' },
  { id: 'ld-white-translucent', name: 'Copo Long Drink', imageUrl: LONG_DRINK_SVG, basePrice: 2.70, colorName: 'Branco', colorHex: '#FFFFFF', opacityType: 'Translúcido', rimColor: 'Nenhuma', printableArea: { widthPercent: 85, heightPercent: 70, width_mm: 58, height_mm: 80 }, 'data-ai-hint': 'white cup' },
  { id: 'ld-white-translucent-gold', name: 'Copo Long Drink', imageUrl: LONG_DRINK_SVG, basePrice: 3.20, colorName: 'Branco', colorHex: '#FFFFFF', opacityType: 'Translúcido', rimColor: 'Dourada', printableArea: { widthPercent: 85, heightPercent: 70, width_mm: 58, height_mm: 80 }, 'data-ai-hint': 'white cup' },
  { id: 'ld-white-translucent-silver', name: 'Copo Long Drink', imageUrl: LONG_DRINK_SVG, basePrice: 3.20, colorName: 'Branco', colorHex: '#FFFFFF', opacityType: 'Translúcido', rimColor: 'Prateada', printableArea: { widthPercent: 85, heightPercent: 70, width_mm: 58, height_mm: 80 }, 'data-ai-hint': 'white cup' },
  { id: 'ld-black-opaque', name: 'Copo Long Drink', imageUrl: LONG_DRINK_SVG, basePrice: 2.50, colorName: 'Preto', colorHex: '#000000', opacityType: 'Opaco', rimColor: 'Nenhuma', printableArea: { widthPercent: 85, heightPercent: 70, width_mm: 58, height_mm: 80 }, 'data-ai-hint': 'black cup' },
  { id: 'ld-black-opaque-gold', name: 'Copo Long Drink', imageUrl: LONG_DRINK_SVG, basePrice: 3.00, colorName: 'Preto', colorHex: '#000000', opacityType: 'Opaco', rimColor: 'Dourada', printableArea: { widthPercent: 85, heightPercent: 70, width_mm: 58, height_mm: 80 }, 'data-ai-hint': 'black cup' },
  { id: 'ld-black-opaque-silver', name: 'Copo Long Drink', imageUrl: LONG_DRINK_SVG, basePrice: 3.00, colorName: 'Preto', colorHex: '#000000', opacityType: 'Opaco', rimColor: 'Prateada', printableArea: { widthPercent: 85, heightPercent: 70, width_mm: 58, height_mm: 80 }, 'data-ai-hint': 'black cup' },
  { id: 'ld-black-translucent', name: 'Copo Long Drink', imageUrl: LONG_DRINK_SVG, basePrice: 2.70, colorName: 'Preto', colorHex: '#000000', opacityType: 'Translúcido', rimColor: 'Nenhuma', printableArea: { widthPercent: 85, heightPercent: 70, width_mm: 58, height_mm: 80 }, 'data-ai-hint': 'black cup' },
  { id: 'ld-black-translucent-gold', name: 'Copo Long Drink', imageUrl: LONG_DRINK_SVG, basePrice: 3.20, colorName: 'Preto', colorHex: '#000000', opacityType: 'Translúcido', rimColor: 'Dourada', printableArea: { widthPercent: 85, heightPercent: 70, width_mm: 58, height_mm: 80 }, 'data-ai-hint': 'black cup' },
  { id: 'ld-black-translucent-silver', name: 'Copo Long Drink', imageUrl: LONG_DRINK_SVG, basePrice: 3.20, colorName: 'Preto', colorHex: '#000000', opacityType: 'Translúcido', rimColor: 'Prateada', printableArea: { widthPercent: 85, heightPercent: 70, width_mm: 58, height_mm: 80 }, 'data-ai-hint': 'black cup' },
  { id: 'ld-blue-opaque', name: 'Copo Long Drink', imageUrl: LONG_DRINK_SVG, basePrice: 2.50, colorName: 'Azul', colorHex: '#3b82f6', opacityType: 'Opaco', rimColor: 'Nenhuma', printableArea: { widthPercent: 85, heightPercent: 70, width_mm: 58, height_mm: 80 }, 'data-ai-hint': 'blue cup' },
  { id: 'ld-blue-opaque-gold', name: 'Copo Long Drink', imageUrl: LONG_DRINK_SVG, basePrice: 3.00, colorName: 'Azul', colorHex: '#3b82f6', opacityType: 'Opaco', rimColor: 'Dourada', printableArea: { widthPercent: 85, heightPercent: 70, width_mm: 58, height_mm: 80 }, 'data-ai-hint': 'blue cup' },
  { id: 'ld-blue-opaque-silver', name: 'Copo Long Drink', imageUrl: LONG_DRINK_SVG, basePrice: 3.00, colorName: 'Azul', colorHex: '#3b82f6', opacityType: 'Opaco', rimColor: 'Prateada', printableArea: { widthPercent: 85, heightPercent: 70, width_mm: 58, height_mm: 80 }, 'data-ai-hint': 'blue cup' },
  { id: 'ld-blue-translucent', name: 'Copo Long Drink', imageUrl: LONG_DRINK_SVG, basePrice: 2.70, colorName: 'Azul', colorHex: '#3b82f6', opacityType: 'Translúcido', rimColor: 'Nenhuma', printableArea: { widthPercent: 85, heightPercent: 70, width_mm: 58, height_mm: 80 }, 'data-ai-hint': 'blue cup' },
  { id: 'ld-blue-translucent-gold', name: 'Copo Long Drink', imageUrl: LONG_DRINK_SVG, basePrice: 3.20, colorName: 'Azul', colorHex: '#3b82f6', opacityType: 'Translúcido', rimColor: 'Dourada', printableArea: { widthPercent: 85, heightPercent: 70, width_mm: 58, height_mm: 80 }, 'data-ai-hint': 'blue cup' },
  { id: 'ld-blue-translucent-silver', name: 'Copo Long Drink', imageUrl: LONG_DRINK_SVG, basePrice: 3.20, colorName: 'Azul', colorHex: '#3b82f6', opacityType: 'Translúcido', rimColor: 'Prateada', printableArea: { widthPercent: 85, heightPercent: 70, width_mm: 58, height_mm: 80 }, 'data-ai-hint': 'blue cup' },
  { id: 'ld-pink-opaque', name: 'Copo Long Drink', imageUrl: LONG_DRINK_SVG, basePrice: 2.50, colorName: 'Rosa', colorHex: '#ec4899', opacityType: 'Opaco', rimColor: 'Nenhuma', printableArea: { widthPercent: 85, heightPercent: 70, width_mm: 58, height_mm: 80 }, 'data-ai-hint': 'pink cup' },
  { id: 'ld-pink-opaque-gold', name: 'Copo Long Drink', imageUrl: LONG_DRINK_SVG, basePrice: 3.00, colorName: 'Rosa', colorHex: '#ec4899', opacityType: 'Opaco', rimColor: 'Dourada', printableArea: { widthPercent: 85, heightPercent: 70, width_mm: 58, height_mm: 80 }, 'data-ai-hint': 'pink cup' },
  { id: 'ld-pink-opaque-silver', name: 'Copo Long Drink', imageUrl: LONG_DRINK_SVG, basePrice: 3.00, colorName: 'Rosa', colorHex: '#ec4899', opacityType: 'Opaco', rimColor: 'Prateada', printableArea: { widthPercent: 85, heightPercent: 70, width_mm: 58, height_mm: 80 }, 'data-ai-hint': 'pink cup' },
  { id: 'ld-pink-translucent', name: 'Copo Long Drink', imageUrl: LONG_DRINK_SVG, basePrice: 2.70, colorName: 'Rosa', colorHex: '#ec4899', opacityType: 'Translúcido', rimColor: 'Nenhuma', printableArea: { widthPercent: 85, heightPercent: 70, width_mm: 58, height_mm: 80 }, 'data-ai-hint': 'pink cup' },
  { id: 'ld-pink-translucent-gold', name: 'Copo Long Drink', imageUrl: LONG_DRINK_SVG, basePrice: 3.20, colorName: 'Rosa', colorHex: '#ec4899', opacityType: 'Translúcido', rimColor: 'Dourada', printableArea: { widthPercent: 85, heightPercent: 70, width_mm: 58, height_mm: 80 }, 'data-ai-hint': 'pink cup' },
  { id: 'ld-pink-translucent-silver', name: 'Copo Long Drink', imageUrl: LONG_DRINK_SVG, basePrice: 3.20, colorName: 'Rosa', colorHex: '#ec4899', opacityType: 'Translúcido', rimColor: 'Prateada', printableArea: { widthPercent: 85, heightPercent: 70, width_mm: 58, height_mm: 80 }, 'data-ai-hint': 'pink cup' },
  // --- Twister ---
  { id: 'twister-white-opaque', name: 'Copo Twister com Tampa', imageUrl: TWISTER_SVG, basePrice: 3.85, colorName: 'Branco', colorHex: '#FFFFFF', opacityType: 'Opaco', rimColor: 'Nenhuma', printableArea: { widthPercent: 90, heightPercent: 60, width_mm: 65, height_mm: 90 }, 'data-ai-hint': 'white cup' },
  { id: 'twister-white-opaque-gold', name: 'Copo Twister com Tampa', imageUrl: TWISTER_SVG, basePrice: 4.35, colorName: 'Branco', colorHex: '#FFFFFF', opacityType: 'Opaco', rimColor: 'Dourada', printableArea: { widthPercent: 90, heightPercent: 60, width_mm: 65, height_mm: 90 }, 'data-ai-hint': 'white cup' },
  { id: 'twister-white-opaque-silver', name: 'Copo Twister com Tampa', imageUrl: TWISTER_SVG, basePrice: 4.35, colorName: 'Branco', colorHex: '#FFFFFF', opacityType: 'Opaco', rimColor: 'Prateada', printableArea: { widthPercent: 90, heightPercent: 60, width_mm: 65, height_mm: 90 }, 'data-ai-hint': 'white cup' },
  { id: 'twister-clear-translucent', name: 'Copo Twister com Tampa', imageUrl: TWISTER_SVG, basePrice: 3.75, colorName: 'Cristal', colorHex: '#FFFFFF', opacityType: 'Translúcido', rimColor: 'Nenhuma', printableArea: { widthPercent: 90, heightPercent: 60, width_mm: 65, height_mm: 90 }, 'data-ai-hint': 'clear cup' },
  { id: 'twister-clear-translucent-gold', name: 'Copo Twister com Tampa', imageUrl: TWISTER_SVG, basePrice: 4.25, colorName: 'Cristal', colorHex: '#FFFFFF', opacityType: 'Translúcido', rimColor: 'Dourada', printableArea: { widthPercent: 90, heightPercent: 60, width_mm: 65, height_mm: 90 }, 'data-ai-hint': 'clear cup' },
  { id: 'twister-clear-translucent-silver', name: 'Copo Twister com Tampa', imageUrl: TWISTER_SVG, basePrice: 4.25, colorName: 'Cristal', colorHex: '#FFFFFF', opacityType: 'Translúcido', rimColor: 'Prateada', printableArea: { widthPercent: 90, heightPercent: 60, width_mm: 65, height_mm: 90 }, 'data-ai-hint': 'clear cup' },
  { id: 'twister-red-opaque', name: 'Copo Twister com Tampa', imageUrl: TWISTER_SVG, basePrice: 3.85, colorName: 'Vermelho', colorHex: '#ef4444', opacityType: 'Opaco', rimColor: 'Nenhuma', printableArea: { widthPercent: 90, heightPercent: 60, width_mm: 65, height_mm: 90 }, 'data-ai-hint': 'red cup' },
  { id: 'twister-red-opaque-gold', name: 'Copo Twister com Tampa', imageUrl: TWISTER_SVG, basePrice: 4.35, colorName: 'Vermelho', colorHex: '#ef4444', opacityType: 'Opaco', rimColor: 'Dourada', printableArea: { widthPercent: 90, heightPercent: 60, width_mm: 65, height_mm: 90 }, 'data-ai-hint': 'red cup' },
  { id: 'twister-red-opaque-silver', name: 'Copo Twister com Tampa', imageUrl: TWISTER_SVG, basePrice: 4.35, colorName: 'Vermelho', colorHex: '#ef4444', opacityType: 'Opaco', rimColor: 'Prateada', printableArea: { widthPercent: 90, heightPercent: 60, width_mm: 65, height_mm: 90 }, 'data-ai-hint': 'red cup' },
  { id: 'twister-red-translucent', name: 'Copo Twister com Tampa', imageUrl: TWISTER_SVG, basePrice: 4.05, colorName: 'Vermelho', colorHex: '#ef4444', opacityType: 'Translúcido', rimColor: 'Nenhuma', printableArea: { widthPercent: 90, heightPercent: 60, width_mm: 65, height_mm: 90 }, 'data-ai-hint': 'red cup' },
  { id: 'twister-red-translucent-gold', name: 'Copo Twister com Tampa', imageUrl: TWISTER_SVG, basePrice: 4.55, colorName: 'Vermelho', colorHex: '#ef4444', opacityType: 'Translúcido', rimColor: 'Dourada', printableArea: { widthPercent: 90, heightPercent: 60, width_mm: 65, height_mm: 90 }, 'data-ai-hint': 'red cup' },
  { id: 'twister-red-translucent-silver', name: 'Copo Twister com Tampa', imageUrl: TWISTER_SVG, basePrice: 4.55, colorName: 'Vermelho', colorHex: '#ef4444', opacityType: 'Translúcido', rimColor: 'Prateada', printableArea: { widthPercent: 90, heightPercent: 60, width_mm: 65, height_mm: 90 }, 'data-ai-hint': 'red cup' },
  // --- Caldereta ---
  { id: 'caldereta-black-opaque', name: 'Copo Caldereta', imageUrl: CALDERETA_SVG, basePrice: 2.30, colorName: 'Preto', colorHex: '#000000', opacityType: 'Opaco', rimColor: 'Nenhuma', printableArea: { widthPercent: 95, heightPercent: 80, width_mm: 70, height_mm: 70 }, 'data-ai-hint': 'black cup' },
  { id: 'caldereta-black-opaque-gold', name: 'Copo Caldereta', imageUrl: CALDERETA_SVG, basePrice: 2.80, colorName: 'Preto', colorHex: '#000000', opacityType: 'Opaco', rimColor: 'Dourada', printableArea: { widthPercent: 95, heightPercent: 80, width_mm: 70, height_mm: 70 }, 'data-ai-hint': 'black cup' },
  { id: 'caldereta-black-opaque-silver', name: 'Copo Caldereta', imageUrl: CALDERETA_SVG, basePrice: 2.80, colorName: 'Preto', colorHex: '#000000', opacityType: 'Opaco', rimColor: 'Prateada', printableArea: { widthPercent: 95, heightPercent: 80, width_mm: 70, height_mm: 70 }, 'data-ai-hint': 'black cup' },
  { id: 'caldereta-black-translucent', name: 'Copo Caldereta', imageUrl: CALDERETA_SVG, basePrice: 2.50, colorName: 'Preto', colorHex: '#000000', opacityType: 'Translúcido', rimColor: 'Nenhuma', printableArea: { widthPercent: 95, heightPercent: 80, width_mm: 70, height_mm: 70 }, 'data-ai-hint': 'black cup' },
  { id: 'caldereta-black-translucent-gold', name: 'Copo Caldereta', imageUrl: CALDERETA_SVG, basePrice: 3.00, colorName: 'Preto', colorHex: '#000000', opacityType: 'Translúcido', rimColor: 'Dourada', printableArea: { widthPercent: 95, heightPercent: 80, width_mm: 70, height_mm: 70 }, 'data-ai-hint': 'black cup' },
  { id: 'caldereta-black-translucent-silver', name: 'Copo Caldereta', imageUrl: CALDERETA_SVG, basePrice: 3.00, colorName: 'Preto', colorHex: '#000000', opacityType: 'Translúcido', rimColor: 'Prateada', printableArea: { widthPercent: 95, heightPercent: 80, width_mm: 70, height_mm: 70 }, 'data-ai-hint': 'black cup' },
  { id: 'caldereta-white-opaque', name: 'Copo Caldereta', imageUrl: CALDERETA_SVG, basePrice: 2.20, colorName: 'Branco', colorHex: '#FFFFFF', opacityType: 'Opaco', rimColor: 'Nenhuma', printableArea: { widthPercent: 95, heightPercent: 80, width_mm: 70, height_mm: 70 }, 'data-ai-hint': 'white cup' },
  { id: 'caldereta-white-opaque-gold', name: 'Copo Caldereta', imageUrl: CALDERETA_SVG, basePrice: 2.70, colorName: 'Branco', colorHex: '#FFFFFF', opacityType: 'Opaco', rimColor: 'Dourada', printableArea: { widthPercent: 95, heightPercent: 80, width_mm: 70, height_mm: 70 }, 'data-ai-hint': 'white cup' },
  { id: 'caldereta-white-opaque-silver', name: 'Copo Caldereta', imageUrl: CALDERETA_SVG, basePrice: 2.70, colorName: 'Branco', colorHex: '#FFFFFF', opacityType: 'Opaco', rimColor: 'Prateada', printableArea: { widthPercent: 95, heightPercent: 80, width_mm: 70, height_mm: 70 }, 'data-ai-hint': 'white cup' },
  { id: 'caldereta-clear-translucent', name: 'Copo Caldereta', imageUrl: CALDERETA_SVG, basePrice: 2.40, colorName: 'Cristal', colorHex: '#FFFFFF', opacityType: 'Translúcido', rimColor: 'Nenhuma', printableArea: { widthPercent: 95, heightPercent: 80, width_mm: 70, height_mm: 70 }, 'data-ai-hint': 'clear cup' },
  { id: 'caldereta-clear-translucent-gold', name: 'Copo Caldereta', imageUrl: CALDERETA_SVG, basePrice: 2.90, colorName: 'Cristal', colorHex: '#FFFFFF', opacityType: 'Translúcido', rimColor: 'Dourada', printableArea: { widthPercent: 95, heightPercent: 80, width_mm: 70, height_mm: 70 }, 'data-ai-hint': 'clear cup' },
  { id: 'caldereta-clear-translucent-silver', name: 'Copo Caldereta', imageUrl: CALDERETA_SVG, basePrice: 2.90, colorName: 'Cristal', colorHex: '#FFFFFF', opacityType: 'Translúcido', rimColor: 'Prateada', printableArea: { widthPercent: 95, heightPercent: 80, width_mm: 70, height_mm: 70 }, 'data-ai-hint': 'clear cup' },
];

const PLAIN_ART_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

interface ArtStudioProps {
  cupType: string;
  onFinalize: (details: OrderDetails) => void;
  onBack: () => void;
}

interface TextOverlay {
  id: number;
  text: string;
  color: string;
  size: number;
  x: number; // percentage
  y: number; // percentage
  rotation: number; // degrees
  scale: number; // multiplier
}

export function ArtGallery({ cupType, onFinalize, onBack }: ArtStudioProps) { // Renamed internally to ArtStudio
  // === STATE MANAGEMENT ===
  const { toast } = useToast();
  
  // Transitions & Loaders
  const [isProcessing, startProcessingTransition] = useTransition();
  const [isGenerating, startGeneratingTransition] = useTransition();
  const [isAnalyzing, startAnalysisTransition] = useTransition();
  const [isUploading, startUploadingTransition] = useTransition();
  const [loaderMessage, setLoaderMessage] = useState('');

  // Cup Selection State
  const availableModels = useMemo(() => cupModelsData.filter(m => m.name === cupType), [cupType]);
  const [selectedCup, setSelectedCup] = useState<CupModel>(availableModels[0]);

  // Art State
  const [artMethod, setArtMethod] = useState<'ai' | 'upload' | 'draw' | 'plain' | 'background'>('ai');
  const [artHistory, setArtHistory] = useState<GeneratedArt[]>([]);
  const [selectedArtIndex, setSelectedArtIndex] = useState(0);
  const currentArt = useMemo(() => artHistory[selectedArtIndex], [artHistory, selectedArtIndex]);
  const [eventDescription, setEventDescription] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');

  // Text Overlay State
  const [texts, setTexts] = useState<TextOverlay[]>([]);
  const [selectedTextId, setSelectedTextId] = useState<number | null>(null);
  const selectedText = useMemo(() => texts.find(t => t.id === selectedTextId), [texts, selectedTextId]);
  const [isDragging, setIsDragging] = useState(false);

  // Quote State
  const [showQuote, setShowQuote] = useState(false);
  const [finalArt, setFinalArt] = useState<GeneratedArt | null>(null);
  const [artComplexity, setArtComplexity] = useState<{ score: number, reasoning: string } | null>(null);
  
  // Refs
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const printableAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragInfoRef = useRef<{ id: number, startX: number, startY: number, textStartX: number, textStartY: number } | null>(null);


  // === DERIVED DATA & OPTIONS ===
  const cupOptions = useMemo(() => {
    const colors = new Map<string, string>();
    availableModels.forEach(v => { if(v.colorName && v.colorHex) colors.set(v.colorName, v.colorHex) });
    const opacities = new Set<string>();
    availableModels.forEach(v => { if (v.opacityType) opacities.add(v.opacityType) });
    const rimColors = new Set<'Nenhuma' | 'Dourada' | 'Prateada'>();
    availableModels.forEach(v => { if (v.rimColor) rimColors.add(v.rimColor) });

    return {
      uniqueColors: Array.from(colors.entries()).map(([colorName, colorHex]) => ({ colorName, colorHex })),
      uniqueOpacities: Array.from(opacities),
      uniqueRimColors: Array.from(rimColors).sort((a,b) => a === 'Nenhuma' ? -1 : b === 'Nenhuma' ? 1 : a.localeCompare(b)),
    };
  }, [availableModels]);

  // === EFFECTS ===
  // Reset art when cup changes
  useEffect(() => {
    setArtHistory([]);
    setSelectedArtIndex(0);
    setTexts([]);
    setSelectedTextId(null);
  }, [selectedCup]);

  // Effect to handle dragging logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !dragInfoRef.current || !printableAreaRef.current) return;

      const containerRect = printableAreaRef.current.getBoundingClientRect();
      const dx = e.clientX - dragInfoRef.current.startX;
      const dy = e.clientY - dragInfoRef.current.startY;
      
      const newPixelX = dragInfoRef.current.textStartX + dx;
      const newPixelY = dragInfoRef.current.textStartY + dy;

      const newPercentX = (newPixelX / containerRect.width) * 100;
      const newPercentY = (newPixelY / containerRect.height) * 100;
      
      updateText(dragInfoRef.current.id, { x: newPercentX, y: newPercentY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragInfoRef.current = null;
    };
    
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // === HANDLERS & ACTIONS ===

  // Cup Customization
  const handleCupOptionChange = (newColor?: string, newOpacity?: string, newRim?: 'Nenhuma' | 'Dourada' | 'Prateada') => {
    const currentColor = newColor || selectedCup.colorName;
    const currentOpacity = newOpacity || selectedCup.opacityType;
    const currentRim = newRim || selectedCup.rimColor;
    let bestMatch = availableModels.find(v => v.colorName === currentColor && v.opacityType === currentOpacity && v.rimColor === currentRim);
    if (!bestMatch) {
      bestMatch = availableModels.find(v => v.colorName === currentColor && v.opacityType === currentOpacity) || availableModels.find(v => v.colorName === currentColor) || availableModels[0];
    }
    setSelectedCup(bestMatch!);
  };

  const setArt = (art: GeneratedArt) => {
    const newHistory = [...artHistory, art];
    setArtHistory(newHistory);
    setSelectedArtIndex(newHistory.length - 1);
    setTexts([]);
  }

  // Art Generation
  const handleGenerateAIArt = () => {
    if (!eventDescription) {
      toast({ variant: 'destructive', title: "Descrição vazia", description: "Por favor, descreva sua ideia para a arte."});
      return;
    }
    const form = document.createElement('form');
    const textarea = document.createElement('textarea');
    textarea.name = 'eventDescription';
    textarea.value = eventDescription;
    form.appendChild(textarea);
    const formData = new FormData(form);

    startGeneratingTransition(async () => {
      setLoaderMessage('Gerando sua arte com IA...');
      const result = await handleArtGeneration(selectedCup.name, {}, formData);
      if (result.success) {
        setArt({ id: `art-${Date.now()}`, imageUrl: result.imageUrl, prompt: eventDescription });
      } else {
        toast({ variant: "destructive", title: "Erro na Geração", description: result.error });
      }
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({ variant: "destructive", title: "Arquivo muito grande", description: "Use uma imagem com menos de 5MB." });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        startUploadingTransition(async () => {
          setLoaderMessage('Analisando fundo da imagem...');
          const validationResult = await handleImageValidation(dataUrl);
          if (validationResult.success && validationResult.isValid) {
            setArt({ id: `art-${Date.now()}`, imageUrl: dataUrl, prompt: "Arte enviada pelo usuário" });
          } else {
            toast({ variant: "destructive", title: "Fundo Inválido", description: `${validationResult.reasoning || validationResult.error} Use uma imagem com fundo branco ou transparente.` });
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrawingReady = (dataUrl: string) => {
    setArt({ id: `art-${Date.now()}`, imageUrl: dataUrl, prompt: "Arte desenhada pelo usuário" });
  };
  
  const handleBackgroundReady = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, 512, 512);
      setArt({ id: `art-${Date.now()}`, imageUrl: canvas.toDataURL('image/png'), prompt: `Fundo colorido: ${backgroundColor}`});
    }
  }
  
  const handlePlainArt = () => {
    setArt({ id: 'plain-art', imageUrl: PLAIN_ART_IMAGE, prompt: 'Copo Liso' });
  }

  // Text Editing
  const handleAddText = () => {
    const newId = Date.now();
    const newText: TextOverlay = {
      id: newId,
      text: 'Edite-me',
      color: '#000000',
      size: 40,
      scale: 1,
      x: 50,
      y: 50,
      rotation: 0,
    };
    setTexts([...texts, newText]);
    setSelectedTextId(newId);
  };

  const updateText = (id: number, newProps: Partial<TextOverlay>) => {
    setTexts(texts.map(t => t.id === id ? { ...t, ...newProps } : t));
  };
  
  const handleDeleteText = () => {
    if (selectedTextId === null) return;
    setTexts(texts.filter(t => t.id !== selectedTextId));
    setSelectedTextId(null);
  };

  const handleTextMouseDown = (e: React.MouseEvent<HTMLDivElement>, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (printableAreaRef.current) {
        const textElement = e.currentTarget;
        const containerRect = printableAreaRef.current.getBoundingClientRect();
        
        dragInfoRef.current = {
            id: id,
            startX: e.clientX,
            startY: e.clientY,
            textStartX: textElement.offsetLeft,
            textStartY: textElement.offsetTop,
        };
        setIsDragging(true);
    }
    setSelectedTextId(id);
  };


  const createCompositeImage = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!currentArt) return reject(new Error("Nenhuma arte selecionada."));
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error("Não foi possível criar o contexto do canvas."));

      const image = new window.Image();
      image.crossOrigin = 'Anonymous';
      image.onload = () => {
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        ctx.drawImage(image, 0, 0);
        texts.forEach(text => {
          ctx.save();
          const centerX = canvas.width * (text.x / 100);
          const centerY = canvas.height * (text.y / 100);
          ctx.translate(centerX, centerY);
          ctx.rotate(text.rotation * Math.PI / 180);
          ctx.scale(text.scale, text.scale);
          const scaledSize = text.size * (canvas.width / 500); // Base size relative to 500px canvas
          ctx.fillStyle = text.color;
          ctx.font = `bold ${scaledSize}px Alegreya`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(text.text, 0, 0);
          ctx.restore();
        });
        resolve(canvas.toDataURL('image/png'));
      };
      image.onerror = () => reject(new Error('Falha ao carregar a imagem base.'));
      image.src = currentArt.imageUrl;
    });
  };

  // Finalization
  const handleProceedToQuote = () => {
    startAnalysisTransition(async () => {
      setLoaderMessage('Analisando complexidade da arte...');
      try {
        const finalImageUrl = (texts.length > 0 || !currentArt) ? await createCompositeImage() : currentArt?.imageUrl || PLAIN_ART_IMAGE;
        const finalArtObject: GeneratedArt = {
            id: currentArt?.id || 'plain-art',
            imageUrl: finalImageUrl,
            prompt: currentArt?.prompt || 'Copo Liso'
        };
        
        setFinalArt(finalArtObject);
        const result = await handleArtAnalysis(finalArtObject.imageUrl, finalArtObject.prompt);
        if (result.success) {
          setArtComplexity({ score: result.complexityScore, reasoning: result.reasoning });
          setShowQuote(true);
        } else {
          toast({ variant: "destructive", title: "Erro na Análise", description: result.error });
        }
      } catch (error: any) {
        toast({ variant: 'destructive', title: 'Erro ao processar arte', description: error.message });
      }
    });
  };
  
  // === RENDER LOGIC ===
  if (isGenerating || isUploading || isProcessing || isAnalyzing) {
    return <Loader message={loaderMessage} />;
  }
  
  if (showQuote && finalArt && artComplexity) {
    return (
       <QuoteSummary 
          initialDetails={{
            cupModel: selectedCup,
            art: finalArt,
            eventDescription: finalArt.prompt,
            artComplexity: artComplexity,
          }}
          onFinalize={onFinalize}
          onBack={() => setShowQuote(false)}
        />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
          <Button variant="outline" onClick={onBack}><ArrowLeft className="mr-2"/> Voltar para seleção</Button>
          <div className="text-right">
             <h2 className="font-bold text-2xl font-headline">{cupType}</h2>
             <p className="text-primary font-bold">R$ {selectedCup.basePrice.toFixed(2).replace('.', ',')} / un.</p>
          </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* === PREVIEW PANE (Mobile Top, Desktop Right) === */}
        <div className="lg:sticky lg:top-24 flex flex-col items-center gap-4 lg:order-2">
            <div ref={previewContainerRef} className="relative w-full aspect-square rounded-lg overflow-hidden border bg-card shadow-inner checkerboard" onClick={() => setSelectedTextId(null)}>
               {/* Cup color and shape using a mask */}
              <div
                className="absolute inset-0 transition-colors"
                style={{
                  backgroundColor: selectedCup.colorHex,
                  opacity: selectedCup.opacityType === 'Translúcido' ? 0.75 : 1.0,
                  WebkitMaskImage: `url(${selectedCup.imageUrl})`,
                  maskImage: `url(${selectedCup.imageUrl})`,
                  WebkitMaskSize: 'contain',
                  maskSize: 'contain',
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                  maskPosition: 'center',
                }}
              />
              
              <div className="absolute inset-0 flex items-center justify-center">
                  <div
                      ref={printableAreaRef}
                      className="relative"
                      style={{
                          width: `${selectedCup.printableArea.widthPercent}%`,
                          height: `${selectedCup.printableArea.heightPercent}%`,
                      }}
                  >
                      {/* The art */}
                      {currentArt && (
                           <Image src={currentArt.imageUrl} alt="Arte para o copo" fill className="object-contain pointer-events-none" />
                      )}
                      
                      {/* Text Overlays */}
                      {texts.map((text) => (
                        <div
                            key={text.id}
                            onMouseDown={(e) => handleTextMouseDown(e, text.id)}
                            style={{
                                position: 'absolute',
                                left: `${text.x}%`,
                                top: `${text.y}%`,
                                transform: `translate(-50%, -50%) rotate(${text.rotation}deg) scale(${text.scale})`,
                                color: text.color,
                                fontSize: `${text.size}px`,
                                fontFamily: 'Alegreya, serif',
                                fontWeight: 'bold',
                                whiteSpace: 'pre-wrap',
                                textAlign: 'center',
                                cursor: isDragging ? 'grabbing' : 'grab',
                                userSelect: 'none',
                                padding: '4px',
                                border: selectedTextId === text.id ? '2px dashed hsl(var(--primary))' : '2px dashed transparent',
                            }}
                        >
                            {text.text.replace(/ /g, '\u00a0')}
                        </div>
                      ))}
                  </div>
              </div>
              
              {/* Printable area guideline */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative border-2 border-dashed border-primary/50" style={{ width: `${selectedCup.printableArea.widthPercent}%`, height: `${selectedCup.printableArea.heightPercent}%`}}>
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-card px-1 text-xs text-muted-foreground">{selectedCup.printableArea.width_mm}mm</div>
                    <div className="absolute -left-10 top-1/2 -translate-y-1/2 rotate-[-90deg] bg-card px-1 text-xs text-muted-foreground">{selectedCup.printableArea.height_mm}mm</div>
                  </div>
              </div>

              {!currentArt && <div className="absolute inset-0 flex items-center justify-center text-muted-foreground pointer-events-none"><p>Sua arte aparecerá aqui</p></div>}
            </div>
        </div>

        {/* === CONTROLS PANE (Mobile Bottom, Desktop Left) === */}
        <div className="lg:order-1">
          <Card className="w-full">
            <CardContent className="p-4 sm:p-6 space-y-6">
              {/* Section 1: Customize Cup */}
              <div>
                <h3 className="font-semibold text-lg mb-4">1. Personalize o Copo</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                      <Label>Cor: <span className="font-normal text-muted-foreground">{selectedCup.colorName}</span></Label>
                      <div className="flex flex-wrap gap-2">
                      {cupOptions.uniqueColors.map(color => (
                          <button key={color.colorName} title={color.colorName} onClick={() => handleCupOptionChange(color.colorName)}
                              className={cn("w-7 h-7 rounded-full border-2 transition-transform hover:scale-110", selectedCup.colorName === color.colorName ? 'ring-2 ring-offset-2 ring-primary' : 'border-card', color.colorHex === '#FFFFFF' && 'border-gray-300')}
                              style={{ backgroundColor: color.colorHex }} />
                      ))}
                      </div>
                  </div>
                  <div className="space-y-2">
                      <Label className="font-semibold">Acabamento</Label>
                      <div className="flex flex-wrap gap-3">
                        {cupOptions.uniqueOpacities.map((opacity) => (
                          <TooltipProvider key={opacity}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() => handleCupOptionChange(undefined, opacity)}
                                  aria-label={opacity}
                                  className={cn(
                                    'relative h-10 w-10 rounded-full border-2 flex items-center justify-center transition-transform hover:scale-105 overflow-hidden',
                                    selectedCup.opacityType === opacity
                                      ? 'ring-2 ring-offset-2 ring-primary'
                                      : 'border-input'
                                  )}
                                >
                                  {opacity === 'Translúcido' && (
                                    <div
                                      className="absolute inset-0 checkerboard"
                                    />
                                  )}
                                  <div
                                    className="relative h-7 w-7 rounded-full"
                                    style={{
                                      backgroundColor: selectedCup.colorHex,
                                      opacity: opacity === 'Translúcido' ? 0.7 : 1,
                                      border: selectedCup.colorHex === '#FFFFFF' ? '1px solid #CCC' : 'none'
                                    }}
                                  />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{opacity}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                      </div>
                  </div>
                  <div className="space-y-2">
                      <Label className="font-semibold">Borda</Label>
                      <RadioGroup value={selectedCup.rimColor} onValueChange={(v) => handleCupOptionChange(undefined, undefined, v as any)} className="flex gap-4">
                        {cupOptions.uniqueRimColors.map(r => <div key={r} className="flex items-center space-x-2"><RadioGroupItem value={r} id={`rim-${r}`}/><Label htmlFor={`rim-${r}`} className="font-normal">{r}</Label></div>)}
                      </RadioGroup>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Section 2: Create Art */}
              <div>
                <h3 className="font-semibold text-lg mb-4">2. Crie sua Arte</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                      <Button variant={artMethod === 'ai' ? 'secondary' : 'outline'} onClick={() => setArtMethod('ai')} className="flex-col h-16"><Wand2/><span className="text-xs mt-1">IA</span></Button>
                      <Button variant={artMethod === 'upload' ? 'secondary' : 'outline'} onClick={() => setArtMethod('upload')} className="flex-col h-16"><UploadCloud/><span className="text-xs mt-1">Enviar</span></Button>
                      <Button variant={artMethod === 'draw' ? 'secondary' : 'outline'} onClick={() => setArtMethod('draw')} className="flex-col h-16"><Palette/><span className="text-xs mt-1">Desenhar</span></Button>
                      <Button variant={artMethod === 'background' ? 'secondary' : 'outline'} onClick={() => setArtMethod('background')} className="flex-col h-16"><PaintBucket/><span className="text-xs mt-1">Fundo</span></Button>
                      <Button variant={artMethod === 'plain' ? 'secondary' : 'outline'} onClick={() => {setArtMethod('plain'); handlePlainArt();}} className="flex-col h-16 col-span-2"><Box/><span className="text-xs mt-1">Copo Liso (Sem Arte)</span></Button>
                  </div>

                  {artMethod === 'ai' && <div className="space-y-2 pt-2"><Textarea name="eventDescription" placeholder="Ex: Festa de 15 anos da Maria, tema galáxia..." rows={4} value={eventDescription} onChange={e => setEventDescription(e.target.value)} /><Button onClick={handleGenerateAIArt} className="w-full">Gerar Arte</Button></div>}
                  {artMethod === 'upload' && <div className="pt-2"><Input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" className="hidden"/><Button onClick={() => fileInputRef.current?.click()} className="w-full">Escolher Arquivo</Button></div>}
                  {artMethod === 'draw' && <div className="pt-2"><DrawingCanvas onDrawingReady={handleDrawingReady}/></div>}
                  {artMethod === 'background' && <div className="pt-2 flex gap-2"><Input type="color" value={backgroundColor} onChange={e => setBackgroundColor(e.target.value)} className="p-1 h-10"/><Button onClick={handleBackgroundReady} className="w-full">Aplicar Cor</Button></div>}
                </div>
              </div>

              {/* Section 3: Edit Art */}
              {currentArt && (
                 <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold text-lg mb-4">3. Adicione e Edite</h3>
                    <div className="space-y-4">
                      <Button onClick={handleAddText} variant="outline" className="w-full"><Type className="mr-2"/>Adicionar Texto</Button>
                      
                      {selectedText && (
                        <div className="space-y-4 pt-4 border-t">
                          <div className="flex justify-between items-center">
                            <Label htmlFor="text-content" className="font-semibold">Texto Selecionado</Label>
                            <Button variant="ghost" size="icon" onClick={handleDeleteText}><Trash2 className="text-destructive"/></Button>
                          </div>
                          <Textarea id="text-content" value={selectedText.text} onChange={(e) => updateText(selectedText.id, { text: e.target.value })} />
                          <div className="flex items-center gap-4">
                            <Label>Cor:</Label>
                            <Input type="color" value={selectedText.color} onChange={(e) => updateText(selectedText.id, { color: e.target.value })} className="p-1 h-10 w-16" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="font-size">Tamanho da Fonte: {selectedText.size}px</Label>
                            <Slider id="font-size" value={[selectedText.size]} onValueChange={(v) => updateText(selectedText.id, { size: v[0] })} min={10} max={100} step={1} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="scale">Escala: {selectedText.scale.toFixed(2)}x</Label>
                            <Slider id="scale" value={[selectedText.scale]} onValueChange={(v) => updateText(selectedText.id, { scale: v[0] })} min={0.5} max={3} step={0.1} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="rotation">Rotação: {selectedText.rotation}°</Label>
                            <Slider id="rotation" value={[selectedText.rotation]} onValueChange={(v) => updateText(selectedText.id, { rotation: v[0] })} min={-180} max={180} step={1} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                 </>
              )}
            </CardContent>
            <CardFooter className="p-4 border-t">
              <Button onClick={handleProceedToQuote} size="lg" className="w-full" disabled={!currentArt}>Avançar para Orçamento</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

    
