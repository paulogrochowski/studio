
'use client';

import Link from "next/link";
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingCart, Package, Users, Palette, Megaphone, LogOut } from 'lucide-react';
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { handleLogout } from "@/app/actions";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


const menuItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/orders", icon: ShoppingCart, label: "Pedidos" },
  { href: "/admin/products", icon: Package, label: "Produtos" },
  { href: "/admin/customers", icon: Users, label: "Clientes" },
  { href: "/admin/layout", icon: Palette, label: "Layout" },
  { href: "/admin/marketing", icon: Megaphone, label: "Marketing" },
];

export function AdminFooterMenu() {
  const pathname = usePathname();

  return (
    <footer className="sticky bottom-0 z-50 mt-auto bg-background/95 backdrop-blur border-t">
      <TooltipProvider>
        <div className="container mx-auto flex h-16 items-center justify-center gap-4 px-4 sm:justify-between">
          <nav className="flex items-center justify-center gap-2 sm:gap-4">
            {menuItems.map(({ href, icon: Icon, label }) => (
              <Tooltip key={href} delayDuration={100}>
                <TooltipTrigger asChild>
                  <Button
                    asChild
                    variant={pathname === href ? "secondary" : "ghost"}
                    size="icon"
                    className={cn("flex flex-col h-auto p-2 gap-1 transition-all", 
                      pathname === href && "text-primary"
                    )}
                  >
                    <Link href={href}>
                      <Icon className="w-5 h-5" />
                      <span className="text-xs hidden sm:inline">{label}</span>
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{label}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </nav>
          
          <div className="border-l h-10 mx-2 hidden sm:block" />

          <form action={handleLogout} className="flex items-center">
             <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        type="submit"
                        className="flex flex-col h-auto p-2 gap-1 text-destructive hover:text-destructive"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="text-xs hidden sm:inline">Sair</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Sair do modo Admin</p>
                </TooltipContent>
            </Tooltip>
          </form>
        </div>
      </TooltipProvider>
    </footer>
  );
}
