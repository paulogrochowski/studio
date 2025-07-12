
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, FileText, BarChart2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from 'next/image';

export default function AdminMarketingPage() {
    const [seoName, setSeoName] = useState('');
    const [seoDesc, setSeoDesc] = useState('');
    const [adPrompt, setAdPrompt] = useState('');
    const [generatedAd, setGeneratedAd] = useState<string | null>(null);

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">Ferramentas de Marketing</h1>
                <p className="text-muted-foreground">Otimize a presença online e crie campanhas.</p>
            </div>

            <Tabs defaultValue="seo">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="seo"><FileText className="mr-2"/>Otimização de SEO</TabsTrigger>
                    <TabsTrigger value="ads"><Sparkles className="mr-2"/>Criador de Anúncios</TabsTrigger>
                    <TabsTrigger value="analytics"><BarChart2 className="mr-2"/>Análise</TabsTrigger>
                </TabsList>

                <TabsContent value="seo">
                    <Card>
                        <CardHeader>
                            <CardTitle>Otimizador de SEO para Produto</CardTitle>
                            <CardDescription>Gere títulos e descrições otimizados para buscadores.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label>Nome do Produto</label>
                                <Input placeholder="Ex: Copo Long Drink Personalizado" value={seoName} onChange={(e) => setSeoName(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label>Breve Descrição</label>
                                <Textarea placeholder="Ex: Perfeito para festas de 15 anos, casamentos e formaturas." value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)} />
                            </div>
                            <Button><Sparkles className="mr-2"/>Otimizar com IA</Button>
                             <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-4">
                                <div>
                                    <h4 className="font-bold">Título SEO Sugerido:</h4>
                                    <p className="text-sm">Copo Long Drink Personalizado para Festas | Copos Mania</p>
                                </div>
                                 <div>
                                    <h4 className="font-bold">Meta Descrição Sugerida:</h4>
                                    <p className="text-sm">Crie seu Copo Long Drink personalizado na Copos Mania! Alta qualidade para festas e eventos. Compre online com entrega para todo o Brasil.</p>
                                </div>
                             </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="ads">
                    <Card>
                        <CardHeader>
                            <CardTitle>Gerador de Criativos para Anúncios</CardTitle>
                            <CardDescription>Descreva o anúncio que você quer e a IA criará uma imagem.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label>Descrição do Anúncio</label>
                                <Textarea placeholder="Ex: Um banner colorido com vários copos personalizados em uma mesa de festa com balões ao fundo." value={adPrompt} onChange={(e) => setAdPrompt(e.target.value)} />
                            </div>
                            <Button onClick={() => setGeneratedAd("https://placehold.co/1080x1080.png")}>
                                <Sparkles className="mr-2"/>Gerar Imagem
                            </Button>
                            {generatedAd && (
                                 <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-2">
                                     <h4 className="font-bold">Imagem Gerada:</h4>
                                     <div className="aspect-square relative w-full max-w-sm mx-auto">
                                        <Image src={generatedAd} alt="Anúncio gerado por IA" layout="fill" className="rounded-md" />
                                     </div>
                                      <Button variant="outline" className="w-full mt-2">Salvar Imagem</Button>
                                 </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
                
                <TabsContent value="analytics">
                    <Card>
                         <CardHeader>
                            <CardTitle>Análise de Marketing</CardTitle>
                            <CardDescription>Em breve: conecte suas contas de anúncios e veja o desempenho aqui.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center justify-center text-center py-16 bg-muted/50 rounded-lg border-2 border-dashed">
                                <BarChart2 className="w-12 h-12 text-muted-foreground mb-4" />
                                <h3 className="text-xl font-bold">Métricas em Breve</h3>
                                <p className="text-muted-foreground">Esta funcionalidade está em desenvolvimento.</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

            </Tabs>
        </div>
    );
}
