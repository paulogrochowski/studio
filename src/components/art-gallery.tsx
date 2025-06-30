'use client';

import { useState, useTransition, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ArtMethodSelector } from './art-method-selector';
import { EventForm } from './event-form';
import { QuoteSummary } from './quote-summary';
import { CheckoutView } from './checkout-view';
import { Loader } from './loader';
import { Separator } from './ui/separator';
import { ArrowLeft, Edit, Palette, Sparkles, CheckCircle, RefreshCw, Wand2, Paintbrush, Upload, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from './ui/textarea';
import { handleArtAnalysis, handleArtRefinement, handleFinalizeOrder } from '@/app/actions';
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
    const [isPending, startTransition] = useTransition();

    // Overall State
    const [currentStep, setCurrentStep] = useState(1);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);
    
    // Step 1: Cup Customization
    const { colors, opacities, rims } = getAvailableCupOptions(selectedCupName);
    const [selectedColor, setSelectedColor] = useState(colors[0]);
    const [selectedOpacity, setSelectedOpacity] = useState(opacities[0]);
    const [selectedRim, setSelectedRim] = useState(rims[0]);

    // Step 2: Art Method
    const [artMethod, setArtMethod] = useState<'ai' | 'upload' | 'draw' | 'plain' | null>(null);

    // Step 3: Art Creation
    const [eventDescription, setEventDescription] = useState('');
    const [art, setArt] = useState<GeneratedArt | null>(null);
    const [analysis, setAnalysis] = useState<{ score: number; reasoning: string } | null>(null);

    // Step 4: Refinement
    const [refinementInstruction, setRefinementInstruction] = useState("");
    const [isRefining, startRefiningTransition] = useTransition();
    const [activeTab, setActiveTab] = useState("refine");

    // Final Order State
    const [finalOrder, setFinalOrder] = useState<OrderDetails | null>(null);
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const activeCupModel = CUP_CATALOG.find(c =>
        c.name === selectedCupName &&
        c.colorName === selectedColor &&
        c.opacityType === selectedOpacity &&
        c.rimColor === selectedRim
    ) || CUP_CATALOG.find(c => c.name === selectedCupName)!;

    const completeStep = (step: number) => {
        if (!completedSteps.includes(step)) {
            setCompletedSteps(prev => [...prev, step].sort());
        }
        setCurrentStep(step + 1);
    }
    
    const handleStepClick = (step: number) => {
        if (completedSteps.includes(step -1)) {
            setCurrentStep(step);
        }
    }

    const handleArtMethodSelect = (method: 'ai' | 'upload' | 'draw' | 'plain') => {
        setArtMethod(method);
        if (method === 'plain') {
            handleArtReady('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'Copo sem arte');
        } else {
            completeStep(1); // Move to art creation
        }
    };

    const handleArtReady = (imageUrl: string, prompt: string) => {
        const artData = { id: `art-${Date.now()}`, imageUrl, prompt };
        setArt(artData);
        startTransition(async () => {
            const result = await handleArtAnalysis(imageUrl, prompt);
            if (result.success && result.analysis) {
                setAnalysis(result.analysis);
                completeStep(2); // Move to review
            } else {
                toast({ variant: 'destructive', title: 'Erro na Análise', description: result.error });
            }
        });
    };
    
    const handleRefineArt = async () => {
        if (!art?.imageUrl || !refinementInstruction) return;
        
        startRefiningTransition(async () => {
            const result = await handleArtRefinement(art.imageUrl, refinementInstruction);
            if(result.success && result.imageUrl) {
                handleArtReady(result.imageUrl, `${eventDescription} (Refinado: ${refinementInstruction})`);
                toast({ title: "Arte Refinada!", description: "Sua arte foi atualizada com sucesso." });
                setRefinementInstruction("");
            } else {
                toast({ variant: 'destructive', title: 'Erro ao Refinar', description: result.error });
            }
        });
    }

    const handleFinalize = (details: OrderDetails) => {
        startTransition(async () => {
            const result = await handleFinalizeOrder(details);
            if (result.success) {
                setFinalOrder(details);
                setIsCheckingOut(true);
            } else {
                toast({ variant: 'destructive', title: 'Erro no Pedido', description: 'Não foi possível finalizar seu pedido.' });
            }
        });
    };

    const resetFlow = () => {
        setCurrentStep(1);
        setCompletedSteps([]);
        setArtMethod(null);
        setEventDescription('');
        setArt(null);
        setAnalysis(null);
        setFinalOrder(null);
        setIsCheckingOut(false);
    };

    const renderStepContent = () => {
        if (isCheckingOut && finalOrder) {
            return <CheckoutView orderDetails={finalOrder} onStartNewOrder={resetFlow} />;
        }

        const cupSelectionContent = (
            <AccordionItem value="step-1">
                <AccordionTrigger disabled={isPending}>Passo 1: Personalize o Copo</AccordionTrigger>
                <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        <div className="space-y-6">
                            {/* Color Selector */}
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
                            <Separator />
                            {/* Opacity Selector */}
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
                             <Separator />
                            {/* Rim Selector */}
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
                        </div>

                        {/* Cup Preview */}
                        <div className="sticky top-24">
                           <Card>
                                <CardHeader>
                                    <CardTitle>Pré-visualização</CardTitle>
                                </CardHeader>
                                <CardContent className="flex items-center justify-center p-4 min-h-[300px]">
                                    <div className="relative w-48 h-48">
                                         <div className="absolute inset-0 checkerboard rounded-md" />
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
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                      <Button onClick={() => completeStep(0)}>Próximo Passo <ArrowLeft className="ml-2 -rotate-180" /></Button>
                    </div>
                </AccordionContent>
            </AccordionItem>
        );
        
        const artMethodContent = (
            <AccordionItem value="step-2">
                <AccordionTrigger disabled={isPending || !completedSteps.includes(0)}>Passo 2: Como você quer criar a arte?</AccordionTrigger>
                <AccordionContent>
                    <ArtMethodSelector onSelect={handleArtMethodSelect} />
                </AccordionContent>
            </AccordionItem>
        );

        const artCreationContent = (
            <AccordionItem value="step-3">
                 <AccordionTrigger disabled={isPending || !completedSteps.includes(1)}>Passo 3: Criação da Arte</AccordionTrigger>
                 <AccordionContent>
                     {artMethod && <EventForm cup={activeCupModel} onArtReady={handleArtReady} artMethod={artMethod} eventDescription={eventDescription} setEventDescription={setEventDescription} />}
                 </AccordionContent>
            </AccordionItem>
        );

        const artReviewContent = (
            <AccordionItem value="step-4">
                <AccordionTrigger disabled={!completedSteps.includes(2)}>Passo 4: Revise e Edite sua Arte</AccordionTrigger>
                <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        {/* Preview */}
                        <div className="sticky top-24">
                             <Card>
                                <CardHeader>
                                    <CardTitle>Sua Arte no Copo</CardTitle>
                                    <CardDescription>Veja como a arte ficará aplicada.</CardDescription>
                                </CardHeader>
                                <CardContent className="flex items-center justify-center p-4">
                                     <div className="relative w-64 h-64">
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
                                          {art && (
                                            <div
                                              className="absolute inset-0 flex items-center justify-center"
                                              style={{
                                                width: `${activeCupModel.printableArea?.widthPercent || 80}%`,
                                                height: `${activeCupModel.printableArea?.heightPercent || 40}%`,
                                                top: '30%',
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                              }}
                                            >
                                                <Image src={art.imageUrl} alt="Arte gerada" fill className="object-contain" />
                                                <div className="absolute inset-0 border-2 border-dashed border-primary/50" title={`Área de Impressão: ${activeCupModel.printableArea?.width_mm}mm x ${activeCupModel.printableArea?.height_mm}mm`}></div>
                                            </div>
                                          )}
                                     </div>
                                </CardContent>
                             </Card>
                        </div>
                        {/* Edit tools */}
                        <div className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><Sparkles className="text-primary"/> Análise da IA</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">{analysis?.reasoning}</p>
                                    <p className="text-2xl font-bold text-primary mt-2">Complexidade: {analysis?.score}/10</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><Edit /> Ajustes</CardTitle>
                                </CardHeader>
                                <CardContent>
                                     <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="refine">
                                        <TabsList className="grid w-full grid-cols-2">
                                            <TabsTrigger value="refine"><Wand2 className="mr-2"/>Ajuste Fino com IA</TabsTrigger>
                                            <TabsTrigger value="regenerate" onClick={() => setCurrentStep(2)}><RefreshCw className="mr-2"/>Gerar Outra</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="refine" className="mt-4 space-y-4">
                                             <Textarea
                                                placeholder="Ex: 'Adicione um chapéu de pirata', 'mude a cor do texto para azul', 'remova o fundo'... "
                                                value={refinementInstruction}
                                                onChange={(e) => setRefinementInstruction(e.target.value)}
                                                rows={3}
                                            />
                                            <Button onClick={handleRefineArt} disabled={isRefining || !refinementInstruction} className="w-full">
                                                {isRefining ? <Loader className="mr-2" /> : <Sparkles className="mr-2" />}
                                                Refinar Arte
                                            </Button>
                                        </TabsContent>
                                    </Tabs>
                                </CardContent>
                            </Card>
                             <Button onClick={() => completeStep(3)} size="lg" className="w-full">
                                 <CheckCircle className="mr-2"/> Aprovar Arte e ir para Orçamento
                             </Button>
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
        );

        const quoteContent = (
            <AccordionItem value="step-5">
                 <AccordionTrigger disabled={!completedSteps.includes(3)}>Passo 5: Orçamento e Compra</AccordionTrigger>
                 <AccordionContent>
                     {art && analysis && (
                        <QuoteSummary
                            initialDetails={{
                                cupModel: activeCupModel,
                                eventDescription,
                                art,
                                artComplexity: { score: analysis.score, reasoning: analysis.reasoning },
                            }}
                            onFinalize={handleFinalize}
                            onBack={() => setCurrentStep(4)}
                        />
                     )}
                 </AccordionContent>
            </AccordionItem>
        );

        return (
            <Accordion type="single" value={`step-${currentStep}`} collapsible onValueChange={(val) => val && setCurrentStep(parseInt(val.split('-')[1]))}>
                {cupSelectionContent}
                {artMethodContent}
                {artCreationContent}
                {isPending && (
                    <div className="my-8">
                       <Loader message={isRefining ? "Refinando sua arte..." : "Analisando a complexidade da sua arte..."} />
                    </div>
                )}
                {art && analysis && !isPending && artReviewContent}
                {art && analysis && !isPending && quoteContent}
            </Accordion>
        )
    }

    return (
        <div>
            <div className="flex items-center gap-4 mb-8">
                <Button variant="outline" size="sm" onClick={onBackToSelector}><ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Seleção</Button>
                <Separator orientation="vertical" className="h-6" />
                <h2 className="text-xl font-bold">Personalizando: <span className="text-primary">{selectedCupName}</span></h2>
            </div>
            {renderStepContent()}
        </div>
    );
}
