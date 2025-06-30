import { Icons } from './icons';

interface LoaderProps {
  message?: string;
}

export function Loader({ message = "Processando..." }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8 rounded-lg text-card-foreground w-full">
      <Icons.logo className="w-12 h-12 text-primary animate-spin" />
      <div className="text-center">
        <p className="text-muted-foreground mt-2">{message}</p>
      </div>
    </div>
  );
}
