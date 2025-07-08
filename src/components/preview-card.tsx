
'use client';

import dynamic from 'next/dynamic';
import type { CupModel, GeneratedArt } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader } from './loader';
import { Button } from './ui/button';
import { ChevronDown, Download } from 'lucide-react';
import { Label } from './ui/label';
import { Slider } from './ui/slider';


interface PreviewCardProps {
    cupModel: CupModel;
    art: GeneratedArt | null;
    artScale: number;
    setArtScale: (value: number) => void;
    artPositionY: number;
    setArtPositionY: (value: number) => void;
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
    artScale, 
    setArtScale, 
    artPositionY, 
    setArtPositionY, 
    onScrollDown, 
    showScrollDownButton = true,
    handleSaveArt,
    isGenerating
}: PreviewCardProps) {
    return (
        <div className="relative">
            <Card className="overflow-hidden">
                <CardHeader>
                    <CardTitle>Pré-visualização do Copo</CardTitle>
                    <CardDescription>Interaja com o modelo 3D para ver todos os ângulos.</CardDescription>
                </CardHeader>
                <CardContent className="p-0 h-[400px] md:h-[500px]">
                    <CupPreview3D cupModel={cupModel} art={art} artScale={artScale} artPositionY={artPositionY} />
                </CardContent>
                 {art && (
                    <CardFooter className="flex-col items-start gap-4 p-4 pt-4 border-t">
                        <div className="w-full space-y-2">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="art-size">Tamanho da Arte</Label>
                                <span className="text-sm font-medium text-muted-foreground">{(artScale / 0.6 * 100).toFixed(0)}%</span>
                            </div>
                            <Slider id="art-size" value={[artScale]} onValueChange={(v) => setArtScale(v[0])} min={0.2} max={1.2} step={0.02} />
                        </div>
                        <div className="w-full space-y-2">
                             <div className="flex justify-between items-center">
                                <Label htmlFor="art-position">Posição Vertical</Label>
                                <span className="text-sm font-medium text-muted-foreground">{(artPositionY * 100).toFixed(0)}</span>
                            </div>
                            <Slider id="art-position" value={[artPositionY]} onValueChange={(v) => setArtPositionY(v[0])} min={-0.3} max={0.5} step={0.01} />
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

    
