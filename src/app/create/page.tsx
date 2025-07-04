import { Suspense } from 'react';
import { Header } from '@/components/header';
import { Loader } from '@/components/loader';
import { CreatePageContent } from '@/components/create-page-content';

export default function CreatePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <Suspense fallback={<div className="flex-1 flex items-center justify-center"><Loader message="Carregando..." /></div>}>
          <CreatePageContent />
        </Suspense>
      </main>
    </div>
  );
}
