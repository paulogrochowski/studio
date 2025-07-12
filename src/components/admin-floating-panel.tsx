
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
import { useAdminLogin } from "./admin-login-modal-provider";

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
  const AdminPlaceholder = ({ title }: { title: string }) => (
    <div className="flex flex-col items-center justify-center text-center py-16 bg-muted/50 rounded-lg border-2 border-dashed">
      <Wrench className="w-12 h-12 text-muted-foreground mb-4" />
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-muted-foreground">Esta funcionalidade está em desenvolvimento.</p>
    </div>
  );

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 bg-background border rounded-full shadow-2xl p-2">
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
