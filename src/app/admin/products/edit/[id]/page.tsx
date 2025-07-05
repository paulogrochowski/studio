
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CUP_TYPES_SUMMARY, ALL_RIMS, DEGRADE_COLORS, RIM_COLORS, DEGRADE_HEX_COLORS } from '@/lib/cup-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, PlusCircle, Slash } from 'lucide-react';
import Image from 'next/image';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';


interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const { id } = params;
  const product = CUP_TYPES_SUMMARY.find((p) => p.id === id);
  const [isRimDialogOpen, setRimDialogOpen] = useState(false);
  const [isDegradeDialogOpen, setDegradeDialogOpen] = useState(false);

  if (!product) {
    notFound();
  }
  
  const availableRims = ALL_RIMS;
  const availableDegrades = DEGRADE_COLORS;

  const handleAddNewOption = (type: 'rim' | 'degrade') => {
    // In a real app, this would submit to a server action to save the new option.
    console.log(`Simulating adding a new ${type}`);
    if (type === 'rim') setRimDialogOpen(false);
    if (type === 'degrade') setDegradeDialogOpen(false);
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
          Editar: {product.name}
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
                        <Input id="name" defaultValue={product.name} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="basePrice">Preço Base (R$)</Label>
                        <Input id="basePrice" type="number" step="0.01" defaultValue={product.basePrice} />
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Opções de Personalização</CardTitle>
                    <CardDescription>Configure as opções disponíveis para este modelo de copo.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="multiple" className="w-full" defaultValue={['item-1', 'item-2', 'item-3']}>
                        <AccordionItem value="item-1">
                            <AccordionTrigger>Cores e Acabamentos</AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-4">
                                <p className='text-sm text-muted-foreground'>Selecione os acabamentos permitidos para este modelo de copo.</p>
                                <div className="flex flex-wrap gap-4 mt-2">
                                     <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button className={cn("relative w-12 h-12 rounded-md border-2 flex items-center justify-center transition-all overflow-hidden", 'border-primary ring-2 ring-primary ring-offset-2 ring-offset-background')}>
                                                    <div className="w-full h-full bg-foreground/20"></div>
                                                    <Check className="absolute h-6 w-6 text-primary-foreground mix-blend-difference" />
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent><p>Fosco (Ativo)</p></TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button className={cn("relative w-12 h-12 rounded-md border-2 flex items-center justify-center transition-all overflow-hidden", 'border-primary ring-2 ring-primary ring-offset-2 ring-offset-background')}>
                                                    <div className="w-full h-full checkerboard"></div>
                                                    <Check className="absolute h-6 w-6 text-primary-foreground mix-blend-difference" />
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent><p>Transparente (Ativo)</p></TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>Opções de Borda</AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-4">
                                <p className='text-sm text-muted-foreground'>Gerencie as cores de borda disponíveis.</p>
                                <TooltipProvider>
                                    <div className="flex flex-wrap items-center gap-3 mt-2">
                                        {availableRims.map(rim => (
                                            <Tooltip key={rim}>
                                                <TooltipTrigger asChild>
                                                    <button
                                                        className={cn(
                                                            "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all",
                                                            'border-primary ring-2 ring-primary ring-offset-2 ring-offset-background'
                                                        )}
                                                        style={{ backgroundColor: rim === 'Nenhuma' ? 'hsl(var(--muted))' : RIM_COLORS[rim] }}
                                                    >
                                                        {rim === 'Nenhuma' && <Slash className="h-5 w-5 text-muted-foreground" />}
                                                    </button>
                                                </TooltipTrigger>
                                                <TooltipContent><p>{rim}</p></TooltipContent>
                                            </Tooltip>
                                        ))}
                                        <Dialog open={isRimDialogOpen} onOpenChange={setRimDialogOpen}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm" className='gap-2 rounded-full'>
                                                    <PlusCircle className="h-4 w-4" /> Adicionar Borda
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
                                                        <Input id="rim-name" placeholder="Ex: Cobre Metálico" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="rim-hex">Cor (Hex)</Label>
                                                        <Input id="rim-hex" placeholder="#B87333" />
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
                                                    <Button onClick={() => handleAddNewOption('rim')}>Salvar Cor</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </TooltipProvider>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger>Opções de Degradê</AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-4">
                               <p className='text-sm text-muted-foreground'>Gerencie as cores de degradê disponíveis.</p>
                                <TooltipProvider>
                                    <div className="flex flex-wrap items-center gap-3 mt-2">
                                        {availableDegrades.filter(c => c !== 'Nenhum').map(color => (
                                            <Tooltip key={color}>
                                                <TooltipTrigger asChild>
                                                    <button
                                                        className={cn("w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all", 'border-primary ring-2 ring-primary ring-offset-2 ring-offset-background')}
                                                        style={{ background: `linear-gradient(to bottom, ${DEGRADE_HEX_COLORS[color]}, hsl(var(--card)))` }}
                                                    />
                                                </TooltipTrigger>
                                                <TooltipContent><p>{color}</p></TooltipContent>
                                            </Tooltip>
                                        ))}
                                        <Dialog open={isDegradeDialogOpen} onOpenChange={setDegradeDialogOpen}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm" className='gap-2 rounded-full'>
                                                    <PlusCircle className="h-4 w-4" /> Adicionar Cor
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Adicionar Nova Cor de Degradê</DialogTitle>
                                                </DialogHeader>
                                                 <div className="space-y-4 py-2">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="degrade-name">Nome da Cor</Label>
                                                        <Input id="degrade-name" placeholder="Ex: Verde Esmeralda" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="degrade-hex">Cor (Hex)</Label>
                                                        <Input id="degrade-hex" placeholder="#50C878" />
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
                                                    <Button onClick={() => handleAddNewOption('degrade')}>Salvar Cor</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </TooltipProvider>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>
        </div>
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Imagem do Produto</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <Card className="aspect-square w-full overflow-hidden">
                        <Image
                            alt={product.name}
                            className="aspect-square w-full object-cover"
                            height="200"
                            src={product.imageUrl}
                            width="200"
                        />
                    </Card>
                    <Button variant="outline" size="sm" className="mt-4 w-full">
                        Alterar imagem
                    </Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Modelo 3D</CardTitle>
                    <CardDescription>
                        Faça o upload do arquivo .glb para a pré-visualização 3D.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-2">
                        <Label htmlFor="model-file" className="sr-only">Upload</Label>
                        <Input id="model-file" type="file" accept=".glb" />
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
