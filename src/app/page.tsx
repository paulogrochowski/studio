'use client';

import { useState } from 'react';
import { CupSelector } from '@/components/cup-selector';
import { ArtGallery } from '@/components/art-gallery';
import { Header } from '@/components/header';

export default function Home() {
  const [selectedCup, setSelectedCup] = useState<string | null>(null);

  const handleCupSelect = (cupType: string) => {
    setSelectedCup(cupType);
  };

  const handleBack = () => {
    setSelectedCup(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4">
        {!selectedCup ? (
          <CupSelector onSelect={handleCupSelect} />
        ) : (
          <ArtGallery selectedCupName={selectedCup} onBackToSelector={handleBack} />
        )}
      </main>
      <footer className="text-center py-4 text-sm text-muted-foreground border-t">
        Crie copos personalizados com a ajuda da IA.
      </footer>
    </div>
  );
}
