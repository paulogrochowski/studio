
'use client';

import Link from "next/link";
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingCart, Package, Users, Palette, Megaphone } from 'lucide-react';
import { cn } from "@/lib/utils";

const menuItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/orders", icon: ShoppingCart, label: "Pedidos" },
  { href: "/admin/products", icon: Package, label: "Produtos" },
  { href: "/admin/customers", icon: Users, label: "Clientes" },
  { href: "/admin/layout", icon: Palette, label: "Layout" },
  { href: "/admin/marketing", icon: Megaphone, label: "Marketing" },
];

export function AdminFooterMenu() {
  const pathname = usePathname();

  return (
    <footer className="fixed bottom-0 z-50 w-full bg-primary text-primary-foreground border-t">
        <div className="container mx-auto flex h-16 items-center justify-around px-2">
            {menuItems.map(({ href, icon: Icon, label }) => (
                <Link
                    href={href}
                    key={href}
                    className={cn(
                        "flex flex-col items-center justify-center gap-1 text-xs font-medium w-16 transition-colors hover:text-primary-foreground/80",
                        pathname.startsWith(href) ? "text-primary-foreground font-bold opacity-100" : "text-primary-foreground/70 opacity-70"
                    )}
                >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="text-[10px] sm:text-xs">{label}</span>
                </Link>
            ))}
        </div>
    </footer>
  );
}
