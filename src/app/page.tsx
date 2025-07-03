'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Header } from '@/components/header';
import { ArrowRight } from 'lucide-react';

const LONG_DRINK_SVG = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2MCAxMjAiPjxwYXRoIGQ9Ik01LDAgSDU1IEw1MCwxMjAgSDEwIFoiIGZpbGw9ImN1cnJlbnRDb2xvciIvPjwvc3ZnPg==';
const TWISTER_SVG = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA3MCAxNDAiPjxwYXRoIGQ9Ik0wIDEwaDcwdjE1SDB6TTEwIDMwaDUwbC01IDEwMEgxNXpNMzIgMGg2djEwaC02eiIgZmlsbD0iY3VycmVudENvbG9yIi8+PC9zdmc+';
const CALDERETA_SVG = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4MCAxMDAiPjxwYXRoIGQ9Ik01LDAgSDc1IEw2NSwxMDAgSDE1IFoiIGZpbGw9ImN1cnJlbnRDb2xvciIvPjwvc3ZnPg==';

const cupTypes = [
  { name: 'Copo Long Drink', imageUrl: LONG_DRINK_SVG, 'data-ai-hint': 'white cup' },
  { name: 'Copo Twister com Tampa', imageUrl: TWISTER_SVG, 'data-ai-hint': 'clear cup' },
  { name: 'Copo Caldereta', imageUrl: CALDERETA_SVG, 'data-ai-hint': 'black cup' },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full h-[50vh] md:h-[60vh] flex items-center justify-center text-center bg-secondary/30">
           <Carousel className="absolute inset-0 w-full h-full" opts={{ loop: true, align: "start" }} plugins={[
                // Autoplay({
                //     delay: 5000,
                // }),
            ]}>
              <CarouselContent className="-ml-0">
                <CarouselItem className="pl-0 relative">
                    <Image src="https://placehold.co/1200x600.png" alt="Banner de Festa" fill className="object-cover opacity-20" data-ai-hint="party event" />
                </CarouselItem>
                <CarouselItem className="pl-0 relative">
                    <Image src="https://placehold.co/1200x600.png" alt="Banner de Casamento" fill className="object-cover opacity-20" data-ai-hint="wedding celebration" />
                </CarouselItem>
                <CarouselItem className="pl-0 relative">
                    <Image src="https://placehold.co/1200x600.png" alt="Banner Corporativo" fill className="object-cover opacity-20" data-ai-hint="corporate conference" />
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious className="absolute left-4 hidden sm:inline-flex" />
              <CarouselNext className="absolute right-4 hidden sm:inline-flex" />
            </Carousel>
            <div className="relative z-10 container mx-auto px-4">
                 <h1 className="font-headline text-4xl md:text-6xl font-bold text-primary tracking-tight">Dê Vida à sua Ideia</h1>
                 <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">Crie designs exclusivos para copos personalizados com o poder da inteligência artificial.</p>
                 <Button asChild size="lg" className="mt-8">
                     <Link href="/create">
                         Personalize seu Copo Agora
                         <ArrowRight className="ml-2" />
                     </Link>
                 </Button>
            </div>
        </section>

        {/* Product Showcase Section */}
        <section className="container mx-auto py-16 md:py-24">
            <h2 className="text-3xl font-bold text-center font-headline">Nossos Modelos Mais Populares</h2>
            <p className="text-muted-foreground text-center mt-2 mb-10">Escolha um modelo e comece a criar em segundos.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {cupTypes.map((type) => (
                    <Card key={type.name} className="flex flex-col items-center p-6 text-center transition-all hover:shadow-xl hover:-translate-y-1.5 duration-300">
                        <CardHeader>
                            <CardTitle className="font-sans text-xl">{type.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 flex items-center justify-center w-full">
                            <div className="relative w-40 h-40 text-foreground/80">
                                <Image src={type.imageUrl} alt={type.name} fill className="object-contain" data-ai-hint={type['data-ai-hint']} />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div className="text-center mt-12">
                 <Button asChild size="lg">
                     <Link href="/create">Começar a Personalizar</Link>
                 </Button>
            </div>
        </section>
      </main>
      <footer className="border-t bg-secondary/50">
        <div className="container mx-auto py-6 text-center text-muted-foreground text-sm">
            <p>&copy; {new Date().getFullYear()} CupVision AI. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
