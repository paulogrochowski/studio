
'use client';

import Image from 'next/image';
import type { CupModel, GeneratedArt } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DEGRADE_HEX_COLORS, RIM_COLORS } from '@/lib/cup-data';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

interface PreviewCardProps {
    cupModel: CupModel;
    art: GeneratedArt | null;
}

export function PreviewCard({ cupModel: cup, art }: PreviewCardProps) {
    const degradeColorHex = cup.degradeColor ? DEGRADE_HEX_COLORS[cup.degradeColor] : null;
    const rimColorHex = RIM_COLORS[cup.rimColor!] || 'transparent';

    const overlayStyle: React.CSSProperties = {
        WebkitMaskImage: `url(${cup.svgMaskUrl})`,
        maskImage: `url(${cup.svgMaskUrl})`,
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
    };

    if (degradeColorHex && cup.degradePosition && cup.degradePosition !== 'Nenhum') {
        const direction = cup.degradePosition === 'Cima' ? 'to bottom' : 'to top';
        const baseColor = cup.opacityType === 'Transparente' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)';
        overlayStyle.background = `linear-gradient(${direction}, ${degradeColorHex}, ${baseColor})`;
    } else {
        overlayStyle.backgroundColor = cup.colorHex;
        overlayStyle.opacity = cup.opacityType === 'Transparente' ? 0.6 : 1.0;
    }

    return (
        <Card className="overflow-hidden">
            <CardHeader>
                <CardTitle>Pré-visualização do Copo</CardTitle>
                <CardDescription>Veja como seu copo ficará com a arte e as personalizações.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-4 h-[400px] md:h-[500px]">
                 <div className="relative w-full max-w-[300px] h-full">
                    {/* Base Cup Image */}
                    <Image
                        src={cup.imageUrl}
                        alt={cup.name}
                        fill
                        className="object-contain"
                        priority
                    />

                    {/* Color/Gradient Overlay */}
                    <div
                        className="absolute inset-0 mix-blend-multiply"
                        style={overlayStyle}
                    />

                    {/* Rim Overlay */}
                    {cup.rimColor !== 'Nenhuma' && (
                        <div
                            className="absolute inset-0"
                            style={{
                                WebkitMaskImage: `url(${cup.svgMaskUrl})`,
                                maskImage: `url(${cup.svgMaskUrl})`,
                                WebkitMaskSize: 'contain',
                                maskSize: 'contain',
                                WebkitMaskRepeat: 'no-repeat',
                                maskRepeat: 'no-repeat',
                                WebkitMaskPosition: 'center',
                                maskPosition: 'center',
                                borderTop: `5px solid ${rimColorHex}`,
                            }}
                        />
                    )}

                    {/* Art Decal */}
                    {art ? (
                         <div
                            className="absolute inset-0 flex items-center justify-center"
                            style={{
                                WebkitMaskImage: `url(${cup.svgMaskUrl})`,
                                maskImage: `url(${cup.svgMaskUrl})`,
                                WebkitMaskSize: 'contain',
                                maskSize: 'contain',
                                WebkitMaskRepeat: 'no-repeat',
                                maskRepeat: 'no-repeat',
                                WebkitMaskPosition: 'center',
                                maskPosition: 'center',
                            }}
                        >
                            <div className={cn(
                                "relative w-[80%] h-[40%]",
                                "flex items-center justify-center checkerboard rounded-md"
                            )}>
                                <Image
                                    src={art.imageUrl}
                                    alt="Arte personalizada"
                                    fill
                                    className="object-contain p-2"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="flex flex-col items-center gap-2 text-center text-muted-foreground bg-black/20 p-4 rounded-lg">
                                <Sparkles className="w-8 h-8"/>
                                <p className="text-xs font-semibold">Sua arte aparecerá aqui</p>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
