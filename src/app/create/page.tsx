'use client';

import { useState } from 'react';
import { CupSelector } from '@/components/cup-selector';
import { ArtGallery } from '@/components/art-gallery';
import { Header } from '@/components/header';

export default function CreatePage() {
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
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        {view === 'selector' && <CupSelector onSelect={handleCupSelect} />}
        {view === 'gallery' && selectedCup && (
          <ArtGallery selectedCupName={selectedCup} onBackToSelector={handleBackToSelector} />
        )}
      </main>
    </div>
  );
}
