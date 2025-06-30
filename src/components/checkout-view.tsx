
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { OrderDetails } from "@/lib/types";
import { CheckCircle2, PartyPopper } from "lucide-react";
import Image from "next/image";

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
        <CardTitle className="font-headline text-3xl mt-4">Pedido Realizado com Sucesso!</CardTitle>
        <CardDescription>
          Obrigado pela sua compra! Em breve você receberá um email com os detalhes do seu pedido.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-secondary/50 rounded-lg p-6 space-y-4">
          <h3 className="font-bold text-lg text-center">Resumo do Pedido</h3>
          <div className="flex items-center gap-4">
             <div className="relative w-24 h-24 rounded-md overflow-hidden border bg-white shadow-inner shrink-0 checkerboard">
                {/* Cup color shape */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundColor: orderDetails.cupModel.colorHex,
                    opacity: orderDetails.cupModel.opacityType === 'Translúcido' ? 0.75 : 1.0,
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
                {/* Art */}
                 <div
                    className="absolute w-full h-full"
                    style={{
                        top: `${orderDetails.art.y}%`,
                        left: `${orderDetails.art.x}%`,
                        transform: `translate(-50%, -50%) scale(${orderDetails.art.scale}) rotate(${orderDetails.art.rotation}deg)`,
                    }}
                >
                    <Image src={orderDetails.art.imageUrl} alt="Arte escolhida" fill className="object-contain" />
                </div>
            </div>
            <div>
                <p><strong>{orderDetails.quantity}x</strong> {orderDetails.cupModel.name}</p>
                {(orderDetails.cupModel.colorName || orderDetails.cupModel.opacityType) && (
                    <p className="text-sm text-muted-foreground">{orderDetails.cupModel.colorName} {orderDetails.cupModel.opacityType}</p>
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
