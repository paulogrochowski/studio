
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CUP_TYPES_SUMMARY, ALL_RIMS, DEGRADE_COLORS, RIM_COLORS, DEGRADE_HEX_COLORS, CUP_CATALOG } from '@/lib/cup-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PlusCircle, UploadCloud } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { PreviewCard } from '@/components/preview-card';
import type { CupModel } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';


interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const { id } = params;
  const productSummary = CUP_TYPES_SUMMARY.find((p) => p.id === id);
  const productDetails = CUP_CATALOG.find((p) => p.name === productSummary?.name);

  const [isRimDialogOpen, setRimDialogOpen] = useState(false);
  const [isDegradeDialogOpen, setDegradeDialogOpen] = useState(false);
  const [isBaseColorDialogOpen, setBaseColorDialogOpen] = useState(false);
  
  // State for dynamic options
  const [availableRims, setAvailableRims] = useState<string[]>([...ALL_RIMS]);
  const [availableDegrades, setAvailableDegrades] = useState<string[]>([...DEGRADE_COLORS]);
   const [availableBaseColors, setAvailableBaseColors] = useState([
    { name: 'Branco', hex: '#FFFFFF', price: 0.00 },
    { name: 'Preto', hex: '#000000', price: 0.50 }
  ]);
  
  const [dynamicRimColors, setDynamicRimColors] = useState<Record<string, string>>({});
  const [dynamicDegradeColors, setDynamicDegradeColors] = useState<Record<string, string>>({});

  const [newRimName, setNewRimName] = useState('');
  const [newRimHex, setNewRimHex] = useState('');

  const [newDegradeName, setNewDegradeName] = useState('');
  const [newDegradeHex, setNewDegradeHex] = useState('');

  const [newBaseColorName, setNewBaseColorName] = useState('');
  const [newBaseColorHex, setNewBaseColorHex] = useState('');


  if (!productSummary || !productDetails) {
    notFound();
  }
  
  const previewModel: CupModel = {
    ...productDetails,
    name: productSummary.name,
    basePrice: productSummary.basePrice,
    imageUrl: productSummary.imageUrl,
    colorHex: '#FFFFFF',
    opacityType: 'Fosco',
    rimColor: 'Nenhuma',
    degradeColor: 'Nenhum',
  };


  const combinedRimColors: Record<string, string> = { ...RIM_COLORS, ...dynamicRimColors };
  const combinedDegradeColors: Record<string, string> = { ...DEGRADE_HEX_COLORS, ...dynamicDegradeColors };


  const handleAddNewOption = (type: 'rim' | 'degrade' | 'baseColor') => {
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
    if (type === 'baseColor') {
        if (!newBaseColorName || !newBaseColorHex) return;
        // Don't add if name already exists
        if (availableBaseColors.some(c => c.name.toLowerCase() === newBaseColorName.toLowerCase())) return;
        setAvailableBaseColors(prev => [...prev, { name: newBaseColorName, hex: newBaseColorHex, price: 0.00 }]);
        setNewBaseColorName('');
        setNewBaseColorHex('');
        setBaseColorDialogOpen(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-4xl flex-1 auto-rows-max gap-4">
      <div className="flex items-center gap-4">
         <Link href="/admin/products">
            <Button variant="outline" size="icon" className="h-7 w-7">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Voltar</span>
            </Button>
        </Link>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          Editar: {productSummary.name}
        </h1>
        <div className="hidden items-center gap-2 md:ml-auto md:flex">
            <Link href="/admin/products">
                <Button variant="outline" size="sm">
                    Descartar
                </Button>
            </Link>
            <Button size="sm">Salvar Produto</Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Detalhes do Produto</CardTitle>
                    <CardDescription>Informações básicas do modelo do copo.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="name">Nome do Produto</Label>
                        <Input id="name" defaultValue={productSummary.name} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="summary">Resumo do Produto</Label>
                        <Input id="summary" placeholder="Uma frase curta que descreve o produto." defaultValue={productSummary.summary || ''} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Descrição Completa</Label>
                        <Textarea id="description" placeholder="Descreva em detalhes o produto, seus usos, materiais e características." defaultValue={productSummary.description || ''} rows={5} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="basePrice">Preço Base (R$)</Label>
                        <Input id="basePrice" type="number" step="0.01" defaultValue={productSummary.basePrice} />
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Opções de Personalização</CardTitle>
                    <CardDescription>Configure as opções disponíveis para este modelo de copo e seus custos.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="multiple" className="w-full" defaultValue={['item-1', 'item-2', 'item-3', 'item-4']}>
                        <AccordionItem value="item-1">
                            <AccordionTrigger>Acabamentos</AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-4">
                                <p className='text-sm text-muted-foreground'>Defina os custos adicionais para cada tipo de acabamento do copo.</p>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between gap-4 p-3 border rounded-md">
                                        <div>
                                            <Label>Fosco</Label>
                                            <p className="text-xs text-muted-foreground">Acabamento padrão, sem brilho.</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Label htmlFor="price-fosco" className="text-sm">Custo (R$)</Label>
                                            <Input id="price-fosco" type="number" step="0.01" defaultValue="0.00" className="w-24" />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between gap-4 p-3 border rounded-md">
                                        <div>
                                            <Label>Transparente</Label>
                                            <p className="text-xs text-muted-foreground">Material translúcido, efeito de vidro.</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Label htmlFor="price-transparente" className="text-sm">Custo (R$)</Label>
                                            <Input id="price-transparente" type="number" step="0.01" defaultValue="0.25" className="w-24" />
                                        </div>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>Cores de Base</AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-4">
                                <p className='text-sm text-muted-foreground'>Gerencie as cores de base disponíveis para este produto e seus custos.</p>
                                <div className="space-y-2">
                                    {availableBaseColors.map((color) => (
                                        <div key={color.name} className="flex items-center justify-between gap-4 p-2 border rounded-md">
                                            <div className="flex items-center gap-3">
                                                <div className="w-5 h-5 rounded-full border" style={{ backgroundColor: color.hex }}/>
                                                <Label>{color.name}</Label>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Label htmlFor={`price-base-${color.name}`} className="text-sm">Custo (R$)</Label>
                                                <Input id={`price-base-${color.name}`} type="number" step="0.01" defaultValue={color.price.toFixed(2)} className="w-24" />
                                            </div>
                                        </div>
                                    ))}
                                    <Dialog open={isBaseColorDialogOpen} onOpenChange={setBaseColorDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm" className='gap-2 w-full mt-2'>
                                                <PlusCircle className="h-4 w-4" /> Adicionar Cor de Base
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Adicionar Nova Cor de Base</DialogTitle>
                                                <DialogDescription>
                                                    Esta nova cor ficará disponível para seleção nos produtos.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4 py-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor="base-color-name">Nome da Cor</Label>
                                                    <Input id="base-color-name" placeholder="Ex: Azul Royal" value={newBaseColorName} onChange={(e) => setNewBaseColorName(e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="base-color-hex">Cor (Hex)</Label>
                                                    <Input id="base-color-hex" placeholder="#4169E1" value={newBaseColorHex} onChange={(e) => setNewBaseColorHex(e.target.value)} />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
                                                <Button onClick={() => handleAddNewOption('baseColor')}>Salvar Cor</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger>Opções de Borda</AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-4">
                                <p className='text-sm text-muted-foreground'>Gerencie as cores de borda disponíveis e seus custos.</p>
                                <div className="space-y-2">
                                    {availableRims.filter(rim => rim !== 'Nenhuma').map(rim => (
                                        <div key={rim} className="flex items-center justify-between gap-4 p-2 border rounded-md">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-5 h-5 rounded-full border"
                                                    style={{ backgroundColor: combinedRimColors[rim] }}
                                                />
                                                <Label>{rim}</Label>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Label htmlFor={`price-rim-${rim}`} className="text-sm">Custo (R$)</Label>
                                                <Input id={`price-rim-${rim}`} type="number" step="0.01" defaultValue="0.75" className="w-24" />
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
                                        <div key={color} className="flex items-center justify-between gap-4 p-2 border rounded-md">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-5 h-5 rounded-full border"
                                                    style={{ background: `linear-gradient(to bottom, ${combinedDegradeColors[color]}, hsl(var(--card)))` }}
                                                />
                                                <Label>{color}</Label>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Label htmlFor={`price-degrade-${color}`} className="text-sm">Custo (R$)</Label>
                                                <Input id={`price-degrade-${color}`} type="number" step="0.01" defaultValue="1.20" className="w-24" />
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
        </div>
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
            <PreviewCard 
                cupModel={previewModel} 
                art={null} 
                showScrollDownButton={false}
            />
            <Card>
                <CardHeader>
                    <CardTitle>Modelo 3D</CardTitle>
                    <CardDescription>
                        Arraste e solte ou clique para carregar o arquivo .glb.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center w-full">
                        <label htmlFor="model-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                                <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Clique para carregar</span> ou arraste e solte</p>
                                <p className="text-xs text-muted-foreground">Arquivo .GLB</p>
                            </div>
                            <Input id="model-file" type="file" accept=".glb" className="hidden" />
                        </label>
                    </div> 
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Dimensões</CardTitle>
                    <CardDescription>Para cálculo de frete.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="weight">Peso (g)</Label>
                        <Input id="weight" type="number" defaultValue="110" />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <div className="grid gap-2">
                            <Label htmlFor="height">Altura (cm)</Label>
                            <Input id="height" type="number" step="0.1" defaultValue="15.5" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="width">Largura (cm)</Label>
                            <Input id="width" type="number" step="0.1" defaultValue="6.5" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="depth">Profundidade (cm)</Label>
                            <Input id="depth" type="number" step="0.1" defaultValue="6.5" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
       <div className="flex items-center justify-end gap-2 md:hidden mt-4">
            <Button variant="outline" size="sm">
                Descartar
            </Button>
            <Button size="sm">Salvar Produto</Button>
        </div>
    </div>
  );
}
