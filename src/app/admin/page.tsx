
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { DollarSign, Users, Package, Activity } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';


const chartData = [
  { month: 'Jan', revenue: 1860.45 },
  { month: 'Fev', revenue: 3050.89 },
  { month: 'Mar', revenue: 2370.00 },
  { month: 'Abr', revenue: 7300.50 },
  { month: 'Mai', revenue: 5490.10 },
  { month: 'Jun', revenue: 9845.67 },
];

const chartConfig = {
  revenue: {
    label: 'Receita',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

const recentSales = [
  { name: 'João Silva', email: 'joao.silva@example.com', total: 75.50 },
  { name: 'Maria Oliveira', email: 'maria.o@example.com', total: 120.00 },
  { name: 'Carlos Pereira', email: 'carlos.p@example.com', total: 80.00 },
  { name: 'Ana Costa', email: 'ana.costa@example.com', total: 250.00 },
  { name: 'Pedro Martins', email: 'pedro.m@example.com', total: 25.00 },
];

export default function AdminDashboardPage() {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">R$ 45.231,89</div>
                        <p className="text-xs text-muted-foreground">+20,1% em relação ao mês passado</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Novos Clientes</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+2.350</div>
                        <p className="text-xs text-muted-foreground">+180,1% em relação ao mês passado</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+12.234</div>
                        <p className="text-xs text-muted-foreground">+19% em relação ao mês passado</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">5.8%</div>
                        <p className="text-xs text-muted-foreground">+2.1% em relação ao mês passado</p>
                    </CardContent>
                </Card>
            </div>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Visão Geral de Vendas</CardTitle>
                        <CardDescription>Receita mensal dos últimos 6 meses.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[400px] w-full">
                        <ChartContainer config={chartConfig} className="w-full h-full">
                            <BarChart data={chartData} accessibilityLayer>
                                <CartesianGrid vertical={false} />
                                <XAxis 
                                    dataKey="month" 
                                    tickLine={false} 
                                    tickMargin={10} 
                                    axisLine={false} 
                                />
                                <YAxis
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `R$${value / 1000}k`}
                                />
                                <ChartTooltip 
                                    cursor={false} 
                                    content={<ChartTooltipContent formatter={(value) => `R$ ${Number(value).toFixed(2)}`} />} 
                                />
                                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Vendas Recentes</CardTitle>
                        <CardDescription>As últimas 5 vendas da sua loja.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6">
                        {recentSales.map((sale, index) => (
                        <div key={index} className="flex items-center gap-4">
                            <Avatar className="h-9 w-9">
                                <AvatarImage src={`https://avatar.vercel.sh/${sale.email}.png`} alt={sale.name} />
                                <AvatarFallback>{sale.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div className="grid gap-1">
                            <p className="text-sm font-medium leading-none">{sale.name}</p>
                            <p className="text-sm text-muted-foreground">{sale.email}</p>
                            </div>
                            <div className="ml-auto font-medium">
                            +R$ {sale.total.toFixed(2).replace('.', ',')}
                            </div>
                        </div>
                        ))}
                    </CardContent>
                    <CardFooter>
                        <Button asChild size="sm" className="w-full">
                            <Link href="/admin/orders">Ver Todas as Vendas</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
