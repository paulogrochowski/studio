import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const orders = [
  { id: 'ORD001', customer: 'João Silva', date: '2024-05-20', total: 75.50, status: 'Concluído' },
  { id: 'ORD002', customer: 'Maria Oliveira', date: '2024-05-19', total: 120.00, status: 'Processando' },
  { id: 'ORD003', customer: 'Carlos Pereira', date: '2024-05-18', total: 80.00, status: 'Enviado' },
  { id: 'ORD004', customer: 'Ana Costa', date: '2024-05-17', total: 250.00, status: 'Concluído' },
  { id: 'ORD005', customer: 'Pedro Martins', date: '2024-05-16', total: 25.00, status: 'Cancelado' },
  { id: 'ORD006', customer: 'Juliana Alves', date: '2024-05-15', total: 300.50, status: 'Processando' },
];

type OrderStatus = 'Concluído' | 'Processando' | 'Enviado' | 'Cancelado';

const getStatusVariant = (status: OrderStatus): "default" | "secondary" | "outline" | "destructive" => {
  switch (status) {
    case 'Concluído':
      return 'outline';
    case 'Processando':
      return 'default';
    case 'Enviado':
      return 'secondary';
    case 'Cancelado':
      return 'destructive';
    default:
      return 'secondary';
  }
};


export default function AdminOrdersPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pedidos</CardTitle>
        <CardDescription>Visualize e gerencie todos os pedidos recentes da loja.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Pedido</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead className="hidden sm:table-cell">Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right hidden sm:table-cell">Total</TableHead>
              <TableHead className="w-12"><span className="sr-only">Ações</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map(order => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell className="hidden sm:table-cell">{new Date(order.date).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell><Badge variant={getStatusVariant(order.status as OrderStatus)}>{order.status}</Badge></TableCell>
                <TableCell className="text-right hidden sm:table-cell">R$ {order.total.toFixed(2).replace('.', ',')}</TableCell>
                 <TableCell>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4"/></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                            <DropdownMenuItem>Atualizar Status</DropdownMenuItem>
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
  );
}
