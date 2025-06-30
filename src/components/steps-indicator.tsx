"use client";

import * as React from 'react';
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface StepsIndicatorProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
  isStepCompleted?: (stepNumber: number) => boolean;
}

const steps = [
  "Modelo do Copo",
  "Método de Criação",
  "Criação da Arte",
  "Revisão da Arte",
  "Orçamento e Compra",
];

export function StepsIndicator({ currentStep, onStepClick, isStepCompleted }: StepsIndicatorProps) {
  return (
    <TooltipProvider>
      <div className="w-full mb-12">
        <ol className="flex items-center w-full">
          {steps.map((label, index) => {
            const stepNumber = index + 1;
            const isCurrent = currentStep === stepNumber;
            const isCompleted = isStepCompleted ? isStepCompleted(stepNumber) : currentStep > stepNumber;
            const canBeClicked = !!onStepClick && !!isStepCompleted && isStepCompleted(stepNumber - 1);
            
            return (
              <React.Fragment key={label}>
                {index > 0 && (
                  <div className={cn("flex-auto border-t-2 transition-colors", isCompleted || isCurrent ? 'border-primary' : 'border-border')} />
                )}
                <li className="flex flex-col items-center shrink-0">
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => canBeClicked && onStepClick?.(stepNumber)}
                        disabled={!canBeClicked}
                        aria-label={`Passo ${stepNumber}: ${label}`}
                        className={cn(
                          "flex items-center justify-center w-8 h-8 rounded-full font-bold text-lg shrink-0 transition-all duration-300",
                          isCompleted || isCurrent ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground',
                          isCurrent && 'ring-4 ring-accent/50 scale-110',
                          canBeClicked && "cursor-pointer hover:scale-110"
                        )}
                      >
                        {isCompleted && !isCurrent ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          stepNumber
                        )}
                      </button>
                    </TooltipTrigger>
                    {!isCurrent && (
                        <TooltipContent>
                            <p>{label}</p>
                        </TooltipContent>
                    )}
                  </Tooltip>

                  {isCurrent && (
                     <div className="absolute top-full text-center mt-2 w-32">
                       <span className="font-bold text-primary text-sm whitespace-nowrap">{label}</span>
                     </div>
                  )}
                </li>
              </React.Fragment>
            );
          })}
        </ol>
      </div>
    </TooltipProvider>
  );
}
