import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-20">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          <h1 className="font-headline text-2xl sm:text-3xl font-bold tracking-wider text-primary uppercase">
            Copos Mania
          </h1>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
