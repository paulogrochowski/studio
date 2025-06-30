import { Icons } from './icons';

interface LoaderProps {
  message: string;
}

export function Loader({ message }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8 rounded-lg bg-card text-card-foreground shadow-lg border w-full max-w-md mx-auto my-12">
      <Icons.logo className="w-16 h-16 text-primary animate-pulse" />
      <div className="text-center">
        <h2 className="text-xl font-headline text-primary">Aguarde um momento...</h2>
        <p className="text-muted-foreground mt-2">{message}</p>
      </div>
    </div>
  );
}
