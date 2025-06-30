'use client';
import { useState, useTransition } from 'react';
import type { CupModel, GeneratedArt, OrderDetails } from '@/lib/types';
import { Header } from '@/components/header';
import { StepsIndicator } from '@/components/steps-indicator';
import { CupSelector } from '@/components/cup-selector';
import { EventForm } from '@/components/event-form';
import { ArtGallery } from '@/components/art-gallery';
import { QuoteSummary } from '@/components/quote-summary';
import { CheckoutView } from '@/components/checkout-view';
import { Loader } from '@/components/loader';
import { useToast } from '@/hooks/use-toast';
import { handleArtAnalysis } from './actions';

const TOTAL_STEPS = 4;

export default function Home() {
  const [step, setStep] = useState(1);
  const [isGenerating, startGenerationTransition] = useTransition();
  const [isAnalyzing, startAnalysisTransition] = useTransition();
  const { toast } = useToast();

  const [selectedCup, setSelectedCup] = useState<CupModel | null>(null);
  const [eventDescription, setEventDescription] = useState<string>('');
  const [generatedArt, setGeneratedArt] = useState<GeneratedArt | null>(null);
  const [finalOrder, setFinalOrder] = useState<OrderDetails | null>(null);
  const [artComplexity, setArtComplexity] = useState<{ score: number, reasoning: string } | null>(null);

  const handleCupSelect = (cup: CupModel) => {
    setSelectedCup(cup);
    setStep(2);
  };

  const handleArtGenerated = (imageUrl: string, prompt: string) => {
    setGeneratedArt({ imageUrl, prompt });
    setEventDescription(prompt);
    setStep(3);
  };

  const handleRegenerate = () => {
    setGeneratedArt(null);
    setStep(2);
  };
  
  const handleSelectArt = (art: GeneratedArt) => {
    startAnalysisTransition(async () => {
      setGeneratedArt(art);
      const result = await handleArtAnalysis(art.imageUrl, eventDescription);
      if (result.success) {
        setArtComplexity({ score: result.complexityScore, reasoning: result.reasoning });
        setStep(4);
      } else {
        toast({
          variant: "destructive",
          title: "Erro na Análise",
          description: result.error,
        });
      }
    });
  };

  const handleFinalizeOrder = (details: OrderDetails) => {
    setFinalOrder(details);
    setStep(5); // Checkout view
  }

  const handleStartNewOrder = () => {
    setStep(1);
    setSelectedCup(null);
    setEventDescription('');
    setGeneratedArt(null);
    setArtComplexity(null);
    setFinalOrder(null);
  }

  const renderStep = () => {
    if(isAnalyzing) {
      return <Loader message="Analisando a complexidade da sua arte..." />
    }

    switch (step) {
      case 1:
        return <CupSelector onSelect={handleCupSelect} />;
      case 2:
        if (!selectedCup) return null; // Should not happen
        return <EventForm cup={selectedCup} onArtGenerated={handleArtGenerated} />;
      case 3:
        if (!generatedArt || !selectedCup) return null; // Should not happen
        return <ArtGallery initialArt={generatedArt} cup={selectedCup} onSelectArt={handleSelectArt} onRegenerate={handleRegenerate} />;
      case 4:
        if (!selectedCup || !generatedArt || !artComplexity) return null; // Should not happen
        return <QuoteSummary 
          initialDetails={{
            cupModel: selectedCup,
            art: generatedArt,
            eventDescription: eventDescription,
            artComplexity: artComplexity,
          }}
          onFinalize={handleFinalizeOrder}
        />;
      case 5:
        if (!finalOrder) return null;
        return <CheckoutView orderDetails={finalOrder} onStartNewOrder={handleStartNewOrder} />;
      default:
        return <CupSelector onSelect={handleCupSelect} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4">
        {step <= TOTAL_STEPS && <StepsIndicator currentStep={step} totalSteps={TOTAL_STEPS} />}
        {renderStep()}
      </main>
      <footer className="text-center py-4 text-sm text-muted-foreground border-t">
        Feito com ❤️ por CupVision AI
      </footer>
    </div>
  );
}
