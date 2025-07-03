'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QuoteSummary } from './quote-summary';
import { CheckoutView } from './checkout-view';
import { Loader } from './loader';
import { Separator } from './ui/separator';
import { ArrowLeft, Check, Slash, Sparkles } from 'lucide-react';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { handleArtAnalysis, handleFinalizeOrder, handleArtGeneration } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import type { CupModel, GeneratedArt, OrderDetails } from '@/lib/types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CUP_CATALOG, ALL_RIMS, DEGRADE_COLORS, RIM_COLORS, DEGRADE_HEX_COLORS } from '@/lib/cup-data';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { cn } from '@/lib/utils';


const getAvailableCupOptions = (cupName: string) => {
    const allOptions = CUP_CATALOG.filter(c => c.name === cupName);
    const opacities = [...new Set(allOptions.map(c => c.opacityType!))];
    const rims = [...new Set(allOptions.map(c => c.rimColor!))];
    return { opacities, rims };
};

interface ArtGalleryProps {
    selectedCupName: string;
}

export function ArtGallery({ selectedCupName }: ArtGalleryProps) {
    const { toast } = useToast();
    const [isGenerating, startGenerationTransition] = useTransition();

    const [view, setView] = useState<'editor' | 'quote' | 'checkout'>('editor');

    // Cup Customization State
    const { opacities, rims } = getAvailableCupOptions(selectedCupName);
    const [selectedOpacity, setSelectedOpacity] = useState(opacities[0]);
    const [selectedRim, setSelectedRim] = useState(rims[0]);
    const [selectedDegradeColor, setSelectedDegradeColor] = useState('Nenhum');
    const [selectedDegradePosition, setSelectedDegradePosition] = useState<'Nenhum' | 'Cima' | 'Baixo'>('Nenhum');


    // Art State
    const [art, setArt] = useState<GeneratedArt | null>(null);
    const [artPrompt, setArtPrompt] = useState('');
    const [analysis, setAnalysis] = useState<{ score: number; reasoning: string } | null>(null);
    
    // Final Order State
    const [finalOrder, setFinalOrder] = useState<OrderDetails | null>(null);

    const baseCupModel = CUP_CATALOG.find(c =>
        c.name === selectedCupName &&
        c.opacityType === selectedOpacity &&
        c.rimColor === selectedRim
    ) || CUP_CATALOG.find(c => c.name === selectedCupName)!;

    const activeCupModel: CupModel = {
        ...baseCupModel,
        degradeColor: selectedDegradeColor,
        degradePosition: selectedDegradePosition,
    };

    const handleGenerateArt = () => {
        if (!artPrompt) {
            toast({ variant: 'destructive', title: 'Atenção', description: 'Por favor, descreva a arte que você deseja.' });
            return;
        }
        startGenerationTransition(async () => {
            const result = await handleArtGeneration(artPrompt);
            if (result.success && result.imageUrl) {
                const artData: GeneratedArt = {
                    id: `art-${Date.now()}`,
                    imageUrl: result.imageUrl,
                    prompt: artPrompt,
                    x: 50,
                    y: 50,
                    rotation: 0,
                    scale: 1,
                };
                setArt(artData);
                const analysisResult = await handleArtAnalysis(result.imageUrl, artPrompt);
                if (analysisResult.success && analysisResult.analysis) {
                    setAnalysis(analysisResult.analysis);
                } else {
                     toast({ variant: 'destructive', title: 'Erro na Análise', description: analysisResult.error });
                }
            } else {
                toast({ variant: 'destructive', title: 'Erro na Geração', description: result.error });
            }
        });
    };
    
    const handleGoToQuote = () => {
        if (!art || !analysis) {
            toast({ variant: 'destructive', title: 'Atenção', description: 'Você precisa gerar e analisar uma arte antes de prosseguir.' });
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

    const handleDegradeColorChange = (color: string) => {
        setSelectedDegradeColor(color);
        if (color !== 'Nenhum' && selectedDegradePosition === 'Nenhum') {
            setSelectedDegradePosition('Cima'); // Default to top
        }
        if (color === 'Nenhum') {
            setSelectedDegradePosition('Nenhum');
        }
    }

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
    
    const PreviewCard = () => {
        const getRimHexColor = (rimColor: CupModel['rimColor']) => RIM_COLORS[rimColor] || 'transparent';

        const degradeColorHex = activeCupModel.degradeColor ? DEGRADE_HEX_COLORS[activeCupModel.degradeColor] : null;

        const overlayStyle: React.CSSProperties = {
            WebkitMaskImage: `url(${activeCupModel.svgMaskUrl})`,
            maskImage: `url(${activeCupModel.svgMaskUrl})`,
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
        };

        if (degradeColorHex && activeCupModel.degradePosition && activeCupModel.degradePosition !== 'Nenhum') {
            const direction = activeCupModel.degradePosition === 'Cima' ? 'to bottom' : 'to top';
            const baseColor = activeCupModel.opacityType === 'Transparente' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)';
            overlayStyle.background = `linear-gradient(${direction}, ${degradeColorHex}, ${baseColor})`;
        } else {
            overlayStyle.backgroundColor = activeCupModel.colorHex;
            overlayStyle.opacity = activeCupModel.opacityType === 'Transparente' ? 0.6 : 1.0;
        }

        return (
            <Card>
                <CardHeader>
                    <CardTitle>Pré-visualização</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center p-4 min-h-[400px] md:min-h-[500px] bg-muted/50 rounded-lg overflow-hidden">
                    <div className="relative w-56 h-96 sm:w-64 sm:h-[426px] animate-cup-rotate" style={{ transformStyle: 'preserve-3d' }}>
                        
                        <Image src={activeCupModel.imageUrl} alt={activeCupModel.name} fill className="object-contain" data-ai-hint="white cup" />

                        {/* Color/Gradient Overlay */}
                        <div
                            className="absolute inset-0 mix-blend-multiply"
                            style={overlayStyle}
                        />
                        
                        {/* Rim Render */}
                        {activeCupModel.rimColor !== 'Nenhuma' && (
                            <div
                                className="absolute inset-0"
                                style={{
                                    borderColor: getRimHexColor(activeCupModel.rimColor),
                                    borderTopWidth: '8px',
                                    WebkitMaskImage: `url(${activeCupModel.svgMaskUrl})`,
                                    maskImage: `url(${activeCupModel.svgMaskUrl})`,
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
                                className="absolute transition-all"
                                style={{
                                    top: `${art.y}%`,
                                    left: `${art.x}%`,
                                    width: `calc(${activeCupModel.printableArea?.widthPercent || 80}%)`,
                                    height: `calc(${activeCupModel.printableArea?.heightPercent || 40}%)`,
                                    transform: `translate(-50%, -50%) rotate(${art.rotation}deg) scale(${art.scale || 1})`,
                                }}
                            >
                                <div className="relative w-full h-full">
                                    <Image src={art.imageUrl} alt="Arte gerada" fill className="object-contain" />
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    }


    return (
        <div>
            <div className="flex items-center gap-4 mb-8">
                <h2 className="text-xl font-bold">Personalizando: <span className="text-primary">{selectedCupName}</span></h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                <div className="lg:col-span-1 lg:order-last lg:sticky lg:top-24">
                     <PreviewCard />
                </div>

                <div className="lg:col-span-2 space-y-6">
                      <div className="space-y-6">
                        {/* Cup Customization */}
                        <Card>
                            <CardHeader><CardTitle>1. Personalize o Copo</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="font-bold">Cor</Label>
                                    <TooltipProvider>
                                        <div className="flex flex-wrap gap-3 mt-2">
                                            {opacities.map(opacity => (
                                                <Tooltip key={opacity}>
                                                    <TooltipTrigger asChild>
                                                        <button
                                                            onClick={() => setSelectedOpacity(opacity)}
                                                            className={cn(
                                                                "relative w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all overflow-hidden",
                                                                selectedOpacity === opacity ? 'border-primary ring-2 ring-primary ring-offset-2 ring-offset-background' : 'border-muted hover:border-foreground/50'
                                                            )}
                                                        >
                                                            {opacity === 'Fosco' && (
                                                                <div className="w-full h-full bg-foreground/20"></div>
                                                            )}
                                                            {opacity === 'Transparente' && (
                                                                <div className="w-full h-full checkerboard"></div>
                                                            )}
                                                            {selectedOpacity === opacity && <Check className="absolute h-5 w-5 text-primary-foreground mix-blend-difference" />}
                                                        </button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{opacity}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            ))}
                                        </div>
                                    </TooltipProvider>
                                </div>
                                <div>
                                    <Label className="font-bold">Borda</Label>
                                    <TooltipProvider>
                                        <div className="flex flex-wrap gap-3 mt-2">
                                            {rims.map(rim => (
                                                <Tooltip key={rim}>
                                                    <TooltipTrigger asChild>
                                                        <button
                                                            onClick={() => setSelectedRim(rim)}
                                                            className={cn(
                                                                "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all",
                                                                selectedRim === rim ? 'border-primary ring-2 ring-primary ring-offset-2 ring-offset-background' : 'border-muted hover:border-foreground/50'
                                                            )}
                                                            style={{ backgroundColor: rim === 'Nenhuma' ? 'hsl(var(--muted))' : RIM_COLORS[rim] }}
                                                        >
                                                            {selectedRim === rim && <Check className="h-5 w-5 text-white mix-blend-difference" />}
                                                            {rim === 'Nenhuma' && selectedRim !== 'Nenhuma' && <Slash className="h-5 w-5 text-muted-foreground" />}
                                                        </button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{rim}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            ))}
                                        </div>
                                    </TooltipProvider>
                                </div>
                                <Separator />
                                <div>
                                    <Label className="font-bold">Degradê</Label>
                                    <div className="grid grid-cols-1 gap-4 mt-2">
                                        <TooltipProvider>
                                          <div className="flex flex-wrap gap-3">
                                                {DEGRADE_COLORS.map(color => (
                                                    <Tooltip key={color}>
                                                        <TooltipTrigger asChild>
                                                            <button
                                                                onClick={() => handleDegradeColorChange(color)}
                                                                className={cn(
                                                                    "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all",
                                                                    selectedDegradeColor === color ? 'border-primary ring-2 ring-primary ring-offset-2 ring-offset-background' : 'border-muted hover:border-foreground/50'
                                                                )}
                                                                style={{
                                                                    background: color === 'Nenhum' ? 'hsl(var(--muted))' : `linear-gradient(to bottom, ${DEGRADE_HEX_COLORS[color]}, hsl(var(--card)))`
                                                                }}
                                                            >
                                                                {selectedDegradeColor === color && <Check className="h-5 w-5 text-white mix-blend-difference" />}
                                                                {color === 'Nenhum' && selectedDegradeColor !== 'Nenhum' && <Slash className="h-5 w-5 text-muted-foreground" />}
                                                            </button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>{color}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                ))}
                                            </div>
                                        </TooltipProvider>
                                        
                                        {selectedDegradeColor !== 'Nenhum' && (
                                            <div className="mt-2">
                                                <Label className="text-sm">Posição do Degradê</Label>
                                                <RadioGroup
                                                    value={selectedDegradePosition}
                                                    onValueChange={(value) => setSelectedDegradePosition(value as any)}
                                                    className="flex gap-4 mt-3"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="Cima" id="pos-cima" />
                                                        <Label htmlFor="pos-cima" className="font-normal">De Cima para Baixo</Label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="Baixo" id="pos-baixo" />
                                                        <Label htmlFor="pos-baixo" className="font-normal">De Baixo para Cima</Label>
                                                    </div>
                                                </RadioGroup>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Art Generation */}
                        <Card>
                            <CardHeader><CardTitle>2. Crie sua Arte</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <Textarea
                                    placeholder="Ex: um leão com uma coroa, tema de safari, com a escrita 'Rei da festa'"
                                    rows={4}
                                    value={artPrompt}
                                    onChange={(e) => setArtPrompt(e.target.value)}
                                />
                                <Button onClick={handleGenerateArt} disabled={isGenerating} className="w-full">
                                    {isGenerating ? <Loader message="Gerando..." /> : <Sparkles />}
                                    Gerar Arte com IA
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
            <div className="mt-8 pt-8 border-t">
                 <Button onClick={handleGoToQuote} size="lg" className="w-full" disabled={!art || isGenerating}>
                    Aprovar Arte e ir para Orçamento <ArrowLeft className="ml-2 -rotate-180" />
                </Button>
            </div>
        </div>
    );
}
