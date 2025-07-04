'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/header';
import { CUP_TYPES_SUMMARY } from '@/lib/cup-data';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <Header />
      <main className="flex-1 container mx-auto py-12 md:py-16">
        <section className="text-center mb-12">
            <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-wider uppercase">Escolha um Modelo</h1>
            <p className="mt-2 text-lg text-muted-foreground">Selecione um copo e dê vida à sua ideia com nosso editor IA.</p>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {CUP_TYPES_SUMMARY.map((type) => (
                <Card key={type.name} className="flex flex-col text-center transition-all duration-300 bg-card hover:shadow-xl hover:-translate-y-1">
                    <CardHeader>
                        <CardTitle className="font-sans text-xl h-12 flex items-center justify-center">{type.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col items-center justify-between gap-4">
                        <div className="relative w-40 h-40 text-foreground">
                            <Image src={type.imageUrl} alt={type.name} fill className="object-contain" data-ai-hint={type['data-ai-hint']} />
                        </div>
                        <div className='w-full'>
                            <p className="text-muted-foreground mb-4">
                                A partir de <span className="font-bold text-foreground">R$ {type.basePrice.toFixed(2).replace('.', ',')}</span>
                            </p>
                            <Button asChild size="lg" className="w-full">
                                <Link href={`/create?cup=${encodeURIComponent(type.name)}`}>Personalizar</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </section>
      </main>
      <footer className="border-t bg-card">
        <div className="container mx-auto py-6 text-center text-muted-foreground text-sm">
            <p>&copy; {new Date().getFullYear()} Copos Mania. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
