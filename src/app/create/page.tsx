import { Header } from '@/components/header';
import { ArtGallery } from '@/components/art-gallery';
import { CUP_TYPES_SUMMARY } from '@/lib/cup-data';
import { redirect } from 'next/navigation';

export default function CreatePage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const cupName = searchParams?.cup;

  // Validação do modelo do copo no lado do servidor.
  // Se for inválido, redireciona para a página inicial antes de renderizar no cliente.
  const isValidCup = typeof cupName === 'string' && CUP_TYPES_SUMMARY.some(c => c.name === cupName);

  if (!isValidCup) {
    redirect('/');
  }

  // Neste ponto, cupName é garantidamente uma string válida.
  const validCupName = cupName as string;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <ArtGallery selectedCupName={validCupName} />
      </main>
    </div>
  );
}
