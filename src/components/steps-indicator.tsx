import { cn } from "@/lib/utils";

interface StepsIndicatorProps {
  currentStep: number;
  totalSteps: number;
  onStepClick?: (step: number) => void;
}

const steps = [
  "Modelo do Copo",
  "Personalize a Arte",
  "Revisão da Arte",
  "Orçamento e Compra",
];

export function StepsIndicator({ currentStep, onStepClick }: StepsIndicatorProps) {
  return (
    <div className="w-full mb-8">
      <ol className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isCurrent = currentStep === stepNumber;

          return (
            <li 
              key={label} 
              className={cn(
                "flex items-center gap-3",
                isCompleted && onStepClick && "cursor-pointer transition-opacity hover:opacity-80"
              )}
              onClick={() => isCompleted && onStepClick?.(stepNumber)}
            >
              <span
                className={`flex items-center justify-center w-8 h-8 rounded-full text-lg font-bold shrink-0
                  ${isCompleted ? 'bg-primary text-primary-foreground' : ''}
                  ${isCurrent ? 'bg-accent text-accent-foreground' : ''}
                  ${!isCompleted && !isCurrent ? 'bg-secondary text-secondary-foreground' : ''}
                `}
              >
                {isCompleted ? (
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
