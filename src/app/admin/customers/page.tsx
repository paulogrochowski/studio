
'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const customers = [
    { id: 'c1', name: 'João Silva', email: 'joao.silva@example.com', totalSpent: 150.00, avatar: 'https://placehold.co/40x40.png' },
    { id: 'c2', name: 'Maria Oliveira', email: 'maria.oliveira@example.com', totalSpent: 275.50, avatar: 'https://placehold.co/40x40.png' },
    { id: 'c3', name: 'Carlos Pereira', email: 'carlos.pereira@example.com', totalSpent: 80.20, avatar: 'https://placehold.co/40x40.png' },
    { id: 'c4', name: 'Ana Costa', email: 'ana.costa@example.com', totalSpent: 500.00, avatar: 'https://placehold.co/40x40.png' },
];

export default function AdminCustomersPage() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCustomers = customers.filter(customer => 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Clientes</h1>
                    <p className="text-muted-foreground">Visualize e gerencie seus clientes.</p>
                </div>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar Novo Cliente
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Todos os Clientes</CardTitle>
                    <CardDescription>
                        <div className="relative mt-2">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar cliente por nome ou email..."
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
                                <TableHead>Cliente</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Total Gasto</TableHead>
                                <TableHead><span className="sr-only">Ações</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCustomers.map(customer => (
                                <TableRow key={customer.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={customer.avatar} alt={customer.name} />
                                                <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span>{customer.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{customer.email}</TableCell>
                                    <TableCell>R$ {customer.totalSpent.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline" size="sm">Ver Detalhes</Button>
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
