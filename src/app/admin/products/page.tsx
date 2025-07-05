import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CUP_TYPES_SUMMARY } from '@/lib/cup-data';
import Image from 'next/image';

export default function AdminProductsPage() {
    
  async function handleAddProduct(formData: FormData) {
    'use server';
    // In a real app, this would save the new product to a database.
    // For this prototype, we'll just log the data.
    console.log('New Product Data:', {
      name: formData.get('name'),
      basePrice: formData.get('basePrice'),
      imageUrl: formData.get('imageUrl'),
    });
    // In a real app, you would revalidate the path to show the new product.
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-wider uppercase mb-8">Gerenciar Produtos</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Produtos Atuais</CardTitle>
                        <CardDescription>Lista de produtos exibidos na loja.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Imagem</TableHead>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Preço Base</TableHead>
                                    <TableHead>Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {CUP_TYPES_SUMMARY.map((product) => (
                                    <TableRow key={product.name}>
                                        <TableCell>
                                            <Image src={product.imageUrl} alt={product.name} width={40} height={60} className="object-contain rounded-md" />
                                        </TableCell>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>R$ {product.basePrice.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <Button variant="outline" size="sm">Editar</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>Adicionar Novo Produto</CardTitle>
                        <CardDescription>Este formulário é uma demonstração. Os dados não serão salvos permanentemente.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={handleAddProduct} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nome do Produto</Label>
                                <Input id="name" name="name" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="basePrice">Preço Base (ex: 4.50)</Label>
                                <Input id="basePrice" name="basePrice" type="number" step="0.01" required />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="imageUrl">URL da Imagem</Label>
                                <Input id="imageUrl" name="imageUrl" placeholder="https://placehold.co/400x600.png" required />
                            </div>
                            <Button type="submit" className="w-full">Adicionar Produto</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
      </main>
    </div>
  );
}
