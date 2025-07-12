'use client';

import { ReactNode } from 'react';
import { handleLogout } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { AdminFooterMenu } from '@/components/admin-footer-menu';
import { Home, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:px-6">
        <div className="flex items-center gap-4">
           <Button variant="outline" size="icon" asChild>
                <Link href="/">
                    <Home className="h-4 w-4" />
                    <span className="sr-only">Voltar para a Loja</span>
                </Link>
            </Button>
            <h1 className="font-headline text-xl font-bold tracking-wider uppercase">Painel Admin</h1>
        </div>
        <form action={handleLogout}>
            <Button variant="ghost" size="sm" type="submit">
                <LogOut className="mr-2 h-4 w-4" />
                Sair
            </Button>
        </form>
      </header>
      <main className="flex-1 p-4 sm:px-6 sm:py-4 md:gap-8">
        {children}
      </main>
      <AdminFooterMenu />
    </div>
  );
}
