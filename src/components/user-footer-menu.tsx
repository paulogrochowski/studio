'use client';

import Link from "next/link";
import { usePathname } from 'next/navigation';
import { Home, ListOrdered, ShoppingCart, Heart, Ticket, MessageCircle } from 'lucide-react';
import { cn } from "@/lib/utils";

const menuItems = [
  { href: "/", icon: Home, label: "Início" },
  { href: "/orders", icon: ListOrdered, label: "Compras" },
  { href: "/coupons", icon: Ticket, label: "Cupons" },
  { href: "/messages", icon: MessageCircle, label: "Mensa." },
  { href: "/cart", icon: ShoppingCart, label: "Carrinho" },
  { href: "/favorites", icon: Heart, label: "Favoritos" },
];

export function UserFooterMenu() {
  const pathname = usePathname();

  return (
    <footer className="fixed bottom-0 z-50 w-full bg-primary text-primary-foreground border-t">
        <div className="container mx-auto flex h-16 items-center justify-around px-4">
            {menuItems.map(({ href, icon: Icon, label }) => (
                <Link
                    href={href}
                    key={href}
                    className={cn(
                        "flex flex-col items-center justify-center gap-1 text-xs font-medium w-16 transition-colors hover:text-primary-foreground/80",
                        pathname === href ? "text-primary-foreground font-bold opacity-100" : "text-primary-foreground/70 opacity-70"
                    )}
                >
                    <Icon className="w-6 h-6" />
                    <span>{label}</span>
                </Link>
            ))}
        </div>
    </footer>
  );
}
