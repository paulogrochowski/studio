import type { Metadata } from 'next';
import { Oswald, Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from '@/components/theme-provider';
import { AdminLoginModalProvider } from '@/components/admin-login-modal-provider';
import { cookies } from 'next/headers';
import { AdminFloatingPanel } from '@/components/admin-floating-panel';

const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-oswald',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Copos Mania',
  description: 'Gere designs de copos personalizados com IA.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isAdminLoggedIn = cookies().has('admin-session');

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${oswald.variable} ${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AdminLoginModalProvider>
            {children}
            {isAdminLoggedIn && <AdminFloatingPanel />}
          </AdminLoginModalProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
