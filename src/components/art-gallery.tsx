'use client';

import { useState, useTransition, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { QuoteSummary } from './quote-summary';
import { CheckoutView } from './checkout-view';
import { Loader } from './loader';
import { Separator } from './ui/separator';
import { ArrowLeft, Edit, Palette, Sparkles, CheckCircle, RefreshCw, Wand2, Paintbrush, Upload, Trash2, Move, Scale, RotateCw } from 'lucide-react';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Input } from './ui/input';
import { handleArtAnalysis, handleFinalizeOrder, handleArtGeneration } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import type { CupModel, GeneratedArt, OrderDetails } from '@/lib/types';

// Mock data - replace with your actual data fetching
const LONG_DRINK_SVG = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2MCAxMjAiPjxwYXRoIGQ9Ik01LDAgSDU1IEw1MCwxMjAgSDEwIFoiIGZpbGw9ImJsYWNrIi8+PC9zdmc+';
const TWISTER_SVG = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA3MCAxNDAiPjxwYXRoIGQ9Ik0wIDEwaDcwdjE1SDB6TTEwIDMwaDUwbC01IDEwMEgxNXpNMzIgMGg2djEwaC02eiIgZmlsbD0iYmxhY2siLz48L3N2Zz4=';
const CALDERETA_SVG = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4MCAxMDAiPjxwYXRoIGQ9Ik01LDAgSDc1IEw2NSwxMDAgSDE1IFoiIGZpbGw9ImJsYWNrIi8+PC9zdmc+';

const CUP_CATALOG: CupModel[] = [
    // Long Drink
    ...['Branco', 'Preto', 'Azul', 'Vermelho', 'Verde', 'Amarelo', 'Rosa', 'Roxo', 'Laranja'].flatMap(color =>
        ['Opaco', 'Translúcido'].flatMap(opacity =>
            ['Nenhuma', 'Dourada', 'Prateada'].map(rim => ({
                id: `long-drink-${color}-${opacity}-${rim}`.toLowerCase().replace(/\s/g, '-'),
                name: 'Copo Long Drink',
                imageUrl: LONG_DRINK_SVG,
                basePrice: 3.50 + (rim !== 'Nenhuma' ? 0.75 : 0),
                colorName: color,
                colorHex: {
                    'Branco': '#FFFFFF', 'Preto': '#222222', 'Azul': '#0074D9', 'Vermelho': '#FF4136', 'Verde': '#2ECC40',
                    'Amarelo': '#FFDC00', 'Rosa': '#F012BE', 'Roxo': '#B10DC9', 'Laranja': '#FF851B'
                }[color],
                opacityType: opacity as 'Opaco' | 'Translúcido',
                rimColor: rim as 'Nenhuma' | 'Dourada' | 'Prateada',
                printableArea: { widthPercent: 80, heightPercent: 40, width_mm: 50, height_mm: 80 },
            }))
        )
    ),
    // Twister
    ...['Branco', 'Preto', 'Azul', 'Vermelho', 'Verde'].flatMap(color =>
        ['Opaco', 'Translúcido'].flatMap(opacity =>
            ['Nenhuma', 'Dourada', 'Prateada'].map(rim => ({
                id: `twister-${color}-${opacity}-${rim}`.toLowerCase().replace(/\s/g, '-'),
                name: 'Copo Twister com Tampa',
                imageUrl: TWISTER_SVG,
                basePrice: 4.80 + (rim !== 'Nenhuma' ? 0.90 : 0),
                colorName: color,
                colorHex: { 'Branco': '#FFFFFF', 'Preto': '#222222', 'Azul': '#0074D9', 'Vermelho': '#FF4136', 'Verde': '#2ECC40' }[color],
                opacityType: opacity as 'Opaco' | 'Translúcido',
                rimColor: rim as 'Nenhuma' | 'Dourada' | 'Prateada',
                printableArea: { widthPercent: 85, heightPercent: 35, width_mm: 55, height_mm: 90 },
            }))
        )
    ),
    // Caldereta
    ...['Branco', 'Preto', 'Transparente'].flatMap(color =>
        ['Opaco', 'Translúcido'].flatMap(opacity =>
            ['Nenhuma', 'Dourada', 'Prateada'].map(rim => ({
                id: `caldereta-${color}-${opacity}-${rim}`.toLowerCase().replace(/\s/g, '-'),
                name: 'Copo Caldereta',
                imageUrl: CALDERETA_SVG,
                basePrice: 3.20 + (rim !== 'Nenhuma' ? 0.70 : 0),
                colorName: color,
                colorHex: { 'Branco': '#FFFFFF', 'Preto': '#222222', 'Transparente': '#FFFFFF' }[color],
                opacityType: (color === 'Transparente' ? 'Translúcido' : opacity) as 'Opaco' | 'Translúcido',
                rimColor: rim as 'Nenhuma' | 'Dourada' | 'Prateada',
                printableArea: { widthPercent: 75, heightPercent: 50, width_mm: 60, height_mm: 70 },
            }))
        )
    ),
];

