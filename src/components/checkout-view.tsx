
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { OrderDetails } from "@/lib/types";
import { CheckCircle2, PartyPopper } from "lucide-react";
import Image from "next/image";
import { Separator } from "./ui/separator";

interface CheckoutViewProps {
  orderDetails: OrderDetails;
  onStartNewOrder: () => void;
}

export function CheckoutView({ orderDetails, onStartNewOrder }: CheckoutViewProps) {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto bg-green-100 rounded-full p-3 w-fit">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
        <CardTitle className="font-headline text-3xl mt-4">Pedido Enviado para Produção!</CardTitle>
        <CardDescription>
          Sua arte foi finalizada. Abaixo estão os detalhes para a produção e o resumo do seu pedido.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
            <h3 className="font-bold text-lg text-center">Arte Final para Produção</h3>
            <Card className="p-4 checkerboard">
                <div className="relative aspect-square max-w-sm mx-auto">
                    <Image src={orderDetails.art.imageUrl} alt="Arte final para produção" fill className="object-contain" />
                </div>
            </Card>
            <CardDescription className="text-center text-xs">Esta imagem será usada na produção do seu copo.</CardDescription>
        </div>

        <Separator />
        
        <div className="bg-secondary/50 rounded-lg p-6 space-y-4">
          <h3 className="font-bold text-lg text-center">Resumo do Pedido</h3>
          <div className="flex items-center gap-4">
             <div className="relative w-24 h-24 rounded-md overflow-hidden border bg-white shadow-inner shrink-0">
                {/* Cup color shape */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundColor: orderDetails.cupModel.colorHex,
                    opacity: orderDetails.cupModel.opacityType === 'Transparente' ? 0.75 : 1.0,
                    WebkitMaskImage: `url(${orderDetails.cupModel.imageUrl})`,
                    maskImage: `url(${orderDetails.cupModel.imageUrl})`,
                    WebkitMaskSize: 'contain',
                    maskSize: 'contain',
                    WebkitMaskRepeat: 'no-repeat',
                    maskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                    maskPosition: 'center',
                  }}
                />
            </div>
            <div>
                <p><strong>{orderDetails.quantity}x</strong> {orderDetails.cupModel.name}</p>
                {orderDetails.cupModel.opacityType && (
                    <p className="text-sm text-muted-foreground">{orderDetails.cupModel.opacityType}</p>
                )}
                {orderDetails.cupModel.rimColor && orderDetails.cupModel.rimColor !== 'Nenhuma' && (
                  <p className="text-sm text-muted-foreground">Borda: {orderDetails.cupModel.rimColor}</p>
                )}
                <p className="text-sm text-muted-foreground">Entrega: {orderDetails.isUrgent ? 'Urgente' : 'Padrão'}</p>
            </div>
            <div className="ml-auto text-right">
                <p className="font-bold text-lg text-primary">R$ {orderDetails.total.toFixed(2).replace('.', ',')}</p>
                <p className="text-xs text-muted-foreground">Total Pago</p>
            </div>
          </div>
        </div>
        <div className="text-center">
        <Button onClick={onStartNewOrder} size="lg">
          <PartyPopper className="mr-2 h-5 w-5" />
          Criar um Novo Pedido
        </Button>
        </div>
      </CardContent>
    </Card>
  );
}
