
'use client';

import { useState, useTransition, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound, useRouter } from 'next/navigation';
import { CUP_TYPES_SUMMARY, ALL_RIMS, DEGRADE_COLORS, RIM_COLORS, DEGRADE_HEX_COLORS, CUP_CATALOG } from '@/lib/cup-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PlusCircle, UploadCloud, Sparkles, Rocket, Loader2, FileText, Save } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import type { CupModel } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';
import { handleSeoOptimization, handleAdminUpdateProduct } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import CupPreview3D from '@/components/cup-preview-3d';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const { id } = params;
  const router = useRouter();
  const { toast } = useToast();
  const productSummary = CUP_TYPES_SUMMARY.find((p) => p.id === id);
  const productDetails = CUP_CATALOG.find((p) => p.name === productSummary?.name);
  
  const [isSaving, startSaveTransition] = useTransition();

  // States must be at the top level, before any early returns.
  const [productName, setProductName] = useState(productSummary?.name || '');
  const [productSummaryText, setProductSummaryText] = useState(productSummary?.summary || '');
  const [productDescription, setProductDescription] = useState(productSummary?.description || '');
  const [showcaseImagePreview, setShowcaseImagePreview] = useState<string | null>(productSummary?.imageUrl || null);
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [modelPreviewUrl, setModelPreviewUrl] = useState<string | null>(null);
  const [isCustomizable, setIsCustomizable] = useState(true);


  const [isRimDialogOpen, setRimDialogOpen] = useState(false);
  const [isDegradeDialogOpen, setDegradeDialogOpen] = useState(false);
  
  const [availableRims, setAvailableRims] = useState<string[]>([...ALL_RIMS]);
  const [availableDegrades, setAvailableDegrades] = useState<string[]>([...DEGRADE_COLORS]);
  
  const [dynamicRimColors, setDynamicRimColors] = useState<Record<string, string>>({});
  const [dynamicDegradeColors, setDynamicDegradeColors] = useState<Record<string, string>>({});

  const [newRimName, setNewRimName] = useState('');
  const [newRimHex, setNewRimHex] = useState('');

  const [newDegradeName, setNewDegradeName] = useState('');
  const [newDegradeHex, setNewDegradeHex] = useState('');

  const [isOptimizing, startSeoTransition] = useTransition();
  const [seoTitle, setSeoTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [keywords, setKeywords] = useState('');

  const handleShowcaseImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Clean up previous blob url to prevent memory leaks if it exists
      if (showcaseImagePreview && showcaseImagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(showcaseImagePreview);
      }
      setShowcaseImagePreview(URL.createObjectURL(file));
    }
  };

  const handleModelFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setModelFile(file);
        if (modelPreviewUrl) {
            URL.revokeObjectURL(modelPreviewUrl);
        }
        const newPreviewUrl = URL.createObjectURL(file);
        setModelPreviewUrl(newPreviewUrl);
        toast({
            title: "Arquivo Carregado",
            description: `O arquivo ${file.name} está pronto para ser visualizado.`
        });
    }
  };

  useEffect(() => {
    // This is a cleanup function that runs when the component unmounts.
    // It's important for preventing memory leaks from blob URLs.
    return () => {
      if (showcaseImagePreview && showcaseImagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(showcaseImagePreview);
      }
      if (modelPreviewUrl) {
        URL.revokeObjectURL(modelPreviewUrl);
      }
    };
  }, [showcaseImagePreview, modelPreviewUrl]);

  // Now we can safely check and exit if the product is not found.
  if (!productSummary || !productDetails) {
    notFound();
  }
  
  const previewModel: CupModel = {
    ...productDetails,
    name: productSummary.name,
    basePrice: productSummary.basePrice,
    imageUrl: productSummary.imageUrl,
    modelUrl: productSummary.modelUrl,
    colorHex: '#FFFFFF',
    opacityType: 'Fosco',
    rimColor: 'Nenhuma',
    degradeColor: 'Nenhum',
    degradePosition: 'Nenhum',
  };

  const combinedRimColors: Record<string, string> = { ...RIM_COLORS, ...dynamicRimColors };
  const combinedDegradeColors: Record<string, string> = { ...DEGRADE_HEX_COLORS, ...dynamicDegradeColors };


  const handleAddNewOption = (type: 'rim' | 'degrade') => {
    if (type === 'rim') {
        if (!newRimName || !newRimHex) return; 
        if (!availableRims.includes(newRimName)) {
            setAvailableRims(prev => [...prev, newRimName]);
        }
        setDynamicRimColors(prev => ({ ...prev, [newRimName]: newRimHex }));
        setNewRimName('');
        setNewRimHex('');
        setRimDialogOpen(false);
    }
    if (type === 'degrade') {
        if (!newDegradeName || !newDegradeHex) return;
        if (!availableDegrades.includes(newDegradeName)) {
            setAvailableDegrades(prev => [...prev, newDegradeName]);
        }
        setDynamicDegradeColors(prev => ({ ...prev, [newDegradeName]: newDegradeHex }));
        setNewDegradeName('');
        setNewDegradeHex('');
        setDegradeDialogOpen(false);
    }
  }

  const handleOptimizeSeo = () => {
    startSeoTransition(async () => {
        const result = await handleSeoOptimization({
            productName,
            productSummary: productSummaryText,
            productDescription
        });

        if (result.success && result.seoData) {
            setSeoTitle(result.seoData.seoTitle);
            setMetaDescription(result.seoData.metaDescription);
            setKeywords(result.seoData.keywords);
            toast({
                title: 'SEO Otimizado!',
                description: 'Os campos de SEO foram preenchidos com sugestões da IA.',
            });
        } else {
            toast({
                title: 'Erro na Otimização',
                description: result.error,
                variant: 'destructive',
            });
        }
    });
  };

  const clientAction = async (formData: FormData) => {
    startSaveTransition(async () => {
        const result = await handleAdminUpdateProduct(id, formData);
        if (result.success) {
            toast({ title: 'Sucesso!', description: result.message });
            router.push('/admin/products');
        } else {
            toast({ title: 'Erro ao Salvar', description: result.error, variant: 'destructive' });
        }
    });
  };

  return (
    <form action={clientAction}>
        <div className="mx-auto grid w-full flex-1 auto-rows-max gap-4">
        <div className="flex items-center gap-4">
            <Link href="/admin/products">
                <Button variant="outline" size="icon" className="h-7 w-7" type="button">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="sr-only">Voltar</span>
                </Button>
            </Link>
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            Editar: {productName}
            </h1>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
                <Button variant="outline" size="sm" type="button" onClick={() => router.push('/admin/products')}>
                    Descartar
                </Button>
                <Button size="sm" type="submit" disabled={isSaving}>
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Salvar Produto
                </Button>
            </div>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-3 lg:gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Detalhes do Produto</CardTitle>
                        <CardDescription>Informações básicas do modelo do copo.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome do Produto</Label>
                            <Input id="name" name="name" value={productName} onChange={(e) => setProductName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="summary">Resumo do Produto</Label>
                            <Input id="summary" name="summary" placeholder="Uma frase curta que descreve o produto." value={productSummaryText} onChange={(e) => setProductSummaryText(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Descrição Completa</Label>
                            <Textarea id="description" name="description" placeholder="Descreva em detalhes o produto, seus usos, materiais e características." value={productDescription} onChange={(e) => setProductDescription(e.target.value)} rows={5} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="basePrice">Preço Base (R$)</Label>
                            <Input id="basePrice" name="basePrice" type="number" step="0.01" defaultValue={productSummary.basePrice} />
                        </div>
                         <Separator />
                        <div className="flex items-center justify-between rounded-lg border p-3">
                            <div>
                                <Label htmlFor="is-customizable" className="text-base">Produto Personalizável</Label>
                                <p className="text-xs text-muted-foreground">
                                    Ativa o preview 3D e as opções de personalização para o cliente.
                                </p>
                            </div>
                            <Switch
                                id="is-customizable"
                                checked={isCustomizable}
                                onCheckedChange={setIsCustomizable}
                                name="isCustomizable"
                            />
                        </div>
                    </CardContent>
                </Card>
                {isCustomizable && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Opções de Personalização</CardTitle>
                        <CardDescription>Configure as opções disponíveis para este modelo de copo e seus custos.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="multiple" className="w-full" defaultValue={['item-1']}>
                            <AccordionItem value="item-1">
                                <AccordionTrigger>Acabamentos</AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-4">
                                    <p className='text-sm text-muted-foreground'>Defina os custos adicionais para cada tipo de acabamento do copo.</p>
                                    <div className="space-y-3">
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-3 border rounded-md">
                                            <div>
                                                <Label>Fosco</Label>
                                                <p className="text-xs text-muted-foreground">Acabamento padrão, sem brilho.</p>
                                            </div>
                                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                                <Label htmlFor="price-fosco" className="text-sm whitespace-nowrap">Custo (R$)</Label>
                                                <Input id="price-fosco" type="number" step="0.01" defaultValue="0.00" className="w-full sm:w-28" />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-3 border rounded-md">
                                            <div>
                                                <Label>Transparente</Label>
                                                <p className="text-xs text-muted-foreground">Material translúcido, efeito de vidro.</p>
                                            </div>
                                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                                <Label htmlFor="price-transparente" className="text-sm whitespace-nowrap">Custo (R$)</Label>
                                                <Input id="price-transparente" type="number" step="0.01" defaultValue="0.25" className="w-full sm:w-28" />
                                            </div>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3">
                                <AccordionTrigger>Opções de Borda</AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-4">
                                    <p className='text-sm text-muted-foreground'>Gerencie as cores de borda disponíveis e seus custos.</p>
                                    <div className="space-y-2">
                                        {availableRims.filter(rim => rim !== 'Nenhuma').map(rim => (
                                            <div key={rim} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-2 border rounded-md">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-5 h-5 rounded-full border"
                                                        style={{ backgroundColor: combinedRimColors[rim] }}
                                                    />
                                                    <Label>{rim}</Label>
                                                </div>
                                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                                    <Label htmlFor={`price-rim-${rim}`} className="text-sm whitespace-nowrap">Custo (R$)</Label>
                                                    <Input id={`price-rim-${rim}`} type="number" step="0.01" defaultValue="0.75" className="w-full sm:w-28" />
                                                </div>
                                            </div>
                                        ))}
                                        <Dialog open={isRimDialogOpen} onOpenChange={setRimDialogOpen}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm" className='gap-2 w-full mt-2'>
                                                    <PlusCircle className="h-4 w-4" /> Adicionar Cor de Borda
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Adicionar Nova Cor de Borda</DialogTitle>
                                                    <DialogDescription>
                                                        Esta nova cor ficará disponível para seleção nos produtos.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="space-y-4 py-2">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="rim-name">Nome da Cor</Label>
                                                        <Input id="rim-name" placeholder="Ex: Cobre Metálico" value={newRimName} onChange={(e) => setNewRimName(e.target.value)} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="rim-hex">Cor (Hex)</Label>
                                                        <Input id="rim-hex" placeholder="#B87333" value={newRimHex} onChange={(e) => setNewRimHex(e.target.value)} />
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
                                                    <Button onClick={() => handleAddNewOption('rim')}>Salvar Cor</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-4">
                                <AccordionTrigger>Opções de Degradê</AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-4">
                                <p className='text-sm text-muted-foreground'>Gerencie as cores de degradê disponíveis e seus custos.</p>
                                    <div className="space-y-2">
                                        {availableDegrades.filter(c => c !== 'Nenhum').map(color => (
                                            <div key={color} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-2 border rounded-md">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-5 h-5 rounded-full border"
                                                        style={{ background: `linear-gradient(to bottom, ${combinedDegradeColors[color]}, hsl(var(--card)))` }}
                                                    />
                                                    <Label>{color}</Label>
                                                </div>
                                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                                    <Label htmlFor={`price-degrade-${color}`} className="text-sm whitespace-nowrap">Custo (R$)</Label>
                                                    <Input id={`price-degrade-${color}`} type="number" step="0.01" defaultValue="1.20" className="w-full sm:w-28" />
                                                </div>
                                            </div>
                                        ))}
                                        <Dialog open={isDegradeDialogOpen} onOpenChange={setDegradeDialogOpen}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm" className='gap-2 w-full mt-2'>
                                                    <PlusCircle className="h-4 w-4" /> Adicionar Cor de Degradê
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Adicionar Nova Cor de Degradê</DialogTitle>
                                                        <DialogDescription>
                                                        Esta nova cor de degradê ficará disponível para seleção nos produtos.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                    <div className="space-y-4 py-2">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="degrade-name">Nome da Cor</Label>
                                                        <Input id="degrade-name" placeholder="Ex: Verde Esmeralda" value={newDegradeName} onChange={(e) => setNewDegradeName(e.target.value)} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="degrade-hex">Cor (Hex)</Label>
                                                        <Input id="degrade-hex" placeholder="#50C878" value={newDegradeHex} onChange={(e) => setNewDegradeHex(e.target.value)} />
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
                                                    <Button onClick={() => handleAddNewOption('degrade')}>Salvar Cor</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </CardContent>
                </Card>
                )}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">SEO e Marketing</CardTitle>
                        <CardDescription>Otimize a visibilidade do seu produto e crie campanhas.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="multiple" className="w-full">
                            <AccordionItem value="seo">
                                <AccordionTrigger>Otimização para Buscadores (SEO)</AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="seoTitle">Título para SEO</Label>
                                        <Input id="seoTitle" name="seoTitle" placeholder="Ex: Copo Long Drink Personalizado para Festas" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="metaDescription">Meta Descrição</Label>
                                        <Textarea id="metaDescription" name="metaDescription" placeholder="Descreva o produto de forma atraente para os buscadores." value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={3}/>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="keywords">Palavras-chave</Label>
                                        <Input id="keywords" name="keywords" placeholder="Ex: copo para festa, copo 350ml, long drink" value={keywords} onChange={(e) => setKeywords(e.target.value)} />
                                    </div>
                                    <Button onClick={handleOptimizeSeo} disabled={isOptimizing} variant="outline" className="w-full" type="button">
                                        {isOptimizing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                        Otimizar com IA
                                    </Button>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="marketing">
                                <AccordionTrigger>Marketing e Anúncios</AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-4">
                                    <p className="text-sm text-muted-foreground">Promova este produto criando um anúncio ou campanha de email marketing.</p>
                                    <Button asChild className="w-full" type="button">
                                        <Link href={`/admin/marketing?tab=creative&product_id=${id}`}>
                                            <Rocket className="mr-2 h-4 w-4" />
                                            Criar Anúncio / Campanha
                                        </Link>
                                    </Button>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </CardContent>
                </Card>
            </div>
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Imagem de Vitrine</CardTitle>
                        <CardDescription>
                            Carregue a imagem principal para a loja.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {showcaseImagePreview && (
                            <div className="relative aspect-video w-full rounded-md border overflow-hidden bg-muted/20">
                                <Image
                                    src={showcaseImagePreview}
                                    alt="Pré-visualização da imagem de vitrine"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        )}
                        <label htmlFor="image-file" className="w-full">
                            <Button asChild variant="outline" className="w-full cursor-pointer">
                                <div>
                                    <UploadCloud className="mr-2" />
                                    {showcaseImagePreview ? 'Trocar Imagem' : 'Carregar Imagem'}
                                </div>
                            </Button>
                            <Input 
                                id="image-file"
                                name="imageFile" 
                                type="file" 
                                accept="image/*" 
                                className="hidden"
                                onChange={handleShowcaseImageChange}
                            />
                        </label>
                    </CardContent>
                </Card>
                {isCustomizable && (
                    <>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Modelo 3D</CardTitle>
                                <CardDescription>
                                    Arraste e solte ou clique para carregar o arquivo.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-center w-full">
                                    <label htmlFor="model-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                                            {modelFile ? (
                                                <>
                                                    <FileText className="w-8 h-8 mb-4 text-primary" />
                                                    <p className="font-semibold text-primary">{modelFile.name}</p>
                                                    <p className="text-xs text-muted-foreground">Clique para trocar o arquivo</p>
                                                </>
                                            ) : (
                                                <>
                                                    <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                                                    <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Clique para carregar</span> ou arraste e solte</p>
                                                    <p className="text-xs text-muted-foreground">Qualquer tipo de arquivo 3D</p>
                                                </>
                                            )}
                                        </div>
                                        <Input 
                                            id="model-file"
                                            name="modelFile" 
                                            type="file" 
                                            className="hidden"
                                            onChange={handleModelFileChange}
                                        />
                                    </label>
                                </div> 
                            </CardContent>
                        </Card>
                        {modelPreviewUrl && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Preview 3D</CardTitle>
                                    <CardDescription>
                                    Visualize o modelo 3D carregado.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="relative aspect-[4/5] w-full rounded-b-md border-t overflow-hidden h-[450px]">
                                        <CupPreview3D 
                                            cupModel={previewModel} 
                                            art={null} 
                                            modelUrl={modelPreviewUrl}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </>
                )}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Dimensões</CardTitle>
                        <CardDescription>Para cálculo de frete.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="weight">Peso (g)</Label>
                            <Input id="weight" name="weight" type="number" defaultValue="110" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="height">Altura (cm)</Label>
                                <Input id="height" name="height" type="number" step="0.1" defaultValue="15.5" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="width">Largura (cm)</Label>
                                <Input id="width" name="width" type="number" step="0.1" defaultValue="6.5" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="depth">Profundidade (cm)</Label>
                                <Input id="depth" name="depth" type="number" step="0.1" defaultValue="6.5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
        <div className="flex items-center justify-center gap-2 mt-8">
            <Button variant="outline" size="lg" type="button" onClick={() => router.push('/admin/products')}>
                Descartar
            </Button>
            <Button size="lg" type="submit" disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Salvar Produto
            </Button>
        </div>
        </div>
    </form>
  );
}
