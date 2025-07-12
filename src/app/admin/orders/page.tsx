
'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"

const orders = [
    { id: 'ORD001', customer: 'João Silva', date: '2024-07-20', total: 150.00, status: 'Pendente' },
    { id: 'ORD002', customer: 'Maria Oliveira', date: '2024-07-19', total: 275.50, status: 'Enviado' },
    { id: 'ORD003', customer: 'Carlos Pereira', date: '2024-07-18', total: 80.20, status: 'Concluído' },
    { id: 'ORD004', customer: 'Ana Costa', date: '2024-07-17', total: 500.00, status: 'Cancelado' },
];

const statusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
    'Pendente': 'default',
    'Enviado': 'secondary',
    'Concluído': 'outline',
    'Cancelado': 'destructive'
};

export default function AdminOrdersPage() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredOrders = orders.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">Pedidos</h1>
                <p className="text-muted-foreground">Acompanhe e gerencie todos os pedidos da loja.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Todos os Pedidos</CardTitle>
                    <CardDescription>
                        <div className="relative mt-2">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por ID ou nome do cliente..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Pedido</TableHead>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Data</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead><span className="sr-only">Ações</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredOrders.map(order => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">{order.id}</TableCell>
                                    <TableCell>{order.customer}</TableCell>
                                    <TableCell>{new Date(order.date).toLocaleDateString('pt-BR')}</TableCell>
                                    <TableCell>R$ {order.total.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Badge variant={statusVariant[order.status] || 'default'}>{order.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Toggle menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                                <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                                                <DropdownMenuItem>Marcar como Enviado</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive">Cancelar Pedido</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
