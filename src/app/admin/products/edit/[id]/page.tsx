import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CUP_TYPES_SUMMARY } from '@/lib/cup-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const { id } = params;
  const product = CUP_TYPES_SUMMARY.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto grid max-w-4xl flex-1 auto-rows-max gap-4">
      <div className="flex items-center gap-4">
         <Link href="/admin/products">
            <Button variant="outline" size="icon" className="h-7 w-7">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Voltar</span>
            </Button>
        </Link>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          Editar: {product.name}
        </h1>
        <div className="hidden items-center gap-2 md:ml-auto md:flex">
            <Link href="/admin/products">
                <Button variant="outline" size="sm">
                    Descartar
                </Button>
            </Link>
            <Button size="sm">Salvar Produto</Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Detalhes do Produto</CardTitle>
                    <CardDescription>Informações básicas do modelo do copo.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="name">Nome do Produto</Label>
                        <Input id="name" defaultValue={product.name} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="basePrice">Preço Base (R$)</Label>
                        <Input id="basePrice" type="number" defaultValue={product.basePrice} />
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Opções de Personalização</CardTitle>
                    <CardDescription>Configure as opções disponíveis para este modelo de copo.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Formulário para cores, bordas, degradê, etc. (Em desenvolvimento)</p>
                </CardContent>
            </Card>
        </div>
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Imagem do Produto</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <div className="relative aspect-square w-full">
                        <Image
                            alt={product.name}
                            className="aspect-square w-full rounded-md object-cover"
                            height="200"
                            src={product.imageUrl}
                            width="200"
                        />
                    </div>
                    <Button variant="outline" size="sm" className="mt-4 w-full">
                        Alterar imagem
                    </Button>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Dimensões</CardTitle>
                    <CardDescription>Para cálculo de frete.</CardDescription>
                </CardHeader>
                <CardContent>
                     <p className="text-sm text-muted-foreground">Formulário para dimensões (Em desenvolvimento)</p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
