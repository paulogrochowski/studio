'use client';

import { useState, useCallback, useTransition, type ReactNode } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Wand2, UploadCloud, Image as ImageIcon, Sparkles, Scissors, Palette, Undo2, Redo2, Download, Bot } from 'lucide-react';
import { handleGenerateImage, handleEditImage } from '@/app/actions';
import { Header } from '@/components/header';
import { Loader } from '@/components/loader';

type HistoryEntry = {
  imageUrl: string;
  prompt: string;
};

export default function ImageEditorPage() {
  const [image, setImage] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, startTransition] = useTransition();
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setImage(imageUrl);
        const newEntry = { imageUrl, prompt: 'Imagem Carregada' };
        setHistory([newEntry]);
        setHistoryIndex(0);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.webp'] },
    multiple: false,
  });

  const updateStateWithNewImage = (newImageUrl: string, promptUsed: string) => {
    setImage(newImageUrl);
    const newEntry = { imageUrl: newImageUrl, prompt: promptUsed };
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newEntry);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setPrompt('');
  };
  
  const handleGenerate = () => {
    if (!prompt) {
      toast({ variant: 'destructive', title: 'Prompt está vazio', description: 'Por favor, insira um prompt para gerar uma imagem.' });
      return;
    }
    startTransition(async () => {
      const result = await handleGenerateImage({ prompt });
      if (result.success && result.imageUrl) {
        updateStateWithNewImage(result.imageUrl, prompt);
        toast({ title: 'Imagem Gerada!', description: 'Sua nova imagem está pronta.' });
      } else {
        toast({ variant: 'destructive', title: 'Falha na Geração', description: result.error });
      }
    });
  };

  const handleEdit = (instruction: string) => {
    if (!image) {
      toast({ variant: 'destructive', title: 'Nenhuma imagem selecionada', description: 'Por favor, carregue ou gere uma imagem primeiro.' });
      return;
    }
    startTransition(async () => {
      const result = await handleEditImage({ baseImageDataUri: image, instruction });
      if (result.success && result.imageUrl) {
        updateStateWithNewImage(result.imageUrl, instruction);
        toast({ title: 'Imagem Editada!', description: `Aplicado: ${instruction}` });
      } else {
        toast({ variant: 'destructive', title: 'Falha na Edição', description: result.error });
      }
    });
  };

  const handleQuickEdit = (type: string) => {
    let instruction = '';
    switch (type) {
      case 'remove-bg': instruction = 'Remova o fundo, torne-o transparente.'; break;
      case 'upscale': instruction = 'Aumente a resolução da imagem para 2x, melhore os detalhes e a nitidez.'; break;
      case 'restore-faces': instruction = 'Restaure e melhore quaisquer rostos na imagem.'; break;
      default: return;
    }
    handleEdit(instruction);
  };

  const handleFilter = (filterName: string) => {
    const instruction = `Aplique um filtro de ${filterName} à imagem.`;
    handleEdit(instruction);
  };

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const undo = () => {
    if (canUndo) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setImage(history[newIndex].imageUrl);
    }
  };

  const redo = () => {
    if (canRedo) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setImage(history[newIndex].imageUrl);
    }
  };

  const filters = ['Preto e Branco', 'Sépia', 'Vintage', 'Cyberpunk', 'Estilo Cartoon', 'Pop Art'];

  const downloadImage = (dataUrl: string) => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `edited-image-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/20 dark:bg-zinc-900/50">
      <Header />
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 p-4">
        {/* Controls Panel */}
        <div className="lg:col-span-3 xl:col-span-3">
          <Card className="h-full flex flex-col">
            <CardContent className="p-2 sm:p-4 flex-1 flex flex-col">
              <Tabs defaultValue="generate" className="flex-1 flex flex-col">
                <TabsList className="grid w-full grid-cols-3">
                  <TabButton value="generate" icon={<Wand2 />}>Gerar</TabButton>
                  <TabButton value="upload" icon={<UploadCloud />}>Upload</TabButton>
                  <TabButton value="edit" disabled={!image} icon={<Sparkles />}>Editar</TabButton>
                </TabsList>
                
                <TabsContent value="generate" className="flex-1 flex flex-col gap-4 py-4">
                  <p className="text-sm text-muted-foreground px-1">Descreva a imagem que você quer criar.</p>
                  <Textarea placeholder="Ex: Um astronauta surfando em uma onda cósmica, arte digital." rows={5} value={prompt} onChange={(e) => setPrompt(e.target.value)} className="flex-1 text-base" />
                  <Button onClick={handleGenerate} disabled={isProcessing}>
                    <Wand2 />
                    Gerar Imagem
                  </Button>
                </TabsContent>

                <TabsContent value="upload" className="flex-1 flex flex-col justify-center py-4">
                   <div {...getRootProps()} className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed rounded-lg p-8 cursor-pointer hover:bg-muted transition-colors text-center">
                    <input {...getInputProps()} />
                    <UploadCloud className="w-12 h-12 text-muted-foreground" />
                    {isDragActive ? <p className="mt-2">Solte a imagem aqui...</p> : <p className="mt-2 text-sm text-muted-foreground">Arraste e solte ou clique para selecionar.</p>}
                  </div>
                </TabsContent>

                <TabsContent value="edit" className="flex-1 flex flex-col gap-4 py-4 overflow-y-auto">
                  <div className="space-y-4 px-1">
                    <div>
                      <h3 className="font-semibold mb-3 text-sm">Edições Rápidas com IA</h3>
                      <div className="grid grid-cols-1 gap-2">
                        <Button variant="outline" onClick={() => handleQuickEdit('remove-bg')} disabled={isProcessing}><Scissors/>Remover Fundo</Button>
                        <Button variant="outline" onClick={() => handleQuickEdit('upscale')} disabled={isProcessing}><Sparkles/>Melhorar Resolução</Button>
                        <Button variant="outline" onClick={() => handleQuickEdit('restore-faces')} disabled={isProcessing}><ImageIcon/>Restaurar Faces</Button>
                      </div>
                    </div>
                    <div>
                       <h3 className="font-semibold mb-3 text-sm">Filtros Artísticos</h3>
                       <div className="grid grid-cols-2 gap-2">
                        {filters.map(filter => (
                          <Button key={filter} variant="outline" size="sm" onClick={() => handleFilter(filter)} disabled={isProcessing}>
                            <Palette className="mr-2" />{filter}
                          </Button>
                        ))}
                       </div>
                    </div>
                    <div>
                       <h3 className="font-semibold mb-2 text-sm">Edição Manual com IA</h3>
                       <p className="text-xs text-muted-foreground mb-2">Descreva a mudança que você quer fazer na imagem atual.</p>
                       <Textarea placeholder="Ex: Mude a cor do céu para um pôr do sol." rows={3} value={prompt} onChange={(e) => setPrompt(e.target.value)} className="text-base" />
                       <Button onClick={() => handleEdit(prompt)} disabled={!prompt || isProcessing} className="w-full mt-2">
                         <Bot /> Aplicar Edição
                       </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Canvas/Preview Panel */}
        <div className="lg:col-span-9 xl:col-span-9 flex flex-col gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-muted-foreground">Histórico:</span>
            <Button variant="outline" size="icon" onClick={undo} disabled={!canUndo || isProcessing}><Undo2/></Button>
            <Button variant="outline" size="icon" onClick={redo} disabled={!canRedo || isProcessing}><Redo2/></Button>
            <div className="flex-1"></div>
            <Button onClick={() => image && downloadImage(image)} disabled={!image || isProcessing}>
              <Download className="mr-2"/>Baixar Imagem
            </Button>
          </div>
          <Card className="flex-1 flex items-center justify-center p-2 sm:p-4 bg-white dark:bg-zinc-800/50 checkerboard">
            <div className="w-full h-full relative flex items-center justify-center">
              {isProcessing ? (
                <Loader message="Processando sua imagem com IA..." />
              ) : image ? (
                <div className="relative w-full h-full max-w-full max-h-[75vh] aspect-auto">
                  <Image src={image} alt="Imagem editada" layout="fill" objectFit="contain" />
                </div>
              ) : (
                <div className="text-center text-muted-foreground p-8">
                  <ImageIcon className="mx-auto h-24 w-24" />
                  <p className="mt-4 font-medium">Sua imagem aparecerá aqui</p>
                  <p className="text-sm">Gere uma imagem com IA ou faça o upload para começar.</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

const TabButton = ({ value, children, icon, disabled }: { value: string, children: ReactNode, icon: ReactNode, disabled?: boolean }) => (
  <TabsTrigger value={value} disabled={disabled} className="flex-1 flex items-center gap-2 data-[state=active]:shadow-md">
    {icon}
    <span className="hidden sm:inline">{children}</span>
  </TabsTrigger>
);
