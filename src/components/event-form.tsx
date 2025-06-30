'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { handleArtGeneration } from '@/app/actions';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useEffect, useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UploadCloud, Wand2 } from 'lucide-react';
import type { CupModel } from '@/lib/types';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

interface EventFormProps {
  cup: CupModel;
  onArtReady: (imageUrl: string, prompt: string) => void;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full md:w-auto">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
      Gerar Arte com IA
    </Button>
  );
}

export function EventForm({ cup, onArtReady }: EventFormProps) {
  const { toast } = useToast();
  const [state, formAction] = useFormState(handleArtGeneration.bind(null, cup.name), null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state?.success === true) {
      onArtReady(state.imageUrl, (document.getElementById('eventDescription') as HTMLTextAreaElement)?.value || '');
    } else if (state?.success === false) {
      toast({
        variant: "destructive",
        title: "Erro na Geração da Arte",
        description: state.error,
      });
    }
  }, [state, onArtReady, toast]);

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
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUseUpload = () => {
    if (previewUrl) {
      onArtReady(previewUrl, "Arte enviada pelo usuário");
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-3xl">2. Personalize seu Copo</CardTitle>
        <CardDescription>
          Você pode gerar uma arte com nossa IA ou enviar a sua própria imagem.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 flex flex-col items-center justify-center">
                <h3 className="font-bold mb-2">{cup.name}</h3>
                <div className="relative w-40 h-40">
                  <Image src={cup.imageUrl} alt={cup.name} fill className="object-contain" />
                </div>
                <p className="text-sm text-muted-foreground mt-2">Modelo selecionado</p>
            </div>
            <div className="md:col-span-2 space-y-4">
                <Tabs defaultValue="ai" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="ai"><Wand2 className="mr-2 h-4 w-4"/>Gerar com IA</TabsTrigger>
                    <TabsTrigger value="upload"><UploadCloud className="mr-2 h-4 w-4"/>Enviar minha Arte</TabsTrigger>
                  </TabsList>
                  <TabsContent value="ai" className="mt-4">
                     <form action={formAction} className="space-y-4">
                        <div>
                        <Label htmlFor="eventDescription" className="font-bold text-base">
                            Descreva os detalhes para a arte
                        </Label>
                        <Textarea
                            id="eventDescription"
                            name="eventDescription"
                            placeholder="Ex: Festa de 15 anos da Maria, tema galáxia com tons de roxo e prata. Escrever 'Maria 15 anos' e a data '25/12/2024'."
                            rows={6}
                            required
                            className="mt-2"
                        />
                        <p className="text-xs text-muted-foreground mt-2">Quanto mais detalhes, melhor o resultado. Inclua tema, cores, nomes, frases e data.</p>
                        </div>
                        <div className="flex justify-end">
                          <SubmitButton />
                        </div>
                    </form>
                  </TabsContent>
                  <TabsContent value="upload" className="mt-4">
                    <div className="flex flex-col items-center justify-center space-y-4 p-4 border-2 border-dashed rounded-lg text-center">
                      <Input 
                        id="fileUpload" 
                        type="file" 
                        className="hidden" 
                        ref={fileInputRef} 
                        onChange={handleFileChange}
                        accept="image/png, image/jpeg, image/webp"
                      />
                      {previewUrl ? (
                        <div className="space-y-4 text-center">
                            <div className="relative w-48 h-48 mx-auto rounded-md overflow-hidden border">
                                <Image src={previewUrl} alt="Preview da arte enviada" fill className="object-contain" />
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
                          <p className="text-sm text-muted-foreground">PNG, JPG, ou WEBP (máx 5MB)</p>
                          <Button onClick={triggerFileInput}>Escolher Arquivo</Button>
                        </>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
