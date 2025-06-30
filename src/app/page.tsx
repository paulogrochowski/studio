'use client';
import { Header } from '@/components/header';
import { ImageEditor } from '@/components/art-gallery';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4">
        <ImageEditor />
      </main>
      <footer className="text-center py-4 text-sm text-muted-foreground border-t">
        Powered by AI
      </footer>
    </div>
  );
}
