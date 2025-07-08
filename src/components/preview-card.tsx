
'use client';

import dynamic from 'next/dynamic';
import type { CupModel, GeneratedArt, ArtTransformations } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader } from './loader';
import { Button } from './ui/button';
import { ChevronDown, Download } from 'lucide-react';
import { Label } from './ui/label';
import { Slider } from './ui/slider';


interface PreviewCardProps {
    cupModel: CupModel;
    art: GeneratedArt | null;
    artTransformations: ArtTransformations;
    setArtTransformations: (transformations: ArtTransformations) => void;
    onScrollDown?: () => void;
    showScrollDownButton?: boolean;
    handleSaveArt: () => void;
    isGenerating: boolean;
}

// Dynamically import the 3D preview component with SSR turned off.
// Using an alias path for robust chunk loading.
const CupPreview3D = dynamic(() => import('@/components/cup-preview-3d'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center w-full h-full">
            <Loader message="Carregando Preview 3D..." />
        </div>
    )
});

export function PreviewCard({ 
    cupModel, 
    art, 
    artTransformations,
    setArtTransformations,
    onScrollDown, 
    showScrollDownButton = true,
    handleSaveArt,
    isGenerating
}: PreviewCardProps) {
    
    const handleTransformChange = (key: keyof ArtTransformations, value: any) => {
        setArtTransformations({ ...artTransformations, [key]: value });
    };

    const handleScaleChange = (dim: 'x' | 'y', value: number) => {
        const newScale = [...artTransformations.scale];
        newScale[dim === 'x' ? 0 : 1] = value;
        handleTransformChange('scale', newScale);
    }

    const handlePositionChange = (dim: 'x' | 'y', value: number) => {
        const newPosition = [...artTransformations.position];
        newPosition[dim === 'x' ? 0 : 1] = value;
        handleTransformChange('position', newPosition);
    }
    
    return (
        <div className="relative">
            <Card className="overflow-hidden">
                <CardHeader>
                    <CardTitle>Pré-visualização do Copo</CardTitle>
                    <CardDescription>Interaja com o modelo 3D para ver todos os ângulos.</CardDescription>
                </CardHeader>
                <CardContent className="p-0 h-[400px] md:h-[500px] checkerboard">
                    <CupPreview3D 
                        cupModel={cupModel} 
                        art={art} 
                        artTransformations={artTransformations} 
                    />
                </CardContent>
                 {art && (
                    <CardFooter className="flex-col items-start gap-4 p-4 pt-4 border-t">
                        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="art-width">Largura da Arte</Label>
                                <Slider id="art-width" value={[artTransformations.scale[0]]} onValueChange={(v) => handleScaleChange('x', v[0])} min={0.1} max={2} step={0.05} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="art-height">Altura da Arte</Label>
                                <Slider id="art-height" value={[artTransformations.scale[1]]} onValueChange={(v) => handleScaleChange('y', v[0])} min={0.1} max={2} step={0.05} />
                            </div>
                        </div>
                         <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="w-full space-y-2">
                                <Label htmlFor="art-pos-x">Posição Horizontal</Label>
                                <Slider id="art-pos-x" value={[artTransformations.position[0]]} onValueChange={(v) => handlePositionChange('x', v[0])} min={-0.5} max={0.5} step={0.01} />
                            </div>
                            <div className="w-full space-y-2">
                                 <Label htmlFor="art-pos-y">Posição Vertical</Label>
                                <Slider id="art-pos-y" value={[artTransformations.position[1]]} onValueChange={(v) => handlePositionChange('y', v[0])} min={-0.5} max={0.5} step={0.01} />
                            </div>
                        </div>
                        <div className="w-full space-y-2">
                            <Label htmlFor="art-rotation">Rotação</Label>
                            <Slider id="art-rotation" value={[artTransformations.rotation]} onValueChange={(v) => handleTransformChange('rotation', v[0])} min={-180} max={180} step={1} />
                        </div>
                        <div className="w-full pt-2">
                            <Button variant="outline" className="w-full" onClick={handleSaveArt} disabled={isGenerating || !art?.imageUrl || art.imageUrl.startsWith('data:image/gif')}>
                                <Download className="mr-2 h-4 w-4" />
                                Salvar Arte
                            </Button>
                        </div>
                    </CardFooter>
                )}
            </Card>
            {showScrollDownButton && onScrollDown && (
                <Button
                    variant="secondary"
                    size="icon"
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 rounded-full h-12 w-12 shadow-lg animate-bounce"
                    onClick={onScrollDown}
                    aria-label="Rolar para baixo"
                >
                    <ChevronDown className="h-8 w-8" />
                </Button>
            )}
        </div>
    );
}
