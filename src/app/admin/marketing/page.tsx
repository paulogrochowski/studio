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
import { FilePlus2, Send, Ticket, Sparkles, Image as ImageIcon, Pilcrow, TestTube2, Loader2, Gauge, BarChart } from "lucide-react";
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
      
      {/* Existing content for campaigns, coupons, email... */}
      <TabsContent value="campaigns"><AdminPlaceholder title="Gerenciador de Campanhas" /></TabsContent>
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

function AdminPlaceholder({ title }: { title: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center text-center py-16 text-muted-foreground">
         <FilePlus2 className="w-16 h-16 mb-4" />
        <h3 className="text-xl font-bold">Funcionalidade em Desenvolvimento</h3>
        <p>Esta área está sendo construída e estará disponível em breve.</p>
      </CardContent>
    </Card>
  )
}
