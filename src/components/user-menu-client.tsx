
'use client';

import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { User, LogOut, Heart, Settings, ShoppingCart } from "lucide-react";
import { handleLogout } from "@/app/actions";

interface UserMenuClientProps {
  isLoggedIn: boolean;
  notificationCount?: number;
}

export function UserMenuClient({ isLoggedIn, notificationCount = 0 }: UserMenuClientProps) {

  if (!isLoggedIn) {
    return (
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Entrar</Link>
            </Button>
            <Button asChild size="sm">
                <Link href="/register">Registrar</Link>
            </Button>
        </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <User className="h-[1.2rem] w-[1.2rem]" />
          {notificationCount > 0 && (
            <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] ring-2 ring-background">
              {notificationCount}
            </span>
          )}
          <span className="sr-only">Menu do Usuário</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
           <Link href="/admin/orders" className="flex items-center cursor-pointer">
            <ShoppingCart className="mr-2 h-4 w-4" />
            <span>Meus Pedidos</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="#" className="flex items-center cursor-pointer">
            <Heart className="mr-2 h-4 w-4" />
            <span>Meus Favoritos</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="#" className="flex items-center cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Meu Perfil</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <form action={handleLogout} className="w-full">
          <DropdownMenuItem asChild>
            <button
              type="submit"
              className="w-full cursor-pointer flex items-center text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
