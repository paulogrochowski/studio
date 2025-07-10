
'use client';

import { useState, useTransition, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { CUP_TYPES_SUMMARY } from '@/lib/cup-data';
import Image from 'next/image';
import { FilePlus2, MoreHorizontal, Trash2, Loader2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { handleAdminAddProduct } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';


export default function AdminProductsPage() {
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const { toast } = useToast();
  const [isAddProductDialogOpen, setAddProductDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);


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
    
  const clientAction = async (formData: FormData) => {
    startTransition(async () => {
        const result = await handleAdminAddProduct(formData);
        if (result.success) {
            toast({
                title: "Produto Adicionado!",
                description: "O novo produto foi adicionado (simulação).",
            });
            setAddProductDialogOpen(false);
            formRef.current?.reset();
        } else {
            toast({
                title: "Erro ao adicionar produto",
                description: result.error,
                variant: "destructive",
            });
        }
    });
  }

  return (
    <Card>
        <CardHeader>
            <div className="flex items-center justify-between gap-4">
                <div>
                    <CardTitle>Produtos</CardTitle>
                    <CardDescription>Gerencie seus produtos e visualize suas vendas.</CardDescription>
                </div>
                <div className="flex items-center gap-2">
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
                    <Dialog open={isAddProductDialogOpen} onOpenChange={setAddProductDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="h-8 gap-1">
                                <FilePlus2 className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                Adicionar Produto
                                </span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <form ref={formRef} action={clientAction}>
                                <DialogHeader>
                                    <DialogTitle>Adicionar Novo Produto</DialogTitle>
                                    <DialogDescription>
                                        Preencha os detalhes do novo produto. Clique em salvar para adicionar.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">Nome</Label>
                                        <Input id="name" name="name" className="col-span-3" required />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="basePrice" className="text-right">Preço Base</Label>
                                        <Input id="basePrice" name="basePrice" type="number" step="0.01" className="col-span-3" required />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="imageUrl" className="text-right">URL da Imagem</Label>
                                        <Input id="imageUrl" name="imageUrl" placeholder="https://placehold.co/400x600.png" className="col-span-3" required />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
                                    <Button type="submit" disabled={isPending}>
                                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Salvar Produto
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
             <div className="flex items-center gap-2 mt-4">
                <Tabs defaultValue="all">
                    <TabsList>
                        <TabsTrigger value="all">Todos</TabsTrigger>
                        <TabsTrigger value="active">Ativos</TabsTrigger>
                        <TabsTrigger value="draft">Rascunhos</TabsTrigger>
                        <TabsTrigger value="archived" className="hidden sm:flex">
                            Arquivados
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
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
                        <TableHead className="hidden sm:table-cell">Preço Base</TableHead>
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
                            <TableCell className="hidden sm:table-cell">R$ {product.basePrice.toFixed(2)}</TableCell>
                            <TableCell className="hidden md:table-cell">250</TableCell>
                            <TableCell className="hidden md:table-cell">2023-07-12 10:42</TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8"
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
  );
}
