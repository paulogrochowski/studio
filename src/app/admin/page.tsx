'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DollarSign, Users, Package, Activity } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig, ChartLegend, ChartLegendContent } from '@/components/ui/chart';


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

export default function AdminDashboardPage() {
    return (
        <div className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
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
            <Card>
                <CardHeader>
                    <CardTitle>Visão Geral de Vendas</CardTitle>
                    <CardDescription>Receita mensal dos últimos 6 meses.</CardDescription>
                </CardHeader>
                <CardContent className="h-96">
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
        </div>
    )
}
