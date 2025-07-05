import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CUP_TYPES_SUMMARY } from '@/lib/cup-data';
import Image from 'next/image';
import { FilePlus2, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


export default function AdminProductsPage() {
    
  async function handleAddProduct(formData: FormData) {
    'use server';
    console.log('New Product Data:', {
      name: formData.get('name'),
      basePrice: formData.get('basePrice'),
      imageUrl: formData.get('imageUrl'),
    });
  }

  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="active">Ativos</TabsTrigger>
          <TabsTrigger value="draft">Rascunhos</TabsTrigger>
          <TabsTrigger value="archived" className="hidden sm:flex">
            Arquivados
          </TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" variant="outline">
            Exportar
          </Button>
          <Button size="sm" className="h-8 gap-1">
            <FilePlus2 className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Adicionar Produto
            </span>
          </Button>
        </div>
      </div>
      <TabsContent value="all">
        <Card>
            <CardHeader>
                <CardTitle>Produtos</CardTitle>
                <CardDescription>Gerencie seus produtos e visualize suas vendas.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="hidden w-[100px] sm:table-cell">
                                <span className="sr-only">Imagem</span>
                            </TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Preço Base</TableHead>
                            <TableHead className="hidden md:table-cell">Estoque</TableHead>
                            <TableHead className="hidden md:table-cell">Criado em</TableHead>
                             <TableHead>
                                <span className="sr-only">Ações</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {CUP_TYPES_SUMMARY.map((product) => (
                            <TableRow key={product.name}>
                                <TableCell className="hidden sm:table-cell">
                                    <Image src={product.imageUrl} alt={product.name} width={64} height={64} className="aspect-square rounded-md object-cover" />
                                </TableCell>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">Ativo</Badge>
                                </TableCell>
                                <TableCell>R$ {product.basePrice.toFixed(2)}</TableCell>
                                <TableCell className="hidden md:table-cell">250</TableCell>
                                <TableCell className="hidden md:table-cell">2023-07-12 10:42</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                        <Button
                                            aria-haspopup="true"
                                            size="icon"
                                            variant="ghost"
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">Toggle menu</span>
                                        </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                        <DropdownMenuItem>Editar</DropdownMenuItem>
                                        <DropdownMenuItem>Duplicar</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive">
                                            Deletar
                                        </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter>
                <div className="text-xs text-muted-foreground">
                    Mostrando <strong>1-4</strong> de <strong>4</strong> produtos
                </div>
            </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
