
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import { DollarSign, ShoppingCart, Users, ArrowUp, ArrowDown } from "lucide-react";
import Image from "next/image";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CUP_TYPES_SUMMARY } from "@/lib/cup-data";

const salesData = [
  { date: "2024-05-01", sales: 2500 },
  { date: "2024-05-02", sales: 2800 },
  { date: "2024-05-03", sales: 3200 },
  { date: "2024-05-04", sales: 2900 },
  { date: "2024-05-05", sales: 3500 },
  { date: "2024-05-06", sales: 4100 },
  { date: "2024-05-07", sales: 3800 },
];

const chartConfig = {
  sales: {
    label: "Vendas",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

const topProducts = [
  { ...CUP_TYPES_SUMMARY[0], sold: 1250, revenue: 4375.00 },
  { ...CUP_TYPES_SUMMARY[2], sold: 980, revenue: 3136.00 },
  { ...CUP_TYPES_SUMMARY[1], sold: 750, revenue: 3600.00 },
  { ...CUP_TYPES_SUMMARY[3], sold: 420, revenue: 3318.00 },
];

export default function AdminReportsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Relatórios</h1>
                    <p className="text-muted-foreground">Análise de desempenho da sua loja.</p>
                </div>
                <Select defaultValue="30d">
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Selecione o período" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="7d">Últimos 7 dias</SelectItem>
                        <SelectItem value="30d">Últimos 30 dias</SelectItem>
                        <SelectItem value="90d">Últimos 90 dias</SelectItem>
                        <SelectItem value="1y">Último ano</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
                        <DollarSign className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">R$ 14.429,00</div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <ArrowUp className="h-4 w-4 text-green-500" />
                            +15.2% em relação ao período anterior
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
                        <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">342</div>
                         <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <ArrowUp className="h-4 w-4 text-green-500" />
                            +8.1% em relação ao período anterior
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
                        <Users className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">R$ 42,19</div>
                         <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <ArrowDown className="h-4 w-4 text-red-500" />
                            -2.5% em relação ao período anterior
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Visão Geral de Vendas</CardTitle>
                        <CardDescription>Gráfico de receita durante o período selecionado.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ChartContainer config={chartConfig} className="w-full h-full">
                             <BarChart data={salesData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis tickFormatter={(value) => `R$${value/1000}k`} fontSize={12} tickLine={false} axisLine={false} />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent formatter={(value) => `R$ ${Number(value).toFixed(2)}`} />} />
                                <Bar dataKey="sales" fill="var(--color-sales)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Produtos Mais Vendidos</CardTitle>
                        <CardDescription>Ranking de produtos por receita.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <Table>
                           <TableHeader>
                               <TableRow>
                                   <TableHead>Produto</TableHead>
                                   <TableHead className="text-right">Receita</TableHead>
                               </TableRow>
                           </TableHeader>
                           <TableBody>
                               {topProducts.map(product => (
                                   <TableRow key={product.id}>
                                       <TableCell>
                                           <div className="flex items-center gap-3">
                                                <Image src={product.imageUrl} alt={product.name} width={40} height={40} className="rounded-md object-cover" />
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-sm">{product.name}</span>
                                                    <span className="text-xs text-muted-foreground">{product.sold} vendidos</span>
                                                </div>
                                           </div>
                                       </TableCell>
                                       <TableCell className="text-right font-semibold">R$ {product.revenue.toFixed(2).replace('.', ',')}</TableCell>
                                   </TableRow>
                               ))}
                           </TableBody>
                       </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
