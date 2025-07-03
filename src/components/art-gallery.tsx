'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { QuoteSummary } from './quote-summary';
import { CheckoutView } from './checkout-view';
import { Loader } from './loader';
import { Separator } from './ui/separator';
import { ArrowLeft, Brush, Check, Slash, Sparkles } from 'lucide-react';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { handleArtAnalysis, handleFinalizeOrder, handleArtGeneration } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import type { CupModel, GeneratedArt, OrderDetails } from '@/lib/types';
import { vectorizeImage } from '@/ai/flows/vectorize-image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CUP_CATALOG, ALL_OPACITIES, ALL_RIMS, DEGRADE_COLORS, RIM_COLORS } from '@/lib/cup-data';
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
    const [isVectorizing, startVectorizingTransition] = useTransition();

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
            const result = await handleArtGeneration(activeCupModel.name, artPrompt);
            if (result.success && result.imageUrl) {
                const artData: GeneratedArt = {
                    id: `art-${Date.now()}`,
                    imageUrl: result.imageUrl,
                    prompt: artPrompt,
                    x: 50,
                    y: 50,
                    rotation: 0,
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

    const handleVectorizeArt = () => {
        if (!art) {
            toast({ variant: 'destructive', title: 'Atenção', description: 'Gere uma arte primeiro.' });
            return;
        }
        startVectorizingTransition(async () => {
            const result = await vectorizeImage({ imageDataUri: art.imageUrl });
            if (result.vectorizedImageDataUri) {
                updateArtProperty({ imageUrl: result.vectorizedImageDataUri });
                toast({ title: 'Sucesso', description: 'Sua arte foi vetorizada.' });
            } else {
                toast({ variant: 'destructive', title: 'Erro ao Vetorizar', description: 'Não foi possível vetorizar a arte.' });
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
        const getRimHexColor = (rimColor: CupModel['rimColor']) => {
            switch (rimColor) {
                case 'Dourado': return '#FFD700';
                case 'Prata': return '#C0C0C0';
                case 'Rosa Gold': return '#E6C4C0';
                default: return 'transparent';
            }
        };

        const getDegradeHexColor = (colorName: string | undefined) => {
            if (!colorName || colorName === 'Nenhum') return null;
            const colors: { [key: string]: string } = {
                'Rosa Pink': '#FF1493', 'Azul': '#4287f5', 'Verde': '#32a852',
                'Laranja': '#FFA500', 'Vermelho': '#FF0000', 'Preto': '#000000',
                'Prata': '#C0C0C0', 'Amarelo': '#FFFF00', 'Roxo': '#800080',
                'Rose Gold': '#B76E79', 'Dourado': '#FFD700', 'Rosa Chiclete': '#FF69B4',
                'Cobre': '#B87333',
            };
            return colors[colorName] || null;
        }

        const cupStyle: React.CSSProperties = {
            WebkitMaskImage: `url(${activeCupModel.imageUrl})`,
            maskImage: `url(${activeCupModel.imageUrl})`,
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
        };
    
        const degradeColorHex = getDegradeHexColor(activeCupModel.degradeColor);
    
        if (degradeColorHex && activeCupModel.degradePosition && activeCupModel.degradePosition !== 'Nenhum') {
            const direction = activeCupModel.degradePosition === 'Cima' ? 'to bottom' : 'to top';
            const baseColor = 'rgba(255, 255, 255, 0.7)';
            
            let gradient;
            if (direction === 'to bottom') {
                gradient = `linear-gradient(to bottom, ${degradeColorHex}, ${baseColor})`;
            } else {
                gradient = `linear-gradient(to top, ${degradeColorHex}, ${baseColor})`;
            }
            cupStyle.background = gradient;
        } else {
            cupStyle.backgroundColor = activeCupModel.colorHex;
            cupStyle.opacity = activeCupModel.opacityType === 'Transparente' ? 0.75 : 1.0;
        }

        return (
            <Card className="lg:sticky lg:top-24">
                <CardHeader>
                    <CardTitle>Pré-visualização</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center p-4 min-h-[400px] md:min-h-[500px] bg-muted/50 rounded-lg checkerboard">
                    <div className="relative w-56 h-56 sm:w-64 sm:h-64">
                        {/* Cup Render */}
                        <div
                            className="absolute inset-0"
                            style={cupStyle}
                        />
                        {activeCupModel.rimColor !== 'Nenhuma' && (
                            <div
                                className="absolute inset-0"
                                style={{
                                    borderColor: getRimHexColor(activeCupModel.rimColor),
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
                                className="absolute"
                                style={{
                                    top: `${art.y}%`,
                                    left: `${art.x}%`,
                                    width: `calc(${activeCupModel.printableArea?.widthPercent || 80}%)`,
                                    height: `calc(${activeCupModel.printableArea?.heightPercent || 40}%)`,
                                    transform: `translate(-50%, -50%) rotate(${art.rotation}deg)`,
                                }}
                            >
                                <div className="relative w-full h-full">
                                    <Image src={art.imageUrl} alt="Arte gerada" fill className="object-contain" />
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleGoToQuote} size="lg" className="w-full" disabled={!art || isGenerating || isVectorizing}>
                        Aprovar Arte e ir para Orçamento <ArrowLeft className="ml-2 -rotate-180" />
                    </Button>
                </CardFooter>
            </Card>
        );
    }


    return (
        <div>
            <div className="flex items-center gap-4 mb-8">
                <h2 className="text-xl font-bold">Personalizando: <span className="text-primary">{selectedCupName}</span></h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                <div className="lg:col-span-1 lg:order-last">
                     <PreviewCard />
                </div>

                <div className="lg:col-span-2 order-first lg:order-first space-y-6">
                      <div className="space-y-6">
                        {/* Cup Customization */}
                        <Card>
                            <CardHeader><CardTitle>1. Personalize o Copo</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="font-bold">Acabamento</Label>
                                    <div className="flex gap-2 mt-2">
                                        {opacities.map(opacity => (
                                            <Button key={opacity} variant={selectedOpacity === opacity ? 'secondary' : 'outline'} onClick={() => setSelectedOpacity(opacity)}>
                                                {opacity === 'Transparente' ? <Sparkles className="mr-2" /> : <div className="w-4 h-4 mr-2 rounded-full bg-foreground" />}
                                                {opacity}
                                            </Button>
                                        ))}
                                    </div>
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
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                        <div>
                                            <Label htmlFor="degrade-color" className="text-sm">Cor</Label>
                                            <Select value={selectedDegradeColor} onValueChange={handleDegradeColorChange}>
                                                <SelectTrigger id="degrade-color">
                                                    <SelectValue placeholder="Selecione uma cor" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {DEGRADE_COLORS.map(color => (
                                                        <SelectItem key={color} value={color}>{color}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {selectedDegradeColor !== 'Nenhum' && (
                                            <div>
                                                <Label className="text-sm">Posição</Label>
                                                <RadioGroup
                                                    value={selectedDegradePosition}
                                                    onValueChange={(value) => setSelectedDegradePosition(value as any)}
                                                    className="flex gap-4 mt-3"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="Cima" id="pos-cima" />
                                                        <Label htmlFor="pos-cima" className="font-normal">De Cima</Label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="Baixo" id="pos-baixo" />
                                                        <Label htmlFor="pos-baixo" className="font-normal">De Baixo</Label>
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
                                <Button onClick={handleGenerateArt} disabled={isGenerating || isVectorizing} className="w-full">
                                    {isGenerating ? <Loader message="Gerando..." /> : <Sparkles />}
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
                                    <Label htmlFor="rotation-slider">Rotação (graus)</Label>
                                    <Input id="rotation-slider" type="number" value={art.rotation} onChange={e => updateArtProperty({ rotation: parseInt(e.target.value, 10) || 0 })} min={-180} max={180} step={1} />
                                </div>
                                <Button onClick={handleVectorizeArt} disabled={isVectorizing || isGenerating} variant="outline" className="w-full">
                                    {isVectorizing ? <Loader message="Vetorizando..." /> : <Brush />}
                                    Vetorizar Arte
                                </Button>
                            </CardContent>
                        </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
