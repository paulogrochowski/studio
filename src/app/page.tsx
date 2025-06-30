'use client';

import { useState } from 'react';
import { CupSelector } from '@/components/cup-selector';
import { ArtGallery } from '@/components/art-gallery';
import { Header } from '@/components/header';
import { Icons } from '@/components/icons';
import { ThemeToggle } from '@/components/theme-toggle';

export default function HomePage() {
  const [view, setView] = useState<'selector' | 'gallery'>('selector');
  const [selectedCup, setSelectedCup] = useState<string | null>(null);

  const handleCupSelect = (cupName: string) => {
    setSelectedCup(cupName);
    setView('gallery');
  };

  const handleBackToSelector = () => {
    setSelectedCup(null);
    setView('selector');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
       <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-10">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <Icons.cup className="h-8 w-8 text-primary" />
              <h1 className="font-headline text-xl sm:text-2xl font-bold tracking-tight text-primary">
                CupVision AI
              </h1>
            </div>
             <ThemeToggle />
          </div>
        </header>
      <main className="flex-1 container mx-auto p-4 md:p-8">
        {view === 'selector' && <CupSelector onSelect={handleCupSelect} />}
        {view === 'gallery' && selectedCup && (
          <ArtGallery selectedCupName={selectedCup} onBackToSelector={handleBackToSelector} />
        )}
      </main>
    </div>
  );
}
