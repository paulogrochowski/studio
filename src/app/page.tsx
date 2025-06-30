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
import { ArtMethodSelector } from '@/components/art-method-selector';

const TOTAL_STEPS = 5;

// A 1x1 transparent pixel
const PLAIN_ART_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

export default function Home() {
  const [step, setStep] = useState(1);
  const [isAnalyzing, startAnalysisTransition] = useTransition();
  const { toast } = useToast();

  const [selectedCup, setSelectedCup] = useState<CupModel | null>(null);
  const [artMethod, setArtMethod] = useState<'ai' | 'upload' | 'draw' | 'plain' | null>(null);
  const [eventDescription, setEventDescription] = useState<string>('');
  const [generatedArt, setGeneratedArt] = useState<GeneratedArt | null>(null);
  const [finalOrder, setFinalOrder] = useState<OrderDetails | null>(null);
  const [artComplexity, setArtComplexity] = useState<{ score: number, reasoning: string } | null>(null);

  const isStepCompleted = (stepNumber: number): boolean => {
    if (stepNumber <= 0) return true; // Step 0 is always "completed" to allow navigation to step 1
    switch (stepNumber) {
      case 1:
        return !!selectedCup;
      case 2:
        return !!artMethod;
      case 3:
        return !!generatedArt;
      case 4:
        return !!artComplexity;
      case 5:
        return !!finalOrder;
      default:
        return false;
    }
  };

  const handleCupSelect = (cup: CupModel) => {
    // If the user selects a different cup, invalidate the subsequent steps' state.
    if (selectedCup?.id !== cup.id) {
      setArtMethod(null);
      setEventDescription('');
      setGeneratedArt(null);
      setArtComplexity(null);
      setFinalOrder(null);
    }
    setSelectedCup(cup);
    setStep(2);
  };

  const handleArtMethodSelect = (method: 'ai' | 'upload' | 'draw' | 'plain') => {
    setArtMethod(method);
    // Reset subsequent steps when method changes
    setGeneratedArt(null);
    setArtComplexity(null);
    setFinalOrder(null);

    if (method === 'plain') {
      const plainArt: GeneratedArt = { id: 'plain-art', imageUrl: PLAIN_ART_IMAGE, prompt: 'Copo Liso' };
      const plainComplexity = { score: 0, reasoning: 'Nenhuma arte aplicada.' };
      
      setGeneratedArt(plainArt);
      setEventDescription('Copo Liso');
      setArtComplexity(plainComplexity);
      setStep(5);
    } else {
      setStep(3);
    }
  };

  const handleArtReady = (imageUrl: string, prompt: string) => {
    // When new art is ready, invalidate the steps that depend on it.
    setGeneratedArt({ id: `art-${Date.now()}`, imageUrl, prompt });
    setEventDescription(prompt);
    setArtComplexity(null);
    setFinalOrder(null);
    setStep(4);
  };

  const handleRegenerate = () => {
    setGeneratedArt(null);
    setArtComplexity(null);
    setFinalOrder(null);
    setStep(3);
  };
  
  const handleSelectArt = (art: GeneratedArt) => {
    startAnalysisTransition(async () => {
      setGeneratedArt(art);
      const result = await handleArtAnalysis(art.imageUrl, eventDescription);
      if (result.success) {
        setArtComplexity({ score: result.complexityScore, reasoning: result.reasoning });
        setStep(5);
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
    setStep(6); // Checkout view
  }

  const handleStartNewOrder = () => {
    setStep(1);
    setSelectedCup(null);
    setArtMethod(null);
    setEventDescription('');
    setGeneratedArt(null);
    setArtComplexity(null);
    setFinalOrder(null);
  }

  const handleGoBack = () => {
    if (step > 1) {
      setStep(prev => (prev > 1 ? prev - 1 : 1));
    }
  };

  const handleStepClick = (stepNumber: number) => {
    // Only allow navigating to a step if the previous one has been completed.
    if (isStepCompleted(stepNumber - 1)) {
      if (artMethod === 'plain' && (stepNumber === 3 || stepNumber === 4)) {
        // If user has a plain cup and tries to go to art steps, redirect them to method selection
        setStep(2);
      } else {
        setStep(stepNumber);
      }
    }
  };

  const renderStep = () => {
    if(isAnalyzing) {
      return <Loader message="Analisando a complexidade da sua arte..." />
    }

    switch (step) {
      case 1:
        return <CupSelector onSelect={handleCupSelect} />;
      case 2:
        return <ArtMethodSelector onSelect={handleArtMethodSelect} onGoBack={handleGoBack} />;
      case 3:
        if (!selectedCup || !artMethod || artMethod === 'plain') return null; // Should not happen
        return <EventForm cup={selectedCup} onArtReady={handleArtReady} onGoBack={handleGoBack} artMethod={artMethod} />;
      case 4:
        if (!generatedArt || !selectedCup || artMethod === 'plain') return null; // Should not happen
        return <ArtGallery initialArt={generatedArt} cup={selectedCup} onSelectArt={handleSelectArt} onRegenerate={handleRegenerate} onGoBack={handleGoBack} />;
      case 5:
        if (!selectedCup || !generatedArt || !artComplexity) return null; // Should not happen
        return <QuoteSummary 
          initialDetails={{
            cupModel: selectedCup,
            art: generatedArt,
            eventDescription: eventDescription,
            artComplexity: artComplexity,
          }}
          onFinalize={handleFinalizeOrder}
          onGoBack={handleGoBack}
        />;
      case 6:
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
        {step <= TOTAL_STEPS && <StepsIndicator currentStep={step} totalSteps={TOTAL_STEPS} onStepClick={handleStepClick} isStepCompleted={isStepCompleted} />}
        {renderStep()}
      </main>
      <footer className="text-center py-4 text-sm text-muted-foreground border-t">
        Feito com ❤️ por CupVision AI
      </footer>
    </div>
  );
}
