
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Save } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// Mock data - In a real app, this would be fetched from a database
const customers = [
  { id: '1', name: 'João Silva', email: 'joao.silva@example.com', phone: '(11) 98765-4321', cpf: '123.456.789-00', address: 'Rua das Flores, 123, São Paulo, SP', totalSpent: 150.75, orders: 3, joined: '2023-10-15' },
  { id: '2', name: 'Maria Oliveira', email: 'maria.o@example.com', phone: '(21) 99876-5432', cpf: '987.654.321-01', address: 'Avenida Copacabana, 456, Rio de Janeiro, RJ', totalSpent: 450.00, orders: 5, joined: '2023-09-20' },
  { id: '3', name: 'Carlos Pereira', email: 'carlos.p@example.com', phone: '(31) 98765-1234', cpf: '456.789.123-02', address: 'Praça da Liberdade, 789, Belo Horizonte, MG', totalSpent: 80.00, orders: 1, joined: '2023-11-01' },
  { id: '4', name: 'Ana Costa', email: 'ana.costa@example.com', phone: '(51) 99876-2345', cpf: '789.123.456-03', address: 'Rua da Praia, 101, Porto Alegre, RS', totalSpent: 980.50, orders: 12, joined: '2022-03-10' },
  { id: '5', name: 'Pedro Martins', email: 'pedro.m@example.com', phone: '(81) 98765-3456', cpf: '321.654.987-04', address: 'Avenida Boa Viagem, 202, Recife, PE', totalSpent: 25.00, orders: 1, joined: '2024-01-05' },
];

const mockOrders = [
    { id: 'ORD001', date: '2024-05-20', total: 75.50, status: 'Concluído' },
    { id: 'ORD004', date: '2024-05-17', total: 250.00, status: 'Concluído' },
    { id: 'ORD008', date: '2024-04-10', total: 124.50, status: 'Concluído' },
];

type OrderStatus = 'Concluído' | 'Processando' | 'Enviado' | 'Cancelado';
const getStatusVariant = (status: OrderStatus): "default" | "secondary" | "outline" | "destructive" => {
  switch (status) {
    case 'Concluído': return 'outline';
    case 'Processando': return 'default';
    case 'Enviado': return 'secondary';
    case 'Cancelado': return 'destructive';
    default: return 'secondary';
  }
};


interface EditCustomerPageProps {
  params: { id: string };
}

export default function EditCustomerPage({ params }: EditCustomerPageProps) {
    const router = useRouter();
    const customer = customers.find(c => c.id === params.id);

    if (!customer) {
        notFound();
    }

    const [name, setName] = useState(customer.name);
    const [email, setEmail] = useState(customer.email);
    const [phone, setPhone] = useState(customer.phone);
    const [cpf, setCpf] = useState(customer.cpf);
    const [address, setAddress] = useState(customer.address);
    
    const handleSaveChanges = () => {
        // Here you would call a server action to update the customer
        console.log("Saving changes for customer:", { id: customer.id, name, email, phone, cpf, address });
        router.push('/admin/customers'); // Redirect back after saving
    }

    return (
        <div className="mx-auto grid w-full max-w-7xl flex-1 auto-rows-max gap-4">
            <div className="flex items-center gap-4">
                <Link href="/admin/customers">
                    <Button variant="outline" size="icon" className="h-7 w-7">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Voltar</span>
                    </Button>
                </Link>
                <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10 border">
                      <AvatarImage src={`https://avatar.vercel.sh/${customer.email}.png`} alt={customer.name} />
                      <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                        {customer.name}
                    </h1>
                </div>
                 <div className="hidden items-center gap-2 md:ml-auto md:flex">
                    <Button variant="outline" size="sm" onClick={() => router.push('/admin/customers')}>
                        Descartar
                    </Button>
                    <Button size="sm" onClick={handleSaveChanges}><Save className="mr-2 h-4 w-4" /> Salvar Alterações</Button>
                </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="grid auto-rows-max items-start gap-4 lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Detalhes do Cliente</CardTitle>
                            <CardDescription>Informações de contato e dados pessoais do cliente.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nome Completo</Label>
                                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                            </div>
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Telefone</Label>
                                    <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cpf">CPF</Label>
                                    <Input id="cpf" value={cpf} onChange={(e) => setCpf(e.target.value)} />
                                </div>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="address">Endereço Completo</Label>
                                <Textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} rows={3} />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Histórico de Compras</CardTitle>
                            <CardDescription>Pedidos realizados pelo cliente na loja.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Pedido</TableHead>
                                        <TableHead>Data</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockOrders.map(order => (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-medium">{order.id}</TableCell>
                                            <TableCell>{new Date(order.date).toLocaleDateString('pt-BR')}</TableCell>
                                            <TableCell><Badge variant={getStatusVariant(order.status as OrderStatus)}>{order.status}</Badge></TableCell>
                                            <TableCell className="text-right">R$ {order.total.toFixed(2).replace('.', ',')}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Resumo do Cliente</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Total Gasto</span>
                                <span className="font-semibold">R$ {customer.totalSpent.toFixed(2).replace('.', ',')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Total de Pedidos</span>
                                <span className="font-semibold">{customer.orders}</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-muted-foreground">Cliente Desde</span>
                                <span className="font-semibold">{new Date(customer.joined).toLocaleDateString('pt-BR')}</span>
                            </div>
                             <Separator />
                             <Button variant="outline" className="w-full">Ver todos os pedidos</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
             <div className="flex items-center justify-end gap-2 md:hidden mt-4">
                 <Button variant="outline" size="sm">
                    Descartar
                </Button>
                <Button size="sm" onClick={handleSaveChanges}><Save className="mr-2 h-4 w-4" /> Salvar</Button>
            </div>
        </div>
    );
}
