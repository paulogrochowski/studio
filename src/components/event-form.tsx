'use client';

import { useFormStatus } from 'react-dom';
import { handleArtGeneration, handleImageValidation } from '@/app/actions';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useEffect, useState, useRef, useActionState, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UploadCloud, Wand2 } from 'lucide-react';
import type { CupModel } from '@/lib/types';
import Image from 'next/image';
import { Input } from "@/components/ui/input";
import { DrawingCanvas } from './drawing-canvas';

interface EventFormProps {
  cup: CupModel;
  onArtReady: (imageUrl: string, prompt: string) => void;
  artMethod: 'ai' | 'upload' | 'draw';
  eventDescription: string;
  setEventDescription: (description: string) => void;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
      Gerar Arte com IA
    </Button>
  );
}

export function EventForm({ cup, onArtReady, artMethod, eventDescription, setEventDescription }: EventFormProps) {
  const { toast } = useToast();
  const [state, formAction] = useActionState(handleArtGeneration.bind(null, cup.name), null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isChecking, startCheckingTransition] = useTransition();

  useEffect(() => {
    if (state?.success === true) {
      onArtReady(state.imageUrl, eventDescription || 'Arte gerada por IA');
    } else if (state?.success === false) {
      toast({
        variant: "destructive",
        title: "Erro na Geração da Arte",
        description: state.error,
      });
    }
  }, [state, onArtReady, toast, eventDescription]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          variant: "destructive",
          title: "Arquivo muito grande",
          description: "Por favor, envie uma imagem com menos de 5MB.",
        });
        return;
      }
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        startCheckingTransition(async () => {
          const validationResult = await handleImageValidation(dataUrl);
          if (validationResult.success) {
            if (validationResult.isValid) {
              setPreviewUrl(dataUrl);
              toast({
                title: "Imagem Válida!",
                description: validationResult.reasoning,
              });
            } else {
              setPreviewUrl(null); // Clear preview if invalid
              setUploadedFile(null);
              toast({
                variant: "destructive",
                title: "Fundo de Imagem Inválido",
                description: `${validationResult.reasoning} Por favor, envie uma imagem com fundo branco ou transparente.`,
                duration: 8000,
              });
            }
          } else {
            toast({
              variant: "destructive",
              title: "Erro na Validação",
              description: validationResult.error,
            });
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUseUpload = () => {
    if (previewUrl) {
      onArtReady(previewUrl, "Arte enviada pelo usuário");
    }
  }

  const handleDrawingReady = (dataUrl: string) => {
    onArtReady(dataUrl, "Arte desenhada pelo usuário");
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  }

  const getTitleAndDescription = () => {
    switch (artMethod) {
      case 'ai':
        return {
          description: 'Seja detalhista para que a IA crie a melhor arte para você. Inclua temas, cores, nomes e frases.',
        };
      case 'upload':
        return {
          description: 'Carregue um arquivo de imagem (PNG, JPG) com fundo branco ou transparente.',
        };
      case 'draw':
        return {
          description: 'Use a tela de desenho para criar sua arte com total liberdade.',
        };
      default:
        return {
          description: 'Siga as instruções para a opção escolhida.',
        };
    }
  };
  
  const { description } = getTitleAndDescription();

  const renderContent = () => {
    switch(artMethod) {
      case 'ai':
        return (
          <form action={formAction} className="space-y-4">
            <div>
              <Label htmlFor="eventDescription" className="font-bold text-base">
                Descreva os detalhes para a arte
              </Label>
              <Textarea
                id="eventDescription"
                name="eventDescription"
                placeholder="Ex: Festa de 15 anos da Maria, tema galáxia com tons de roxo e prata. Escrever 'Maria 15 anos' e a data '25/12/2024'."
                rows={8}
                required
                className="mt-2"
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <SubmitButton />
            </div>
          </form>
        );
      case 'upload':
        return (
          <div className="flex flex-col items-center justify-center space-y-4 p-4 border-2 border-dashed rounded-lg text-center min-h-[300px]">
            <Input 
              id="fileUpload" 
              type="file" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/webp"
              disabled={isChecking}
            />
             {isChecking ? (
                <>
                  <Loader2 className="w-12 h-12 text-muted-foreground animate-spin" />
                  <h3 className="font-bold">Analisando o fundo da imagem...</h3>
                  <p className="text-sm text-muted-foreground">Aguarde, estamos checando se a imagem é válida.</p>
                </>
              ) : previewUrl ? (
              <div className="space-y-4 text-center">
                  <div className="relative w-48 h-48 mx-auto rounded-md overflow-hidden border">
                      <Image src={previewUrl} alt="Preview da arte enviada" fill className="object-contain p-2" />
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{uploadedFile?.name}</p>
                  <div className="flex gap-2 justify-center">
                      <Button onClick={handleUseUpload}>Usar esta imagem</Button>
                      <Button variant="outline" onClick={triggerFileInput}>Trocar</Button>
                  </div>
              </div>
            ) : (
              <>
                <UploadCloud className="w-12 h-12 text-muted-foreground" />
                <h3 className="font-bold">Arraste e solte ou clique para enviar</h3>
                <p className="text-sm text-muted-foreground">PNG, JPG, ou WEBP (máx 5MB).<br/><strong>O fundo deve ser branco ou transparente.</strong></p>
                <Button onClick={triggerFileInput}>Escolher Arquivo</Button>
              </>
            )}
          </div>
        );
      case 'draw':
        return <DrawingCanvas onDrawingReady={handleDrawingReady} />;
      default:
        return null;
    }
  }

  return (
    <Card className="bg-transparent border-none shadow-none">
      <CardHeader className="p-0 mb-4">
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="hidden md:flex flex-col items-center justify-center p-4 bg-secondary/30 rounded-lg">
                <h3 className="font-bold mb-2">{cup.name}</h3>
                <div className="relative w-40 h-40">
                  <Image src={cup.imageUrl} alt={cup.name} fill className="object-contain" />
                </div>
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  Você está personalizando o <br/><strong>{cup.name} {cup.colorName} {cup.opacityType}</strong>.
                </p>
            </div>
            <div className="space-y-4">
                {renderContent()}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
