import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { User, Wrench, ShoppingCart } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  return (
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
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/login">Fazer Login</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/register">Cadastrar</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/admin/login">
                        <Wrench className="mr-2 h-4 w-4" />
                        <span>Admin</span>
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
