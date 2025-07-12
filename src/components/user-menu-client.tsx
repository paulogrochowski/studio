
'use client';

import { useState } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { User, LogOut, Heart, Settings, ShoppingCart } from "lucide-react";
import { handleLogout } from "@/app/actions";
import { LoginForm } from "./login-form";

interface UserMenuClientProps {
  isLoggedIn: boolean;
  notificationCount?: number;
}

export function UserMenuClient({ isLoggedIn, notificationCount = 0 }: UserMenuClientProps) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  if (!isLoggedIn) {
    return (
        <div className="flex items-center gap-2">
            <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="sm">Entrar</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md p-0">
                   <LoginForm onLoginSuccess={() => setIsLoginOpen(false)} />
                </DialogContent>
            </Dialog>

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
           <Link href="/orders" className="flex items-center">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Meus Pedidos
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/favorites" className="flex items-center">
            <Heart className="mr-2 h-4 w-4" />
            Meus Favoritos
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            Meu Perfil
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
              Sair
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
