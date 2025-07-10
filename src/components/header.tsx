
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { ShoppingCart } from "lucide-react";
import { PromotionalBanner } from "./promotional-banner";
import { UserMenuWrapper } from "./user-menu-wrapper";

export function Header() {
  return (
    <>
      <PromotionalBanner />
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-20">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center">
            <div className="flex flex-col leading-none">
              <span className="font-headline text-sm font-semibold tracking-widest text-primary uppercase">COPOS</span>
              <span className="font-headline text-2xl sm:text-3xl font-bold tracking-wider text-primary uppercase -mt-1">MANIA</span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-2">
             <Button variant="ghost" asChild>
              <Link href="/">Início</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/about">Sobre Nós</Link>
            </Button>
             <Button variant="ghost" asChild>
              <Link href="/how-to-customize">Como Funciona</Link>
            </Button>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
                <ShoppingCart className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Carrinho</span>
            </Button>
            
            <UserMenuWrapper />

            <ThemeToggle />
          </div>
        </div>
      </header>
    </>
  );
}
