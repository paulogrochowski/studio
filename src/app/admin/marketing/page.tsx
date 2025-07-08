
'use client';

import { useState, useTransition } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FilePlus2, Send, Ticket, Sparkles, Image as ImageIcon, Pilcrow, TestTube2, Loader2, Gauge, BarChart, MoreHorizontal } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { handleGenerateAdCreative, handleOptimizeAdCopy, handleAnalyzeMarketingQuality } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { CUP_TYPES_SUMMARY } from '@/lib/cup-data';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import type { AnalyzeMarketingQualityOutput } from '@/ai/flows/analyze-marketing-quality';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";

const campaigns = [
  { id: '1', name: 'Lançamento Verão 2024', channel: 'Email', status: 'Ativa', period: '01/07/24 - 31/07/24' },
  { id: '2', name: 'Desconto Dia dos Pais', channel: 'Banner no Site', status: 'Agendada', period: '01/08/24 - 11/08/24' },
  { id: '3', name: 'Reativação de Clientes', channel: 'Email', status: 'Concluída', period: '15/06/24 - 30/06/24' },
  { id: '4', name: 'Promoção Relâmpago', channel: 'Notificação Push', status: 'Ativa', period: '10/07/24 - 12/07/24' },
];

type CampaignStatus = 'Ativa' | 'Agendada' | 'Concluída' | 'Pausada';
const getStatusVariant = (status: CampaignStatus): "default" | "secondary" | "outline" | "destructive" => {
  switch (status) {
    case 'Ativa': return 'default';
    case 'Agendada': return 'secondary';
    case 'Concluída': return 'outline';
    case 'Pausada': return 'destructive';
    default: return 'secondary';
  }
};