const getAvailableCupOptions = (cupName: string) => {
    const allOptions = CUP_CATALOG.filter(c => c.name === cupName);
    const colors = [...new Set(allOptions.map(c => c.colorName!))];
    const opacities = [...new Set(allOptions.map(c => c.opacityType!))];
    const rims = [...new Set(allOptions.map(c => c.rimColor!))];
    return { colors, opacities, rims };
};

interface ArtGalleryProps {
    selectedCupName: string;
    onBackToSelector: () => void;
}

export function ArtGallery({ selectedCupName, onBackToSelector }: ArtGalleryProps) {
    const { toast } = useToast();
    const [isGenerating, startGenerationTransition] = useTransition();

    const [view, setView] = useState<'editor' | 'quote' | 'checkout'>('editor');

    // Cup Customization State
    const { colors, opacities, rims } = getAvailableCupOptions(selectedCupName);
    const [selectedColor, setSelectedColor] = useState(colors[0]);
    const [selectedOpacity, setSelectedOpacity] = useState(opacities[0]);
    const [selectedRim, setSelectedRim] = useState(rims[0]);

    // Art State
    const [art, setArt] = useState<GeneratedArt | null>(null);
    const [artPrompt, setArtPrompt] = useState('');
    const [analysis, setAnalysis] = useState<{ score: number; reasoning: string } | null>(null);
    
    // Final Order State
    const [finalOrder, setFinalOrder] = useState<OrderDetails | null>(null);

    const activeCupModel = CUP_CATALOG.find(c =>
        c.name === selectedCupName &&
        c.colorName === selectedColor &&
        c.opacityType === selectedOpacity &&
        c.rimColor === selectedRim
    ) || CUP_CATALOG.find(c => c.name === selectedCupName)!;

    const handleGenerateArt = () => {
        if (!artPrompt) {
            toast({ variant: 'destructive', title: 'Atenção', description: 'Por favor, descreva a arte que você deseja.' });
            return;
        }
        startGenerationTransition(async () => {
            const result = await handleArtGeneration(activeCupModel.name, artPrompt);
            if (result.success && result.imageUrl) {
                const artData: GeneratedArt = {
                    id: `art-${Date.now()}`,
                    imageUrl: result.imageUrl,
                    prompt: artPrompt,
                    x: 50,
                    y: 50,
                    scale: 1,
                    rotation: 0,
                };
                setArt(artData);
                const analysisResult = await handleArtAnalysis(result.imageUrl, artPrompt);
                if (analysisResult.success && analysisResult.analysis) {
                    setAnalysis(analysisResult.analysis);
                }
            } else {
                toast({ variant: 'destructive', title: 'Erro na Geração', description: result.error });
            }
        });
    };
    
    const updateArtProperty = (props: Partial<GeneratedArt>) => {
        if (art) {
            setArt(prev => prev ? { ...prev, ...props } : null);
        }
    }

    const handleGoToQuote = () => {
        if (!art || !analysis) {
            toast({ variant: 'destructive', title: 'Atenção', description: 'Você precisa gerar uma arte antes de prosseguir.' });
            return;
        }
        setView('quote');
    }

    const handleFinalize = (details: OrderDetails) => {
        startGenerationTransition(async () => {
            const result = await handleFinalizeOrder(details);
            if (result.success) {
                setFinalOrder(details);
                setView('checkout');
            } else {
                toast({ variant: 'destructive', title: 'Erro no Pedido', description: 'Não foi possível finalizar seu pedido.' });
            }
        });
    };

    const resetFlow = () => {
        setArt(null);
        setAnalysis(null);
        setFinalOrder(null);
        setView('editor');
    };

    if (view === 'checkout' && finalOrder) {
        return <CheckoutView orderDetails={finalOrder} onStartNewOrder={resetFlow} />;
    }

    if (view === 'quote' && art && analysis) {
        return (
            <QuoteSummary
                initialDetails={{
                    cupModel: activeCupModel,
                    eventDescription: art.prompt,
                    art,
                    artComplexity: { score: analysis.score, reasoning: analysis.reasoning },
                }}
                onFinalize={handleFinalize}
                onBack={() => setView('editor')}
            />
        );
    }
    
    const PreviewCard = () => (
         <Card>
            <CardHeader>
                <CardTitle>Pré-visualização</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-4 min-h-[500px] bg-muted/50 rounded-lg">
                 <div className="relative w-64 h-64">
                     {/* Cup Render */}
                     <div
                        className="absolute inset-0"
                        style={{
                          backgroundColor: activeCupModel.colorHex,
                          opacity: activeCupModel.opacityType === 'Translúcido' ? 0.75 : 1.0,
                          WebkitMaskImage: `url(${activeCupModel.imageUrl})`,
                          maskImage: `url(${activeCupModel.imageUrl})`,
                          WebkitMaskSize: 'contain',
                          maskSize: 'contain',
                          WebkitMaskRepeat: 'no-repeat',
                          maskRepeat: 'no-repeat',
                          WebkitMaskPosition: 'center',
                          maskPosition: 'center',
                        }}
                      />
                      {activeCupModel.rimColor !== 'Nenhuma' && (
                          <div
                            className="absolute inset-0"
                            style={{
                              borderColor: activeCupModel.rimColor === 'Dourada' ? '#FFD700' : '#C0C0C0',
                              borderTopWidth: '8px',
                              WebkitMaskImage: `url(${activeCupModel.imageUrl})`,
                              maskImage: `url(${activeCupModel.imageUrl})`,
                              WebkitMaskSize: 'contain',
                              maskSize: 'contain',
                              WebkitMaskRepeat: 'no-repeat',
                              maskRepeat: 'no-repeat',
                              WebkitMaskPosition: 'center',
                              maskPosition: 'center',
                            }}
                          />
                      )}
                      {/* Art Render */}
                      {art && (
                        <div
                          className="absolute w-full h-full"
                          style={{
                            top: `${art.y}%`,
                            left: `${art.x}%`,
                            transform: `translate(-50%, -50%) scale(${art.scale}) rotate(${art.rotation}deg)`,
                            width: '100%',
                            height: '100%',
                          }}
                        >
                            <div className="relative w-full h-full flex items-center justify-center">
                                <Image src={art.imageUrl} alt="Arte gerada" fill className="object-contain" />
                            </div>
                        </div>
                      )}
                 </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleGoToQuote} size="lg" className="w-full" disabled={!art}>
                     Aprovar Arte e ir para Orçamento <ArrowLeft className="ml-2 -rotate-180" />
                </Button>
            </CardFooter>
         </Card>
    );

    return (
        <div>
            <div className="flex items-center gap-4 mb-8">
                <Button variant="outline" size="sm" onClick={onBackToSelector}><ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Seleção</Button>
                <Separator orientation="vertical" className="h-6" />
                <h2 className="text-xl font-bold">Personalizando: <span className="text-primary">{selectedCupName}</span></h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* Preview Panel - Placed first for mobile order, sticky for desktop */}
                <div className="lg:col-span-2 lg:sticky top-24">
                     <PreviewCard />
                </div>

                {/* Controls Panel */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Cup Customization */}
                    <Card>
                        <CardHeader><CardTitle>1. Personalize o Copo</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="font-bold">Cor</Label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {colors.map(color => (
                                        <button key={color} onClick={() => setSelectedColor(color)} className="p-1 border-2 rounded-full transition-all" style={{ borderColor: selectedColor === color ? 'hsl(var(--primary))' : 'transparent' }}>
                                            <div className="w-8 h-8 rounded-full border" style={{ backgroundColor: (CUP_CATALOG.find(c=>c.colorName === color)?.colorHex) }}></div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <Label className="font-bold">Acabamento</Label>
                                <div className="flex gap-2 mt-2">
                                     {opacities.map(opacity => (
                                        <Button key={opacity} variant={selectedOpacity === opacity ? 'secondary' : 'outline'} onClick={() => setSelectedOpacity(opacity)}>
                                            {opacity === 'Translúcido' ? <Sparkles className="mr-2" /> : <div className="w-4 h-4 mr-2 rounded-full bg-foreground" />}
                                            {opacity}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <Label className="font-bold">Borda</Label>
                                 <div className="flex gap-2 mt-2">
                                     {rims.map(rim => (
                                        <Button key={rim} variant={selectedRim === rim ? 'secondary' : 'outline'} onClick={() => setSelectedRim(rim)}>
                                            {rim === 'Dourada' && <div className="w-4 h-4 mr-2 rounded-full bg-yellow-500" />}
                                            {rim === 'Prateada' && <div className="w-4 h-4 mr-2 rounded-full bg-slate-400" />}
                                            {rim}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Art Generation */}
                    <Card>
                         <CardHeader><CardTitle>2. Crie sua Arte Vetorial</CardTitle></CardHeader>
                         <CardContent className="space-y-4">
                            <Textarea
                                placeholder="Ex: um leão minimalista com uma coroa, tema de safari"
                                rows={4}
                                value={artPrompt}
                                onChange={(e) => setArtPrompt(e.target.value)}
                            />
                            <Button onClick={handleGenerateArt} disabled={isGenerating} className="w-full">
                                {isGenerating ? <Loader className="h-4 w-4" /> : <Wand2 />}
                                Gerar Arte com IA
                            </Button>
                         </CardContent>
                    </Card>

                    {/* Toolbar */}
                    {art && (
                       <Card>
                         <CardHeader><CardTitle>3. Edite a Arte</CardTitle></CardHeader>
                         <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="x-pos">Posição (X, Y)</Label>
                                <div className="flex gap-2">
                                    <Input id="x-pos" type="number" value={art.x} onChange={e => updateArtProperty({ x: parseInt(e.target.value, 10) })} />
                                    <Input id="y-pos" type="number" value={art.y} onChange={e => updateArtProperty({ y: parseInt(e.target.value, 10) })} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="scale-slider">Escala</Label>
                                <Slider id="scale-slider" value={[art.scale]} onValueChange={([val]) => updateArtProperty({ scale: val })} min={0.2} max={2} step={0.05} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="rotation-slider">Rotação</Label>
                                <Slider id="rotation-slider" value={[art.rotation]} onValueChange={([val]) => updateArtProperty({ rotation: val })} min={-180} max={180} step={1} />
                            </div>
                         </CardContent>
                       </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
