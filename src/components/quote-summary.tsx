
'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import type { OrderDetails } from '@/lib/types';
import Image from 'next/image';

interface QuoteSummaryProps {
  initialDetails: Omit<OrderDetails, 'quantity' | 'isUrgent' | 'total'>;
  onFinalize: (details: OrderDetails) => void;
}

const URGENCY_MULTIPLIER = 1.25;
const COMPLEXITY_PRICE_PER_POINT = 0.15;
const SHIPPING_COST = 15.0;

export function QuoteSummary({ initialDetails, onFinalize }: QuoteSummaryProps) {
  const [quantity, setQuantity] = useState(100);
  const [isUrgent, setIsUrgent] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const artPrice = initialDetails.artComplexity.score * COMPLEXITY_PRICE_PER_POINT;
    const baseTotal = (initialDetails.cupModel.basePrice + artPrice) * quantity;
    const urgencyCost = isUrgent ? baseTotal * (URGENCY_MULTIPLIER - 1) : 0;
    const finalTotal = baseTotal + urgencyCost + SHIPPING_COST;
    setTotal(finalTotal);
  }, [quantity, isUrgent, initialDetails]);
  
  const handleFinalize = () => {
    onFinalize({
      ...initialDetails,
      quantity,
      isUrgent,
      total,
    });
  }

  return (
    <Card className="bg-transparent border-none shadow-none">
      <CardHeader className="p-0 mb-4">
        <CardDescription>Revise os detalhes do seu pedido e finalize a compra.</CardDescription>
      </CardHeader>
      <CardContent className="p-0 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="relative w-24 h-24 rounded-md overflow-hidden border bg-secondary/50 shadow-inner shrink-0">
               <Image src={initialDetails.art.imageUrl} alt="Arte escolhida" fill className="object-contain p-2" />
               <div 
                  className="absolute inset-0 bg-no-repeat bg-contain bg-center opacity-20 pointer-events-none"
                  style={{ backgroundImage: `url(${initialDetails.cupModel.imageUrl})`}}
                ></div>
            </div>
            <div>
              <h3 className="font-bold">{initialDetails.cupModel.name}</h3>
              {(initialDetails.cupModel.colorName || initialDetails.cupModel.opacityType) && (
                <p className="text-sm text-muted-foreground">{initialDetails.cupModel.colorName} {initialDetails.cupModel.opacityType}</p>
              )}
              {initialDetails.cupModel.rimColor && initialDetails.cupModel.rimColor !== 'Nenhuma' && (
                <p className="text-sm text-muted-foreground">Borda: {initialDetails.cupModel.rimColor}</p>
              )}
              <p className="text-sm text-muted-foreground">Arte Personalizada</p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2"><strong>Descrição:</strong> {initialDetails.eventDescription}</p>
            </div>
          </div>
          <Separator />
          <div className="space-y-4">
            <div>
              <Label htmlFor="quantity" className="flex justify-between items-center mb-2">
                <span>Quantidade</span>
                <span className="text-primary font-bold text-lg">{quantity} unidades</span>
              </Label>
              <Slider
                id="quantity"
                min={10}
                max={500}
                step={10}
                value={[quantity]}
                onValueChange={(value) => setQuantity(value[0])}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label htmlFor="urgency">Pedido Urgente</Label>
                <p className="text-xs text-muted-foreground">
                  Receba seu pedido mais rápido (Taxa de {((URGENCY_MULTIPLIER-1)*100).toFixed(0)}%)
                </p>
              </div>
              <Switch id="urgency" checked={isUrgent} onCheckedChange={setIsUrgent} />
            </div>
          </div>
        </div>
        <div className="bg-secondary/50 rounded-lg p-6 space-y-4 flex flex-col">
           <h3 className="font-bold text-lg">Resumo do Orçamento</h3>
           <div className="space-y-2 flex-1">
            <div className="flex justify-between text-sm"><span>Copo ({initialDetails.cupModel.name})</span><span>R$ {initialDetails.cupModel.basePrice.toFixed(2)} / un.</span></div>
            <div className="flex justify-between text-sm"><span>Complexidade da Arte ({initialDetails.artComplexity.score}/10)</span><span>R$ {(initialDetails.artComplexity.score * COMPLEXITY_PRICE_PER_POINT).toFixed(2)} / un.</span></div>
            <div className="flex justify-between text-sm"><span>Quantidade</span><span>x{quantity}</span></div>
            {isUrgent && <div className="flex justify-between text-sm text-accent"><span>Taxa de Urgência</span><span>+ R$ {(((initialDetails.cupModel.basePrice + initialDetails.artComplexity.score * COMPLEXITY_PRICE_PER_POINT) * quantity) * (URGENCY_MULTIPLIER - 1)).toFixed(2)}</span></div>}
            <div className="flex justify-between text-sm"><span>Frete</span><span>R$ {SHIPPING_COST.toFixed(2)}</span></div>
           </div>
           <Separator />
           <div className="flex justify-between items-center">
            <span className="font-bold text-xl">Total</span>
            <span className="font-bold text-2xl text-primary">R$ {total.toFixed(2).replace('.', ',')}</span>
           </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end items-center mt-6 p-0">
        <Button onClick={handleFinalize} size="lg">
          Finalizar Compra
        </Button>
      </CardFooter>
    </Card>
  );
}
