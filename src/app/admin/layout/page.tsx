
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminLayoutPage() {
    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">Personalização do Layout</h1>
                <p className="text-muted-foreground">Ajuste a aparência da sua loja.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Cores do Tema</CardTitle>
                    <CardDescription>Defina as cores primárias, de fundo e de destaque do seu site.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label>Cor Primária (ex: botões, links)</Label>
                        <div className="flex items-center gap-2">
                            <Input type="color" defaultValue="#FBBF24" className="w-12 h-10 p-1" />
                            <Input type="text" defaultValue="#FBBF24" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Cor de Fundo</Label>
                        <div className="flex items-center gap-2">
                            <Input type="color" defaultValue="#000000" className="w-12 h-10 p-1" />
                            <Input type="text" defaultValue="#000000" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Cor de Destaque</Label>
                        <div className="flex items-center gap-2">
                            <Input type="color" defaultValue="#3F3F46" className="w-12 h-10 p-1" />
                            <Input type="text" defaultValue="#3F3F46" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Tipografia</CardTitle>
                    <CardDescription>Escolha as fontes para os títulos e para o corpo do texto.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="headline-font">Fonte dos Títulos</Label>
                        <Select defaultValue="oswald">
                            <SelectTrigger id="headline-font">
                                <SelectValue placeholder="Selecionar fonte" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="oswald">Oswald</SelectItem>
                                <SelectItem value="montserrat">Montserrat</SelectItem>
                                <SelectItem value="roboto">Roboto Slab</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="body-font">Fonte do Corpo</Label>
                        <Select defaultValue="inter">
                            <SelectTrigger id="body-font">
                                <SelectValue placeholder="Selecionar fonte" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="inter">Inter</SelectItem>
                                <SelectItem value="lato">Lato</SelectItem>
                                <SelectItem value="open-sans">Open Sans</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button size="lg">Salvar Alterações</Button>
            </div>
        </div>
    );
}
