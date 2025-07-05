
'use client';

import dynamic from 'next/dynamic';
import type { CupModel, GeneratedArt } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader } from './loader';
import { Button } from './ui/button';
import { ChevronDown } from 'lucide-react';

interface PreviewCardProps {
    cupModel: CupModel;
    art: GeneratedArt | null;
    artScale?: number;
    artPositionY?: number;
    onScrollDown?: () => void;
    showScrollDownButton?: boolean;
}

// Dynamically import the 3D preview component with SSR turned off.
// Using an absolute path alias to prevent chunk loading errors.
const CupPreview3D = dynamic(() => import('@/components/cup-preview-3d'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center w-full h-full">
            <Loader message="Carregando Preview 3D..." />
        </div>
    )
});

export function PreviewCard({ cupModel, art, artScale = 0.6, artPositionY = 0.1, onScrollDown, showScrollDownButton = true }: PreviewCardProps) {
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
