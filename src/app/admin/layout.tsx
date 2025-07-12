
'use client';

import { ReactNode, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { AdminFooterMenu } from '@/components/admin-footer-menu';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme('dark');
  }, [setTheme]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <main className="flex-1 p-4 sm:p-6 md:p-8 pb-24">
        {children}
      </main>
      <AdminFooterMenu />
    </div>
  );
}
