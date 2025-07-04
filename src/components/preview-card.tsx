
'use client';

import dynamic from 'next/dynamic';
import type { CupModel, GeneratedArt } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader } from './loader';

interface PreviewCardProps {
    cupModel: CupModel;
    art: GeneratedArt | null;
    artScale: number;
    artPositionY: number;
}

// Dynamically import the 3D preview component with SSR turned off.
// This is the key to preventing server-side rendering errors.
const CupPreview3D = dynamic(() => import('./cup-preview-3d'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center w-full h-full">
            <Loader message="Carregando Preview 3D..." />
        </div>
    )
});

export function PreviewCard({ cupModel, art, artScale, artPositionY }: PreviewCardProps) {
    return (
        <Card className="overflow-hidden">
            <CardHeader>
                <CardTitle>Pré-visualização do Copo</CardTitle>
                <CardDescription>Interaja com o modelo 3D para ver todos os ângulos.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 h-[400px] md:h-[500px]">
                 <CupPreview3D cupModel={cupModel} art={art} artScale={artScale} artPositionY={artPositionY} />
            </CardContent>
        </Card>
    );
}
