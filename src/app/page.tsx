'use client';
import { useState, useTransition, useMemo } from 'react';
import type { CupModel, GeneratedArt, OrderDetails } from '@/lib/types';
import { Header } from '@/components/header';
import { CupSelector } from '@/components/cup-selector';
import { EventForm } from '@/components/event-form';
import { ArtGallery } from '@/components/art-gallery';
import { QuoteSummary } from '@/components/quote-summary';
import { CheckoutView } from '@/components/checkout-view';
import { Loader } from '@/components/loader';
import { useToast } from '@/hooks/use-toast';
import { handleArtAnalysis } from './actions';
import { ArtMethodSelector } from '@/components/art-method-selector';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2 } from 'lucide-react';

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

  const highestStepCompleted = useMemo(() => {
    if (finalOrder) return 5;
    if (artComplexity) return 4;
    if (generatedArt) return 3;
    if (artMethod) return 2;
    if (selectedCup) return 1;
    return 0;
  }, [selectedCup, artMethod, generatedArt, artComplexity, finalOrder]);

  const isStepCompleted = (stepNumber: number): boolean => {
    // A step is completed if you've done the step before it.
    // e.g., you can access step 2 if step 1 is completed.
    return highestStepCompleted >= stepNumber - 1;
  };
  
  const isStepDone = (stepNumber: number): boolean => {
    // A step is "done" if you've finished it and moved on.
    return highestStepCompleted >= stepNumber;
  }

  const handleCupSelect = (cup: CupModel) => {
    const isNewCup = selectedCup?.id !== cup.id;
    setSelectedCup(cup);
    if (isNewCup) {
      setArtMethod(null);
      setGeneratedArt(null);
      setArtComplexity(null);
      setFinalOrder(null);
    }
    setStep(2);
  };
  
  const handleArtMethodSelect = (method: 'ai' | 'upload' | 'draw' | 'plain') => {
    const isNewMethod = artMethod !== method;
    setArtMethod(method);

    if (isNewMethod) {
      setGeneratedArt(null);
      setArtComplexity(null);
      setFinalOrder(null);
    }

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

  const handleStepAccordionChange = (value: string) => {
    if (!value) return; // Accordion collapsed, do nothing
    
    const stepNumber = parseInt(value.replace('step-', ''), 10);
    if (isStepCompleted(stepNumber)) {
       setStep(stepNumber);
    }
  };

  const accordionSteps = [
    {
      step: 1,
      title: "Passo 1: Escolha o Modelo do Copo",
      content: <CupSelector onSelect={handleCupSelect} />
    },
    {
      step: 2,
      title: "Passo 2: Como você quer personalizar?",
      content: <ArtMethodSelector onSelect={handleArtMethodSelect} />
    },
    {
      step: 3,
      title: "Passo 3: Crie sua Arte",
      content: selectedCup && artMethod && artMethod !== 'plain' ? (
        <EventForm 
          cup={selectedCup} 
          onArtReady={handleArtReady} 
          artMethod={artMethod} 
          eventDescription={eventDescription}
          setEventDescription={setEventDescription}
        />
      ) : null,
      skip: artMethod === 'plain'
    },
    {
      step: 4,
      title: "Passo 4: Revise e Edite sua Arte",
      content: generatedArt && selectedCup ? (
        <ArtGallery 
          initialArt={generatedArt} 
          cup={selectedCup} 
          onSelectArt={handleSelectArt} 
          onRegenerate={handleRegenerate}
        />
      ) : null,
      skip: artMethod === 'plain'
    },
    {
      step: 5,
      title: "Passo 5: Orçamento e Compra",
      content: selectedCup && generatedArt && artComplexity ? (
        <QuoteSummary 
          initialDetails={{
            cupModel: selectedCup,
            art: generatedArt,
            eventDescription: eventDescription,
            artComplexity: artComplexity,
          }}
          onFinalize={handleFinalizeOrder}
        />
      ) : null
    }
  ];

  if (isAnalyzing) {
    return <Loader message="Analisando a complexidade da sua arte..." />;
  }

  if (step > TOTAL_STEPS) {
    return (
        <div className="flex flex-col min-h-screen bg-background">
          <Header />
          <main className="flex-1 container mx-auto py-8 px-4">
              {finalOrder && <CheckoutView orderDetails={finalOrder} onStartNewOrder={handleStartNewOrder} />}
          </main>
          <footer className="text-center py-4 text-sm text-muted-foreground border-t">
            Feito com ❤️ por CupVision AI
          </footer>
        </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4">
        <Accordion type="single" collapsible className="w-full space-y-4" value={`step-${step}`} onValueChange={handleStepAccordionChange}>
            {accordionSteps.map(item => {
                if (item.skip) return null;

                const canOpen = isStepCompleted(item.step);
                const isCurrent = step === item.step;
                const isDone = isStepDone(item.step);

                return (
                   <AccordionItem value={`step-${item.step}`} key={item.step} className="border-b-0 rounded-lg bg-card border shadow-sm data-[state=open]:border-primary data-[state=open]:ring-2 data-[state=open]:ring-primary/50">
                       <AccordionTrigger disabled={!canOpen} className="w-full text-left px-6 py-4 hover:no-underline disabled:opacity-70 disabled:cursor-not-allowed">
                           <div className="flex items-center gap-4">
                               {isDone && !isCurrent ? <CheckCircle2 className="h-6 w-6 text-green-500" /> : <div className={`flex items-center justify-center w-6 h-6 rounded-full font-bold text-lg shrink-0 transition-colors ${isCurrent ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>{item.step}</div>}
                               <span className="text-lg font-headline">{item.title}</span>
                           </div>
                       </AccordionTrigger>
                       <AccordionContent className="px-6 pb-6 pt-2">
                           {item.content}
                       </AccordionContent>
                   </AccordionItem>
                )
            })}
        </Accordion>
      </main>
      <footer className="text-center py-4 text-sm text-muted-foreground border-t">
        Feito com ❤️ por CupVision AI
      </footer>
    </div>
  );
}
