
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Palette, Droplets, Type, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

export default function AdminLayoutEditorPage() {
    const { toast } = useToast();

    // State for color customization
    const [primaryColor, setPrimaryColor] = useState('48 96% 53%');
    const [backgroundColor, setBackgroundColor] = useState('0 0% 98%');
    const [accentColor, setAccentColor] = useState('0 0% 90%');

    // State for font customization
    const [headlineFont, setHeadlineFont] = useState('Oswald');
    const [bodyFont, setBodyFont] = useState('Inter');

    const handleSaveChanges = () => {
        // In a real app, this would trigger a server action to save the theme.
        // For this prototype, we'll just show a success toast.
        toast({
            title: 'Tema Salvo!',
            description: 'As alterações no layout da loja foram salvas (simulação).',
        });
    };
    
    // Dynamic style for the preview components
    const previewStyle: React.CSSProperties = {
        '--primary': primaryColor,
        '--background': backgroundColor,
        '--accent': accentColor,
        '--font-oswald': `"${headlineFont}", sans-serif`,
        '--font-inter': `"${bodyFont}", sans-serif`,
    } as React.CSSProperties;


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" style={previewStyle}>
        <div className="lg:col-span-2 space-y-6">
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Palette className="w-6 h-6" /> Editor de Layout da Loja</CardTitle>
                    <CardDescription>Personalize as cores e fontes da sua loja para combinar com a sua marca.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4"><Droplets className="w-5 h-5 text-primary" /> Cores Principais</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="primary-color">Cor Primária (HSL)</Label>
                                <Input id="primary-color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} />
                                <p className="text-xs text-muted-foreground">Ex: 48 96% 53%</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="background-color">Cor de Fundo (HSL)</Label>
                                <Input id="background-color" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} />
                                <p className="text-xs text-muted-foreground">Ex: 0 0% 98% (claro), 240 10% 3.9% (escuro)</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="accent-color">Cor de Destaque (HSL)</Label>
                                <Input id="accent-color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} />
                                 <p className="text-xs text-muted-foreground">Ex: 0 0% 90%</p>
                            </div>
                        </div>
                    </div>
                    <Separator />
                     <div>
                        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4"><Type className="w-5 h-5 text-primary" /> Fontes</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="headline-font">Fonte dos Títulos</Label>
                                <Input id="headline-font" value={headlineFont} onChange={(e) => setHeadlineFont(e.target.value)} />
                                <p className="text-xs text-muted-foreground">Ex: Oswald, Montserrat, Roboto</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="body-font">Fonte do Corpo</Label>
                                <Input id="body-font" value={bodyFont} onChange={(e) => setBodyFont(e.target.value)} />
                                <p className="text-xs text-muted-foreground">Ex: Inter, Lato, Open Sans</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <div className="flex justify-end">
                <Button onClick={handleSaveChanges}><Save className="mr-2" /> Salvar Alterações</Button>
            </div>
        </div>

        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Preview</h3>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline" style={{fontFamily: 'var(--font-oswald)'}}>Título de Exemplo</CardTitle>
                    <CardDescription style={{fontFamily: 'var(--font-inter)'}}>Esta é uma descrição de exemplo.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <p className="text-sm" style={{fontFamily: 'var(--font-inter)'}}>
                        Use os controles para ver as mudanças em tempo real. Este é um texto de corpo para exemplificar a fonte.
                    </p>
                    <Button style={{backgroundColor: 'hsl(var(--primary))', fontFamily: 'var(--font-inter)'}}>Botão Primário</Button>
                    <div className="p-4 rounded-md" style={{backgroundColor: 'hsl(var(--accent))'}}>
                        <p className="text-sm text-accent-foreground" style={{fontFamily: 'var(--font-inter)'}}>Este é um container de destaque (accent).</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  )
}
