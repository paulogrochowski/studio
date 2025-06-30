'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { handleArtGeneration } from '@/app/actions';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { CupModel } from '@/lib/types';
import Image from 'next/image';

interface EventFormProps {
  cup: CupModel;
  onArtGenerated: (imageUrl: string, prompt: string) => void;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full md:w-auto">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Gerar Arte com IA
    </Button>
  );
}

export function EventForm({ cup, onArtGenerated }: EventFormProps) {
  const { toast } = useToast();
  const [state, formAction] = useFormState(handleArtGeneration.bind(null, cup.name), null);

  useEffect(() => {
    if (state?.success === true) {
      onArtGenerated(state.imageUrl, (document.getElementById('eventDescription') as HTMLTextAreaElement)?.value || '');
    } else if (state?.success === false) {
      toast({
        variant: "destructive",
        title: "Erro na Geração da Arte",
        description: state.error,
      });
    }
  }, [state, onArtGenerated, toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-3xl">2. Descreva seu Evento</CardTitle>
        <CardDescription>
          Quanto mais detalhes você fornecer, melhor será o resultado da IA. Inclua tema, cores, nomes, frases e a data do evento.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 flex flex-col items-center">
            <h3 className="font-bold mb-2">{cup.name}</h3>
            <div className="relative w-40 h-40">
              <Image src={cup.imageUrl} alt={cup.name} fill className="object-contain" />
            </div>
            <p className="text-sm text-muted-foreground mt-2">Modelo selecionado</p>
          </div>
          <div className="md:col-span-2 space-y-4">
            <div>
              <Label htmlFor="eventDescription" className="font-bold text-base">
                Detalhes para a arte do copo
              </Label>
              <Textarea
                id="eventDescription"
                name="eventDescription"
                placeholder="Ex: Festa de 15 anos da Maria, tema galáxia com tons de roxo e prata. Escrever 'Maria 15 anos' e a data '25/12/2024'."
                rows={6}
                required
                className="mt-2"
              />
            </div>
            <div className="flex justify-end">
              <SubmitButton />
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
