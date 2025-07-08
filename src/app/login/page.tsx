
'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Loader } from '@/components/loader';

async function handleLoginAction(formData: FormData) {
    'use server';
    const { redirect } = await import('next/navigation');
    
    // Add a delay to make the loader visible for demonstration
    await new Promise(resolve => setTimeout(resolve, 1500));

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Admin user check
    if (email.toLowerCase() === 'admin@coposmania.com') {
      if (password === '12345') {
        redirect('/admin');
      } else {
        // Admin with wrong password
        redirect('/login?error=true');
      }
      return; // Important to prevent further execution
    }

    // Customer Login Simulation for prototype
    // In a real app, this would check against a database.
    // For now, any other non-empty credentials are treated as a successful customer login.
    if (email && password) {
        console.log(`Customer login simulation for ${email}`);
        redirect('/');
        return;
    }

    // Fallback for any other case (e.g., empty fields)
    redirect('/login?error=true');
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    await handleLoginAction(formData);
    // This will likely not be reached due to redirect, which is fine.
  };

  if (isLoading) {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm">
            <Loader message="Carregando..." showText={true} />
        </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <Header />
      <main className="flex-1 flex items-center justify-center container mx-auto p-4 md:p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Login</CardTitle>
            <CardDescription>Acesse sua conta ou o painel administrativo.</CardDescription>
          </CardHeader>
          <CardContent>
            {searchParams.error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro de Autenticação</AlertTitle>
                <AlertDescription>
                  Email ou senha incorretos. Tente novamente.
                </AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="seu@email.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">Entrar</Button>
            </form>
          </CardContent>
          <CardFooter className="text-center text-sm">
            <p>Não tem uma conta? <Link href="/register" className="text-primary hover:underline">Cadastre-se</Link></p>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
