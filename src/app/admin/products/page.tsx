'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { CUP_TYPES_SUMMARY } from '@/lib/cup-data';
import Image from 'next/image';
import { FilePlus2, MoreHorizontal, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


export default function AdminProductsPage() {
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      setSelectedProductIds(CUP_TYPES_SUMMARY.map((p) => p.id));
    } else {
      setSelectedProductIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    setSelectedProductIds((prev) => {
      if (checked) {
        return [...prev, id];
      } else {
        return prev.filter((pid) => pid !== id);
      }
    });
  };

  const isAllSelected = selectedProductIds.length > 0 && selectedProductIds.length === CUP_TYPES_SUMMARY.length;
  const isSomeSelected = selectedProductIds.length > 0 && !isAllSelected;
    
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
           {selectedProductIds.length > 0 && (
             <Button size="sm" variant="destructive" className="h-8 gap-1" onClick={() => console.log('Deleting selected products:', selectedProductIds)}>
                <Trash2 className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Excluir ({selectedProductIds.length})
                </span>
            </Button>
          )}
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
                            <TableHead className="w-10">
                                <Checkbox
                                    checked={isAllSelected ? true : (isSomeSelected ? 'indeterminate' : false)}
                                    onCheckedChange={handleSelectAll}
                                    aria-label="Selecionar todos"
                                />
                            </TableHead>
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
                            <TableRow key={product.id} data-state={selectedProductIds.includes(product.id) ? "selected" : ""}>
                                 <TableCell>
                                    <Checkbox
                                        checked={selectedProductIds.includes(product.id)}
                                        onCheckedChange={(checked) => handleSelectOne(product.id, !!checked)}
                                        aria-label={`Selecionar ${product.name}`}
                                    />
                                </TableCell>
                                <TableCell className="hidden sm:table-cell">
                                    <Image src={product.imageUrl} alt={product.name} width={64} height={64} className="aspect-square rounded-md object-cover" />
                                </TableCell>
                                <TableCell className="font-medium">
                                     <Link href={`/admin/products/edit/${product.id}`} className="hover:underline">
                                        {product.name}
                                    </Link>
                                </TableCell>
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
                                        <DropdownMenuItem asChild>
                                           <Link href={`/admin/products/edit/${product.id}`}>Editar</Link>
                                        </DropdownMenuItem>
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
