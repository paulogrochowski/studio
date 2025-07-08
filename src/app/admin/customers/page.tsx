
'use client';

import { useState, useTransition, useRef } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal, UserPlus, Loader2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { handleAdminAddCustomer } from '@/app/actions';

const customers = [
  { id: '1', name: 'João Silva', email: 'joao.silva@example.com', phone: '(11) 98765-4321', cpf: '123.456.789-00', address: 'Rua das Flores, 123, São Paulo, SP', totalSpent: 150.75, orders: 3, joined: '2023-10-15' },
  { id: '2', name: 'Maria Oliveira', email: 'maria.o@example.com', phone: '(21) 99876-5432', cpf: '987.654.321-01', address: 'Avenida Copacabana, 456, Rio de Janeiro, RJ', totalSpent: 450.00, orders: 5, joined: '2023-09-20' },
  { id: '3', name: 'Carlos Pereira', email: 'carlos.p@example.com', phone: '(31) 98765-1234', cpf: '456.789.123-02', address: 'Praça da Liberdade, 789, Belo Horizonte, MG', totalSpent: 80.00, orders: 1, joined: '2023-11-01' },
  { id: '4', name: 'Ana Costa', email: 'ana.costa@example.com', phone: '(51) 99876-2345', cpf: '789.123.456-03', address: 'Rua da Praia, 101, Porto Alegre, RS', totalSpent: 980.50, orders: 12, joined: '2022-03-10' },
  { id: '5', name: 'Pedro Martins', email: 'pedro.m@example.com', phone: '(81) 98765-3456', cpf: '321.654.987-04', address: 'Avenida Boa Viagem, 202, Recife, PE', totalSpent: 25.00, orders: 1, joined: '2024-01-05' },
];

export default function AdminCustomersPage() {
    const { toast } = useToast();
    const [isAddCustomerDialogOpen, setAddCustomerDialogOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const formRef = useRef<HTMLFormElement>(null);

    const clientAction = async (formData: FormData) => {
        startTransition(async () => {
            const result = await handleAdminAddCustomer(formData);
            if (result.success) {
                toast({
                    title: "Cliente Adicionado!",
                    description: "O novo cliente foi adicionado (simulação).",
                });
                setAddCustomerDialogOpen(false);
                formRef.current?.reset();
            } else {
                toast({
                    title: "Erro ao adicionar cliente",
                    description: result.error,
                    variant: "destructive",
                });
            }
        });
    }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>Clientes</CardTitle>
            <CardDescription>Gerencie seus clientes e visualize seus históricos de compras.</CardDescription>
        </div>
        <Dialog open={isAddCustomerDialogOpen} onOpenChange={setAddCustomerDialogOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                    <UserPlus />
                    Adicionar Cliente
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
                <form ref={formRef} action={clientAction}>
                    <DialogHeader>
                        <DialogTitle>Adicionar Novo Cliente</DialogTitle>
                        <DialogDescription>
                            Preencha os detalhes do novo cliente para adicioná-lo à plataforma.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Nome</Label>
                            <Input id="name" name="name" className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">Email</Label>
                            <Input id="email" name="email" type="email" className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone" className="text-right">Telefone</Label>
                            <Input id="phone" name="phone" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="cpf" className="text-right">CPF</Label>
                            <Input id="cpf" name="cpf" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="address" className="text-right">Endereço</Label>
                            <Input id="address" name="address" className="col-span-3" />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Salvar Cliente
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead className="hidden md:table-cell">Contato</TableHead>
              <TableHead className="text-center hidden sm:table-cell">Pedidos</TableHead>
              <TableHead className="text-right hidden sm:table-cell">Total Gasto</TableHead>
              <TableHead className="w-12"><span className="sr-only">Ações</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map(customer => (
              <TableRow key={customer.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 border">
                      <AvatarImage src={`https://avatar.vercel.sh/${customer.email}.png`} alt={customer.name} />
                      <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{customer.name}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                    <div className="flex flex-col">
                        <span>{customer.email}</span>
                        <span className="text-xs text-muted-foreground">{customer.phone}</span>
                    </div>
                </TableCell>
                <TableCell className="text-center hidden sm:table-cell">{customer.orders}</TableCell>
                <TableCell className="text-right hidden sm:table-cell">R$ {customer.totalSpent.toFixed(2).replace('.', ',')}</TableCell>
                <TableCell>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4"/></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                                <Link href={`/admin/customers/edit/${customer.id}`}>Editar Cliente</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Excluir Cliente</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
