
'use client';

import { ReactNode, useEffect } from 'react';
import { useTheme } from 'next-themes';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme('dark');
  }, [setTheme]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <main className="flex-1 p-4 sm:px-6 sm:py-4 md:gap-8">
        {children}
      </main>
    </div>
  );
}
