import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const customers = [
  { id: '1', name: 'João Silva', email: 'joao.silva@example.com', totalSpent: 150.75, orders: 3, joined: '2023-10-15' },
  { id: '2', name: 'Maria Oliveira', email: 'maria.o@example.com', totalSpent: 450.00, orders: 5, joined: '2023-09-20' },
  { id: '3', name: 'Carlos Pereira', email: 'carlos.p@example.com', totalSpent: 80.00, orders: 1, joined: '2023-11-01' },
  { id: '4', name: 'Ana Costa', email: 'ana.costa@example.com', totalSpent: 980.50, orders: 12, joined: '2022-03-10' },
  { id: '5', name: 'Pedro Martins', email: 'pedro.m@example.com', totalSpent: 25.00, orders: 1, joined: '2024-01-05' },
];

export default function AdminCustomersPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Clientes</CardTitle>
        <CardDescription>Gerencie seus clientes e visualize seus históricos de compras.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="text-center hidden sm:table-cell">Pedidos</TableHead>
              <TableHead className="text-right hidden sm:table-cell">Total Gasto</TableHead>
              <TableHead className="text-right hidden sm:table-cell">Cliente Desde</TableHead>
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
                <TableCell className="hidden md:table-cell">{customer.email}</TableCell>
                <TableCell className="text-center hidden sm:table-cell">{customer.orders}</TableCell>
                <TableCell className="text-right hidden sm:table-cell">R$ {customer.totalSpent.toFixed(2).replace('.', ',')}</TableCell>
                <TableCell className="text-right hidden sm:table-cell">{new Date(customer.joined).toLocaleDateString('pt-BR')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
