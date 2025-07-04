'use client';

import dynamic from 'next/dynamic';
import type { CupModel, GeneratedArt } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader } from './loader';

// Dynamically import the 3D preview component, ensuring it only runs on the client.
const CupPreview3D = dynamic(() => import('@/components/cup-preview-3d'), {
    ssr: false, // This is crucial.
    loading: () => <Loader message="Carregando Preview 3D..." />,
});

interface PreviewCardProps {
    cupModel: CupModel;
    art: GeneratedArt | null;
}

export function PreviewCard({ cupModel, art }: PreviewCardProps) {
    return (
        <Card className="overflow-hidden">
            <CardHeader>
                <CardTitle>Pré-visualização 3D</CardTitle>
                <CardDescription>Interaja com o modelo. Gire para ver todos os ângulos.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-0 h-[400px] md:h-[500px]">
                <CupPreview3D cupModel={cupModel} art={art} />
            </CardContent>
        </Card>
    );
}
