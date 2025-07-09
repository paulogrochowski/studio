
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
import { LayoutDashboard, Package, ShoppingCart, Users, BarChart3, Megaphone, Palette, Wrench, Heart } from 'lucide-react';
import { AdminHeader } from "@/components/admin-header";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Always return the full admin layout with sidebar
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
