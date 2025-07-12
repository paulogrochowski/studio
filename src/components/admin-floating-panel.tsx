
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Wrench, LayoutDashboard, Package, ShoppingCart, Users, BarChart3, Megaphone, Palette, LogOut } from 'lucide-react';
import { Button } from "./ui/button";
import { handleLogout } from "@/app/actions";
import { Separator } from "./ui/separator";
import { AdminPlaceholder } from "./admin-placeholder";

const AdminToolButton = ({ icon: Icon, label, children }: { icon: React.ElementType, label: string, children: React.ReactNode }) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="ghost" className="flex flex-col h-auto p-2 gap-1">
        <Icon className="w-6 h-6" />
        <span className="text-xs">{label}</span>
      </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2"><Icon /> {label}</DialogTitle>
        <DialogDescription>Gerencie esta seção da sua loja.</DialogDescription>
      </DialogHeader>
      <div className="py-4">
        {children}
      </div>
    </DialogContent>
  </Dialog>
);

export function AdminFloatingPanel() {

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 bg-background border rounded-full shadow-2xl p-2">
        <AdminToolButton label="Dashboard" icon={LayoutDashboard}>
          <AdminPlaceholder title="Dashboard Principal" />
        </AdminToolButton>
        <AdminToolButton label="Pedidos" icon={ShoppingCart}>
          <AdminPlaceholder title="Gerenciamento de Pedidos" />
        </AdminToolButton>
        <AdminToolButton label="Produtos" icon={Package}>
          <AdminPlaceholder title="Gerenciamento de Produtos" />
        </AdminToolButton>
        <AdminToolButton label="Clientes" icon={Users}>
          <AdminPlaceholder title="Gerenciamento de Clientes" />
        </AdminToolButton>
        <AdminToolButton label="Análises" icon={BarChart3}>
          <AdminPlaceholder title="Análises e Relatórios" />
        </AdminToolButton>
        
        <Separator orientation="vertical" className="h-10 mx-1" />
        
        <AdminToolButton label="Layout" icon={Palette}>
          <AdminPlaceholder title="Editor de Layout da Loja" />
        </AdminToolButton>
        <AdminToolButton label="Marketing" icon={Megaphone}>
          <AdminPlaceholder title="Ferramentas de Marketing" />
        </AdminToolButton>
        
        <Separator orientation="vertical" className="h-10 mx-1" />
        
        <form action={handleLogout}>
          <Button variant="destructive" type="submit" className="flex flex-col h-auto p-2 gap-1">
             <LogOut className="w-6 h-6" />
             <span className="text-xs">Sair</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
