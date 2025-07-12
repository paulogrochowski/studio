
import { cookies } from 'next/headers';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from "@/components/ui/sidebar";
import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingCart, Users, BarChart3, Megaphone, Palette, Wrench, LogOut } from 'lucide-react';
import { AdminHeader } from "@/components/admin-header";
import { AdminLoginForm } from '@/components/admin-login-form';
import { Button } from '@/components/ui/button';
import { handleLogout } from '../actions';
import { headers } from 'next/headers';

function getSearchParams() {
    const heads = headers();
    const url = new URL(heads.get('x-url') || 'http://localhost');
    const searchParams: { [key: string]: string | string[] | undefined } = {};
    url.searchParams.forEach((value, key) => {
        searchParams[key] = value;
    });
    return searchParams;
}


export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const adminCookie = cookies().get('admin-session');
    const searchParams = getSearchParams();

    if (!adminCookie) {
        return (
            <div className="flex min-h-screen w-full items-center justify-center bg-muted/40 p-4">
                <AdminLoginForm searchParams={searchParams} />
            </div>
        )
    }

  return (
    <SidebarProvider>
        <div className="flex min-h-screen w-full bg-muted/40">
            <Sidebar>
                <SidebarHeader>
                    <Link href="/" className="flex items-center justify-center">
                        <div className="flex flex-col leading-none text-center">
                            <span className="font-headline text-xs font-semibold tracking-widest text-primary uppercase">COPOS</span>
                            <span className="font-headline text-xl font-bold tracking-wider text-primary uppercase -mt-1">MANIA</span>
                        </div>
                    </Link>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/admin"><LayoutDashboard />Dashboard</Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/admin/products"><Package />Produtos</Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/admin/orders"><ShoppingCart />Pedidos</Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/admin/customers"><Users />Clientes</Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/admin/reports"><BarChart3 />Relatórios</Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/admin/marketing"><Megaphone />Marketing</Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/admin/layout-editor"><Palette />Layout da Loja</Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarContent>
                <SidebarFooter>
                    <SidebarMenu>
                         <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/admin/settings"><Wrench />Configurações</Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <form action={handleLogout} className="w-full">
                                <SidebarMenuButton className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive">
                                    <LogOut /> Sair
                                </SidebarMenuButton>
                            </form>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>

            <SidebarInset>
                <AdminHeader />
                <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
                    {children}
                </main>
            </SidebarInset>
        </div>
    </SidebarProvider>
  );
}
