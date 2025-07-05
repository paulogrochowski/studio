import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CUP_TYPES_SUMMARY, ALL_RIMS } from '@/lib/cup-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';


interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const { id } = params;
  const product = CUP_TYPES_SUMMARY.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  const availableRims = ALL_RIMS.filter(rim => rim !== 'Nenhuma');

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
                    <Accordion type="multiple" className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>Cores e Acabamentos</AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-4">
                                <div className="flex items-center justify-between rounded-lg border p-3">
                                    <Label htmlFor="opacity-matte" className="font-normal">Permitir acabamento Fosco</Label>
                                    <Switch id="opacity-matte" defaultChecked />
                                </div>
                                <div className="flex items-center justify-between rounded-lg border p-3">
                                    <Label htmlFor="opacity-transparent" className="font-normal">Permitir acabamento Transparente</Label>
                                    <Switch id="opacity-transparent" defaultChecked />
                                </div>
                                <p className="text-xs text-muted-foreground pt-2">Em breve: um painel completo para adicionar e gerenciar as cores sólidas disponíveis para este copo.</p>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>Opções de Borda</AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-4">
                               {availableRims.map(rim => (
                                <div className="flex items-center space-x-3" key={rim}>
                                    <Checkbox id={`rim-${rim}`} defaultChecked />
                                    <Label htmlFor={`rim-${rim}`} className="font-normal">{rim}</Label>
                                </div>
                               ))}
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger>Opções de Degradê</AccordionTrigger>
                            <AccordionContent className="pt-4">
                                <div className="flex items-center justify-between rounded-lg border p-3">
                                    <Label htmlFor="degrade-enabled" className="font-normal">Habilitar opção de degradê</Label>
                                    <Switch id="degrade-enabled" defaultChecked />
                                </div>
                                <p className="text-xs text-muted-foreground pt-4">Em breve: um painel para selecionar quais cores de degradê estarão disponíveis.</p>
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
                    <div className="relative aspect-square w-full">
                        <Image
                            alt={product.name}
                            className="aspect-square w-full rounded-md object-cover"
                            height="200"
                            src={product.imageUrl}
                            width="200"
                        />
                    </div>
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
    </div>
  );
}
