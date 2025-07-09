
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { User, ShoppingCart, LogOut, Heart, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PromotionalBanner } from "./promotional-banner";
import { cookies } from 'next/headers';
import { handleLogout } from "@/app/actions";

export function Header() {
  const authToken = cookies().get('auth-token')?.value;
  const isLoggedIn = !!authToken;

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
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                      <User className="h-[1.2rem] w-[1.2rem]" />
                      <span className="sr-only">Menu do Usuário</span>
                  </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isLoggedIn ? (
                  <>
                    <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Meus Pedidos</DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/favorites" className="flex items-center">
                            <Heart className="mr-2 h-4 w-4" />
                            Meus Favoritos
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        Meu Perfil
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <form action={handleLogout} className="w-full">
                        <DropdownMenuItem asChild>
                            <button type="submit" className="w-full cursor-pointer flex items-center text-destructive focus:text-destructive">
                                <LogOut className="mr-2 h-4 w-4" />
                                Sair
                            </button>
                        </DropdownMenuItem>
                    </form>
                  </>
                ) : (
                  <>
                    <DropdownMenuLabel>Acesse sua conta ou cadastre-se</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href="/login">Fazer Login</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/register">Cadastrar</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <ThemeToggle />
          </div>
        </div>
      </header>
    </>
  );
}
