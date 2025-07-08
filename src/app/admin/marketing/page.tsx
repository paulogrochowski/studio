
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FilePlus2, Send, Ticket } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const campaigns = [
  { id: 'CAMP01', name: 'Promoção Dia das Mães 2024', status: 'Concluída', startDate: '2024-04-20', endDate: '2024-05-12', sales: 4520.75 },
  { id: 'CAMP02', name: 'Arraiá de Ofertas Juninas', status: 'Ativa', startDate: '2024-06-01', endDate: '2024-06-30', sales: 1230.50 },
  { id: 'CAMP03', name: 'Esquenta Black Friday', status: 'Planejada', startDate: '2024-11-01', endDate: '2024-11-28', sales: 0 },
];

const coupons = [
  { id: 'CUP001', code: 'BEMVINDO10', type: '10% Desconto', status: 'Ativo', usage: 152, limit: 1000 },
  { id: 'CUP002', code: 'FRETEGRATIS', type: 'Frete Grátis', status: 'Ativo', usage: 89, limit: 200 },
  { id: 'CUP003', code: 'VERAO20', type: 'R$ 20 Fixo', status: 'Expirado', usage: 250, limit: 250 },
];


export default function AdminMarketingPage({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  const productName = searchParams?.product_name as string | undefined;
  const emailSubjectDefault = productName ? `Oferta especial no nosso ${decodeURIComponent(productName)}!` : "Ex: Novidades e ofertas imperdíveis!";
  const emailBodyDefault = productName ? `Olá!\n\nTemos uma oferta incrível para você no nosso ${decodeURIComponent(productName)}. É a escolha perfeita para o seu próximo evento.\n\nClique aqui e personalize o seu agora mesmo!\n\nAbraços,\nEquipe Copos Mania` : "Escreva sua mensagem aqui. Você pode usar HTML.";

  return (
    <Tabs defaultValue="campaigns" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
        <TabsTrigger value="coupons">Cupons</TabsTrigger>
        <TabsTrigger value="email">Email Marketing</TabsTrigger>
      </TabsList>
      
      {/* Campaigns Tab */}
      <TabsContent value="campaigns">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Campanhas de Marketing</CardTitle>
              <CardDescription>Crie e gerencie suas campanhas promocionais.</CardDescription>
            </div>
            <Button size="sm" className="h-8 gap-1">
              <FilePlus2 className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Nova Campanha
              </span>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campanha</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead className="hidden md:table-cell w-[150px]">Período</TableHead>
                  <TableHead className="text-right w-[180px]">Vendas Geradas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map(campaign => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">{campaign.name}</TableCell>
                    <TableCell>
                      <Badge variant={
                        campaign.status === 'Ativa' ? 'default' :
                        campaign.status === 'Concluída' ? 'outline' : 'secondary'
                      }>{campaign.status}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {new Date(campaign.startDate).toLocaleDateString('pt-BR')} - {new Date(campaign.endDate).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-right">R$ {campaign.sales.toFixed(2).replace('.', ',')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Coupons Tab */}
      <TabsContent value="coupons">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Cupons de Desconto</CardTitle>
              <CardDescription>Gerencie seus códigos de cupom.</CardDescription>
            </div>
            <Button size="sm" className="h-8 gap-1">
              <Ticket className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Gerar Cupom
              </span>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Tipo de Desconto</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead className="text-center w-[150px]">Uso / Limite</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coupons.map(coupon => (
                  <TableRow key={coupon.id}>
                    <TableCell className="font-mono font-medium">{coupon.code}</TableCell>
                    <TableCell>{coupon.type}</TableCell>
                    <TableCell>
                      <Badge variant={coupon.status === 'Ativo' ? 'default' : 'destructive'}>
                        {coupon.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">{coupon.usage} / {coupon.limit}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Email Marketing Tab */}
      <TabsContent value="email">
        <Card>
          <CardHeader>
            <CardTitle>Criador de Email</CardTitle>
            <CardDescription>Envie emails promocionais para seus clientes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email-subject">Assunto do Email</Label>
                <Input id="email-subject" defaultValue={emailSubjectDefault} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-audience">Enviar Para</Label>
                <Select>
                  <SelectTrigger id="email-audience">
                    <SelectValue placeholder="Selecione o público" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Clientes</SelectItem>
                    <SelectItem value="new">Novos Clientes (últimos 30 dias)</SelectItem>
                    <SelectItem value="repeat">Clientes Recorrentes (2+ compras)</SelectItem>
                    <SelectItem value="high-value">Clientes VIP (Total gasto > R$500)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-body">Corpo do Email</Label>
              <Textarea id="email-body" rows={10} defaultValue={emailBodyDefault} />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="ml-auto">
              <Send className="mr-2 h-4 w-4" />
              Enviar Email
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
