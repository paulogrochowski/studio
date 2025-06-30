import { Icons } from "./icons";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Icons.logo className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-headline tracking-tight text-primary">
            AI Image Editor
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <p className="hidden md:block text-sm text-muted-foreground">
            Describe your edits, let AI do the work.
          </p>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
