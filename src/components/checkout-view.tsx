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
             <div className="relative w-24 h-24 rounded-md overflow-hidden border bg-white shadow-inner shrink-0">
               <Image src={orderDetails.art.imageUrl} alt="Arte escolhida" fill className="object-contain p-2" />
               <div 
                  className="absolute inset-0 bg-no-repeat bg-contain bg-center opacity-20 pointer-events-none"
                  style={{ backgroundImage: `url(${orderDetails.cupModel.imageUrl})`}}
                ></div>
            </div>
            <div>
                <p><strong>{orderDetails.quantity}x</strong> {orderDetails.cupModel.name}</p>
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
