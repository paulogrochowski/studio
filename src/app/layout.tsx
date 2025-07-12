import type { Metadata } from 'next';
import { Oswald, Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from '@/components/theme-provider';
import { AdminLoginModalProvider } from '@/components/admin-login-modal-provider';

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

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${oswald.variable} ${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AdminLoginModalProvider>
              {children}
          </AdminLoginModalProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
