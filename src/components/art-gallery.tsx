'use client';
import { useState, useTransition, useMemo, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { handleArtRefinement } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2, ArrowLeft, Type, Download, Trash2, Palette, Box, UploadCloud, Settings2 } from 'lucide-react';
import type { GeneratedArt, CupModel } from '@/lib/types';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Slider } from './ui/slider';
import { Separator } from './ui/separator';
import { ScrollArea, ScrollBar } from './ui/scroll-area';
import { cn } from '@/lib/utils';

interface ArtGalleryProps {
  initialArt: GeneratedArt;
  cup: CupModel;
  onSelectArt: (art: GeneratedArt) => void;
  onRegenerate: () => void;
  onGoBack: () => void;
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

export function ArtGallery({ initialArt, cup, onSelectArt, onRegenerate, onGoBack }: ArtGalleryProps) {
  const [history, setHistory] = useState<GeneratedArt[]>([initialArt]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const currentArt = useMemo(() => history[selectedIndex], [history, selectedIndex]);
  
  const [refinementInput, setRefinementInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  
  const [texts, setTexts] = useState<TextOverlay[]>([]);
  const [selectedTextId, setSelectedTextId] = useState<number | null>(null);
  const selectedText = useMemo(() => texts.find(t => t.id === selectedTextId), [texts, selectedTextId]);

  const [newText, setNewText] = useState('');
  const [textColor, setTextColor] = useState('#000000');
  const [textSize, setTextSize] = useState(48);
  
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [previewWidth, setPreviewWidth] = useState(500);

  useEffect(() => {
    const container = previewContainerRef.current;
    if (container) {
      const resizeObserver = new ResizeObserver(entries => {
        if (entries[0]) {
          setPreviewWidth(entries[0].contentRect.width);
        }
      });
      resizeObserver.observe(container);
      return () => resizeObserver.disconnect();
    }
  }, []);

  const isAIArt = !["Arte enviada pelo usuário", "Arte desenhada pelo usuário"].includes(currentArt.prompt);

  const selectArtFromHistory = (index: number) => {
    setSelectedIndex(index);
    setTexts([]);
    setSelectedTextId(null);
  };

  const handleRefine = () => {
    if (!refinementInput) return;
    startTransition(async () => {
      const result = await handleArtRefinement(currentArt.imageUrl, refinementInput);
      if (result.success) {
        const newArt: GeneratedArt = {
            id: `art-${Date.now()}`,
            imageUrl: result.imageUrl,
            prompt: currentArt.prompt,
        };
        const newHistory = [...history, newArt];
        setHistory(newHistory);
        setSelectedIndex(newHistory.length - 1);
        setRefinementInput('');
        toast({ title: "Arte refinada!", description: "Sua arte foi atualizada com sucesso." });
      } else {
        toast({
          variant: 'destructive',
          title: 'Erro ao refinar',
          description: result.error,
        });
      }
    });
  };

  const handleAddText = () => {
    if (newText.trim() === '') return;
    const newId = Date.now();
    const newTextObject: TextOverlay = { 
      id: newId, 
      text: newText, 
      color: textColor, 
      size: textSize,
      x: 50,
      y: 50,
      rotation: 0,
      scale: 1,
    };
    setTexts(prev => [...prev, newTextObject]);
    setNewText('');
    setSelectedTextId(newId);
  };

  const removeText = (id: number) => {
    if (selectedTextId === id) {
      setSelectedTextId(null);
    }
    setTexts(prev => prev.filter(t => t.id !== id));
  };
  
  const updateSelectedText = (props: Partial<TextOverlay>) => {
    if (!selectedTextId) return;
    setTexts(prev => prev.map(t => t.id === selectedTextId ? { ...t, ...props } : t));
  };

  const createCompositeImage = (): Promise<string> => {
    return new Promise((resolve, reject) => {
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

          const scaledSize = text.size * (canvas.width / 500);
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

  const handleDownload = async () => {
    toast({title: 'Preparando seu download...'});
    try {
      const compositeImageUrl = await createCompositeImage();
      const link = document.createElement('a');
      link.href = compositeImageUrl;
      link.download = 'cup-vision-art.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Erro no Download', description: error.message });
    }
  };

  const handleSelectCompositeArt = () => {
    startTransition(async () => {
      try {
        const finalImageUrl = texts.length > 0 ? await createCompositeImage() : currentArt.imageUrl;
        onSelectArt({ ...currentArt, imageUrl: finalImageUrl });
      } catch (error: any) {
        toast({ variant: 'destructive', title: 'Erro ao processar a arte', description: error.message });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-3xl">3. Revise e Edite sua Arte</CardTitle>
        <CardDescription>
          Esta é a arte para o seu copo. Você pode fazer ajustes, adicionar textos ou voltar para escolher outra.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="flex flex-col items-center gap-4">
           <div ref={previewContainerRef} className="relative w-full aspect-square rounded-lg overflow-hidden border bg-secondary/50 shadow-inner">
            <Image src={currentArt.imageUrl} alt="Arte para o copo" fill className="object-contain p-4" />
            
            <div className="absolute inset-0 p-4">
              {texts.map(text => {
                const scaledSize = text.size * (previewWidth / 500);
                return (
                   <div
                      key={text.id}
                      className={cn(
                        "absolute pointer-events-auto cursor-pointer p-1 border border-transparent hover:border-dashed hover:border-primary/50",
                        selectedTextId === text.id && "border-primary border-dashed"
                      )}
                      style={{
                        top: `${text.y}%`,
                        left: `${text.x}%`,
                        transform: `translate(-50%, -50%) rotate(${text.rotation}deg) scale(${text.scale})`,
                      }}
                      onClick={() => setSelectedTextId(text.id)}
                    >
                      <div
                        className="pointer-events-none"
                        style={{
                          color: text.color,
                          fontSize: `${scaledSize}px`,
                          lineHeight: 1.2,
                          fontFamily: 'Alegreya, serif',
                          fontWeight: 'bold',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {text.text}
                      </div>
                    </div>
                );
              })}
            </div>

            <div 
              className="absolute inset-0 bg-no-repeat bg-contain bg-center opacity-20 pointer-events-none"
              style={{ backgroundImage: `url(${cup.imageUrl})`}}
            ></div>
          </div>
           <div className="space-y-2 w-full">
            <Label>Histórico de Versões</Label>
            <ScrollArea className="w-full whitespace-nowrap rounded-lg border">
              <div className="flex space-x-2 p-2">
                {history.map((art, index) => (
                  <button
                    key={art.id}
                    onClick={() => selectArtFromHistory(index)}
                    className={cn(
                        "relative h-20 w-20 shrink-0 cursor-pointer rounded-md overflow-hidden ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        selectedIndex === index && "ring-2 ring-primary"
                    )}
                  >
                    <Image src={art.imageUrl} alt={`Versão ${index + 1}`} fill className="object-contain bg-white p-1" />
                  </button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </div>
        <div className="space-y-6">
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="refine"><Wand2 /> Ajuste Fino</TabsTrigger>
              <TabsTrigger value="text"><Type /> Texto</TabsTrigger>
              <TabsTrigger value="tools" disabled={!selectedText}><Settings2 /> Ferramentas</TabsTrigger>
              <TabsTrigger value="3d" disabled><Box /> Visualizar 3D</TabsTrigger>
            </TabsList>
            <TabsContent value="refine" className="mt-4 border rounded-lg p-4">
              <div className="space-y-2">
                <Label htmlFor="refine" className="font-bold">Ajuste com IA</Label>
                <Textarea
                  id="refine"
                  placeholder="Ex: 'Adicione mais estrelas', 'Mude a cor do texto para dourado', 'Remova o fundo'..."
                  value={refinementInput}
                  onChange={(e) => setRefinementInput(e.target.value)}
                  rows={3}
                />
                <Button onClick={handleRefine} disabled={isPending || !isAIArt} className="w-full">
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Refinar com IA
                </Button>
                {!isAIArt && <p className="text-xs text-muted-foreground text-center">O refinamento com IA só está disponível para artes geradas pela IA.</p>}
              </div>
            </TabsContent>
            <TabsContent value="text" className="mt-4 border rounded-lg p-4 space-y-4">
               <div className="space-y-2">
                <Label htmlFor="text-input">Adicionar Texto</Label>
                <div className="flex gap-2">
                  <Input id="text-input" value={newText} onChange={e => setNewText(e.target.value)} placeholder="Sua frase aqui..." />
                  <Button onClick={handleAddText}>Adicionar</Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="text-color" className="flex items-center gap-2"><Palette className="w-4 h-4" /> Cor</Label>
                  <Input id="text-color" type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="p-1 h-10" />
                </div>
                <div className="space-y-2">
                  <Label>Tamanho: {textSize}pt</Label>
                  <Slider value={[textSize]} onValueChange={(v) => setTextSize(v[0])} min={12} max={120} step={1} />
                </div>
              </div>
              <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
                {texts.map(t => (
                  <div key={t.id} className="flex items-center justify-between bg-secondary/50 p-2 rounded-md text-sm">
                    <span style={{color: t.color}} className="font-bold font-body truncate">{t.text}</span>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeText(t.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                ))}
                {texts.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">Nenhum texto adicionado.</p>}
              </div>
            </TabsContent>
             <TabsContent value="tools" className="mt-4 border rounded-lg p-4 space-y-4">
              {selectedText ? (
                <>
                  <p className="text-sm font-bold text-center text-primary truncate">Editando: "{selectedText.text}"</p>
                  <div className="space-y-2">
                    <Label>Posição X: {selectedText.x}%</Label>
                    <Slider value={[selectedText.x]} onValueChange={(v) => updateSelectedText({ x: v[0] })} min={0} max={100} step={1} />
                  </div>
                  <div className="space-y-2">
                    <Label>Posição Y: {selectedText.y}%</Label>
                    <Slider value={[selectedText.y]} onValueChange={(v) => updateSelectedText({ y: v[0] })} min={0} max={100} step={1} />
                  </div>
                   <div className="space-y-2">
                    <Label>Rotação: {selectedText.rotation}°</Label>
                    <Slider value={[selectedText.rotation]} onValueChange={(v) => updateSelectedText({ rotation: v[0] })} min={-180} max={180} step={1} />
                  </div>
                  <div className="space-y-2">
                    <Label>Escala: {selectedText.scale.toFixed(2)}x</Label>
                    <Slider value={[selectedText.scale]} onValueChange={(v) => updateSelectedText({ scale: v[0] })} min={0.5} max={3} step={0.05} />
                  </div>
                </>
              ) : (
                <div className="text-center p-8 text-muted-foreground flex flex-col items-center gap-4">
                  <Settings2 />
                  <p className="font-bold">Selecione um texto</p>
                  <p className="text-xs">Clique em um texto na arte para editar suas propriedades aqui.</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="3d" className="mt-4 border rounded-lg p-4">
                <div className="text-center p-8 text-muted-foreground flex flex-col items-center gap-4">
                    <Box size={32}/>
                    <p className="font-bold">Em breve!</p>
                    <p className="text-xs">Visualize sua arte aplicada diretamente no modelo 3D do copo.</p>
                </div>
            </TabsContent>
          </Tabs>
          
          <Separator />

          <div className="space-y-2">
            <p className="font-bold text-center">Outras Opções</p>
            <div className="grid grid-cols-2 gap-2">
                <Button onClick={onRegenerate} variant="outline" className="w-full">
                    {isAIArt ? (
                        <><Wand2 /> Gerar outra</>
                    ) : (
                        <><UploadCloud/> Trocar Arte</>
                    )}
                </Button>
                <Button onClick={handleDownload} variant="outline" className="w-full">
                    <Download/> Baixar Arte
                </Button>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
         <Button variant="outline" onClick={onGoBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
        </Button>
        <Button onClick={handleSelectCompositeArt} size="lg" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Gostei, usar esta arte!
        </Button>
      </CardFooter>
    </Card>
  );
}
