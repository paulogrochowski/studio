import { Icons } from "./icons";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-10">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Icons.logo className="h-8 w-8 text-primary" />
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">
            Editor de Imagens AI
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
