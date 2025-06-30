'use client';
import { useState } from 'react';
import type { OrderDetails } from '@/lib/types';
import { Header } from '@/components/header';
import { CupSelector } from '@/components/cup-selector';
import { CheckoutView } from '@/components/checkout-view';
import { ArtGallery } from '@/components/art-gallery'; // This is now the Art Studio

export default function Home() {
  const [selectedCupType, setSelectedCupType] = useState<string | null>(null);
  const [finalOrder, setFinalOrder] = useState<OrderDetails | null>(null);

  const handleCupTypeSelect = (cupType: string) => {
    setSelectedCupType(cupType);
  };

  const handleFinalizeOrder = (details: OrderDetails) => {
    setFinalOrder(details);
  };

  const handleStartNewOrder = () => {
    setSelectedCupType(null);
    setFinalOrder(null);
  };
  
  const handleBackToSelection = () => {
    setSelectedCupType(null);
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4">
        {finalOrder ? (
          <CheckoutView orderDetails={finalOrder} onStartNewOrder={handleStartNewOrder} />
        ) : selectedCupType ? (
          <ArtGallery // This is the Art Studio now
            cupType={selectedCupType} 
            onFinalize={handleFinalizeOrder}
            onBack={handleBackToSelection}
          />
        ) : (
          <CupSelector onSelect={handleCupTypeSelect} />
        )}
      </main>
      <footer className="text-center py-4 text-sm text-muted-foreground border-t">
        Feito com ❤️ por CupVision AI
      </footer>
    </div>
  );
}
