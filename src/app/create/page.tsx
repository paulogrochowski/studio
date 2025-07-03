'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArtGallery } from '@/components/art-gallery';
import { Header } from '@/components/header';
import { Loader } from '@/components/loader';
import { CUP_TYPES_SUMMARY } from '@/lib/cup-data';
import React from 'react';

function CreatePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cupName = searchParams.get('cup');

  // Validate if cupName is a valid cup
  const isValidCup = cupName && CUP_TYPES_SUMMARY.some(c => c.name === cupName);

  React.useEffect(() => {
    if (!isValidCup) {
      router.replace('/');
    }
  }, [isValidCup, router]);

  if (!isValidCup) {
    return <div className="flex-1 flex items-center justify-center"><Loader message="Redirecionando..." /></div>;
  }

  return <ArtGallery selectedCupName={cupName} />;
}

export default function CreatePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        {/* Suspense is required by Next.js when using useSearchParams at the page level */}
        <Suspense fallback={<div className="flex-1 flex items-center justify-center"><Loader message="Carregando..." /></div>}>
          <CreatePageContent />
        </Suspense>
      </main>
    </div>
  );
}