export default function AdminMarketingPage({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  const { toast } = useToast();
  const defaultTab = searchParams?.tab as string || 'campaigns';

  // State for Ad Creative Generator
  const [isGeneratingCreative, startGeneratingCreative] = useTransition();
  const [adCreativePrompt, setAdCreativePrompt] = useState('');
  const [creativeImageUrl, setCreativeImageUrl] = useState<string | null>(null);

  // State for Ad Copy Optimizer
  const [isOptimizingCopy, startOptimizingCopy] = useTransition();
  const [selectedProductForCopy, setSelectedProductForCopy] = useState('');
  const [optimizedCopy, setOptimizedCopy] = useState<{ headline: string, body: string, cta: string } | null>(null);

  // State for Marketing Analysis
  const [isAnalyzing, startAnalyzing] = useTransition();
  const [selectedProductForAnalysis, setSelectedProductForAnalysis] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalyzeMarketingQualityOutput | null>(null);
  
  const handleGenerateCreative = () => {
    if (!adCreativePrompt) {
      toast({ title: 'Erro', description: 'Por favor, descreva o anúncio que deseja criar.', variant: 'destructive' });
      return;
    }
    startGeneratingCreative(async () => {
      const result = await handleGenerateAdCreative({ prompt: adCreativePrompt });
      if (result.success) {
        setCreativeImageUrl(result.imageUrl!);
        toast({ title: 'Sucesso!', description: 'Sua imagem para o anúncio foi gerada.' });
      } else {
        toast({ title: 'Erro', description: result.error, variant: 'destructive' });
      }
    });
  };

  const handleOptimizeCopy = () => {
    if (!selectedProductForCopy) {
      toast({ title: 'Erro', description: 'Por favor, selecione um produto para otimizar.', variant: 'destructive' });
      return;
    }
    const product = CUP_TYPES_SUMMARY.find(p => p.id === selectedProductForCopy);
    if (!product) return;

    startOptimizingCopy(async () => {
      const result = await handleOptimizeAdCopy({ productName: product.name, productDescription: product.description || '' });
      if (result.success) {
        setOptimizedCopy(result.adCopy!);
        toast({ title: 'Sucesso!', description: 'O texto para seu anúncio foi otimizado.' });
      } else {
        toast({ title: 'Erro', description: result.error, variant: 'destructive' });
      }
    });
  };

  const handleAnalysis = () => {
    if (!selectedProductForAnalysis) {
      toast({ title: 'Erro', description: 'Por favor, selecione um produto para analisar.', variant: 'destructive' });
      return;
    }
     const product = CUP_TYPES_SUMMARY.find(p => p.id === selectedProductForAnalysis);
    if (!product) return;

    startAnalyzing(async () => {
      const result = await handleAnalyzeMarketingQuality({ productName: product.name, productDescription: product.description || '' });
      if (result.success) {
        setAnalysisResult(result.analysis!);
        toast({ title: 'Análise Concluída!', description: 'A qualidade de marketing do seu produto foi avaliada.' });
      } else {
        toast({ title: 'Erro', description: result.error, variant: 'destructive' });
      }
    });
  }

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
        <TabsTrigger value="coupons">Cupons</TabsTrigger>
        <TabsTrigger value="email">Email</TabsTrigger>
        <TabsTrigger value="banner">Banner</TabsTrigger>
        <TabsTrigger value="creative">Anúncios</TabsTrigger>
        <TabsTrigger value="analysis">Análise</TabsTrigger>
      </TabsList>
      
      <TabsContent value="campaigns">
        <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <CardTitle>Campanhas de Marketing</CardTitle>
                    <CardDescription>Crie e gerencie suas campanhas para engajar clientes.</CardDescription>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button size="sm" className="gap-2 w-full sm:w-auto"><FilePlus2 /> Criar Nova Campanha</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-xl">
                        <DialogHeader>
                            <DialogTitle>Criar Nova Campanha</DialogTitle>
                            <DialogDescription>Preencha os detalhes para criar uma nova campanha de marketing.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                           <div className="space-y-2">
                                <Label htmlFor="campaign-name">Nome da Campanha</Label>
                                <Input id="campaign-name" placeholder="Ex: Queima de Estoque de Inverno" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="campaign-channel">Canal</Label>
                                    <Select>
                                        <SelectTrigger id="campaign-channel"><SelectValue placeholder="Selecione o canal" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="email">Email Marketing</SelectItem>
                                            <SelectItem value="banner">Banner no Site</SelectItem>
                                            <SelectItem value="push">Notificação Push</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="campaign-audience">Público-alvo</Label>
                                    <Select>
                                        <SelectTrigger id="campaign-audience"><SelectValue placeholder="Selecione o público" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todos os Clientes</SelectItem>
                                            <SelectItem value="new">Novos Clientes (últimos 30 dias)</SelectItem>
                                            <SelectItem value="inactive">Clientes Inativos (sem compra há 90 dias)</SelectItem>
                                            <SelectItem value="top">Top Compradores</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="campaign-content">Conteúdo / Mensagem</Label>
                                <Textarea id="campaign-content" placeholder="Descreva o objetivo da campanha ou a mensagem principal. A IA pode ajudar a refinar." rows={4}/>
                            </div>
                            <Button variant="outline" className="w-full gap-2">
                                <Sparkles /> Gerar Conteúdo com IA
                            </Button>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
                            <Button>Salvar Campanha</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome da Campanha</TableHead>
                            <TableHead className="hidden sm:table-cell">Canal</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="hidden md:table-cell">Período</TableHead>
                            <TableHead className="w-12"><span className="sr-only">Ações</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                       {campaigns.map((campaign) => (
                           <TableRow key={campaign.id}>
                               <TableCell className="font-medium">{campaign.name}</TableCell>
                               <TableCell className="hidden sm:table-cell">{campaign.channel}</TableCell>
                               <TableCell><Badge variant={getStatusVariant(campaign.status as CampaignStatus)}>{campaign.status}</Badge></TableCell>
                               <TableCell className="hidden md:table-cell">{campaign.period}</TableCell>
                               <TableCell>
                                   <DropdownMenu>
                                       <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4"/></Button></DropdownMenuTrigger>
                                       <DropdownMenuContent align="end">
                                           <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                           <DropdownMenuItem>Editar</DropdownMenuItem>
                                           <DropdownMenuItem>Duplicar</DropdownMenuItem>
                                           <DropdownMenuItem>Pausar</DropdownMenuItem>
                                           <DropdownMenuItem className="text-destructive">Excluir</DropdownMenuItem>
                                       </DropdownMenuContent>
                                   </DropdownMenu>
                               </TableCell>
                           </TableRow>
                       ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="coupons"><AdminPlaceholder title="Gerenciador de Cupons" /></TabsContent>
      <TabsContent value="email"><AdminPlaceholder title="Criador de Email Marketing" /></TabsContent>

      {/* Banner Management Tab */}
      <TabsContent value="banner">
        <Card>
          <CardHeader>
            <CardTitle>Gerenciar Banner Promocional</CardTitle>
            <CardDescription>Edite o conteúdo do banner que aparece no topo de todas as páginas da loja.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2">
                <Label htmlFor="banner-text">Texto do Banner</Label>
                <Input id="banner-text" defaultValue="OFERTA ESPECIAL: Frete Grátis em pedidos acima de R$200!" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="banner-cta-text">Texto do Botão (Opcional)</Label>
                <Input id="banner-cta-text" placeholder="Ex: Aproveitar" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="banner-cta-link">Link do Botão (Opcional)</Label>
                <Input id="banner-cta-link" placeholder="Ex: /produtos/ofertas" />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="ml-auto">Salvar Alterações</Button>
          </CardFooter>
        </Card>
      </TabsContent>

      {/* Ad Creative Tab */}
      <TabsContent value="creative" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Gerador de Criativos para Anúncios</CardTitle>
            <CardDescription>Use IA para criar imagens e textos para suas campanhas de marketing.</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-8">
            {/* Image Generator */}
            <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2"><ImageIcon className="h-5 w-5 text-primary" /> Gerador de Imagem</h3>
                <div className="space-y-2">
                    <Label htmlFor="ad-prompt">Descreva a imagem do anúncio</Label>
                    <Textarea id="ad-prompt" placeholder="Ex: Um copo long drink branco com tema de verão, na praia, com cores vibrantes." rows={3} value={adCreativePrompt} onChange={e => setAdCreativePrompt(e.target.value)} />
                </div>
                <Button onClick={handleGenerateCreative} disabled={isGeneratingCreative} className="w-full">
                    {isGeneratingCreative ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Gerar Imagem
                </Button>
                {creativeImageUrl && (
                    <Card className="p-2">
                        <Image src={creativeImageUrl} width={500} height={500} alt="Criativo de anúncio gerado" className="rounded-md w-full" />
                    </Card>
                )}
            </div>

            {/* Copy Optimizer */}
            <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2"><Pilcrow className="h-5 w-5 text-primary" /> Otimizador de Texto</h3>
                <div className="space-y-2">
                    <Label htmlFor="product-select-copy">Selecione o Produto</Label>
                    <Select value={selectedProductForCopy} onValueChange={setSelectedProductForCopy}>
                        <SelectTrigger id="product-select-copy"><SelectValue placeholder="Escolha um produto" /></SelectTrigger>
                        <SelectContent>
                           {CUP_TYPES_SUMMARY.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <Button onClick={handleOptimizeCopy} disabled={isOptimizingCopy} className="w-full">
                    {isOptimizingCopy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Otimizar Texto do Anúncio
                </Button>
                {optimizedCopy && (
                    <Alert>
                        <AlertTitle>Texto Otimizado Gerado</AlertTitle>
                        <AlertDescription className="space-y-2 pt-2">
                            <p><strong>Título:</strong> {optimizedCopy.headline}</p>
                            <p><strong>Corpo:</strong> {optimizedCopy.body}</p>
                            <p><strong>CTA:</strong> <Button size="sm" variant="secondary" className="h-7">{optimizedCopy.cta}</Button></p>
                        </AlertDescription>
                    </Alert>
                )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Analysis Tab */}
      <TabsContent value="analysis">
        <Card>
            <CardHeader>
                <CardTitle>Análise de Qualidade de Marketing</CardTitle>
                <CardDescription>Avalie o potencial de SEO e de anúncio dos seus produtos com IA.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-end gap-2">
                    <div className="flex-1 space-y-2">
                        <Label htmlFor="product-select-analysis">Selecione um Produto para Analisar</Label>
                        <Select value={selectedProductForAnalysis} onValueChange={setSelectedProductForAnalysis}>
                            <SelectTrigger id="product-select-analysis"><SelectValue placeholder="Escolha um produto" /></SelectTrigger>
                            <SelectContent>
                                {CUP_TYPES_SUMMARY.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={handleAnalysis} disabled={isAnalyzing}>
                         {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <TestTube2 className="mr-2 h-4 w-4" />}
                        Analisar
                    </Button>
                </div>
                {isAnalyzing && <div className="text-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
                {analysisResult && (
                    <div className="grid md:grid-cols-2 gap-6 pt-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-base font-medium">Qualidade de SEO</CardTitle>
                                <BarChart className="h-5 w-5 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{analysisResult.seoScore}/10</div>
                                <Separator className="my-4" />
                                <h4 className="font-semibold mb-2">Sugestões:</h4>
                                <div className="text-sm text-muted-foreground space-y-1" dangerouslySetInnerHTML={{ __html: analysisResult.seoSuggestions.replace(/•/g, '<p>•') }}/>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-base font-medium">Potencial de Anúncio</CardTitle>
                                <Gauge className="h-5 w-5 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{analysisResult.adScore}/10</div>
                                <Separator className="my-4" />
                                <h4 className="font-semibold mb-2">Sugestões:</h4>
                                <div className="text-sm text-muted-foreground space-y-1" dangerouslySetInnerHTML={{ __html: analysisResult.adSuggestions.replace(/•/g, '<p>•') }}/>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
