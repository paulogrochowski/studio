import { cn } from "@/lib/utils";

interface StepsIndicatorProps {
  currentStep: number;
  totalSteps: number;
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
    <div className="w-full mb-8">
      <ol className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isCurrent = currentStep === stepNumber;
          // A step is considered completed if the isStepCompleted function says so.
          // Fallback to original logic if the function isn't provided.
          const isCompleted = isStepCompleted ? isStepCompleted(stepNumber) : currentStep > stepNumber;
          
          // A step is clickable if an onClick handler is provided and the previous step is completed.
          const canBeClicked = onStepClick && (isStepCompleted ? isStepCompleted(stepNumber - 1) : stepNumber < currentStep);

          return (
            <li 
              key={label} 
              className={cn(
                "flex items-center gap-3",
                canBeClicked && "cursor-pointer transition-opacity hover:opacity-80"
              )}
              onClick={() => canBeClicked && onStepClick?.(stepNumber)}
            >
              <span
                className={`flex items-center justify-center w-8 h-8 rounded-full text-lg font-bold shrink-0
                  ${isCompleted && !isCurrent ? 'bg-primary text-primary-foreground' : ''}
                  ${isCurrent ? 'bg-accent text-accent-foreground' : ''}
                  ${!isCompleted && !isCurrent ? 'bg-secondary text-secondary-foreground' : ''}
                `}
              >
                {isCompleted && !isCurrent ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                ) : (
                  stepNumber
                )}
              </span>
              <span className={`font-medium ${isCurrent ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
