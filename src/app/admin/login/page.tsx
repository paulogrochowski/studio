
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Loader } from '@/components/loader';

async function handleLoginAction(formData: FormData) {
    'use server';
    const { redirect } = await import('next/navigation');
    
    // NOTE: Delay removed to improve prototype performance.
    // await new Promise(resolve => setTimeout(resolve, 1500));

    const email = formData.get('email');
    const password = formData.get('password');

    // This is a prototype-only login.
    if (email === 'admin@coposmania.com' && password === '12345') {
      redirect('/admin');
    } else {
      redirect('/admin/login?error=true');
    }
}


export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    
    // We get the redirection path from the server action
    await handleLoginAction(formData);
    
    // The browser will be redirected by Next.js, but in case of an error
    // or other scenarios, we can stop the loading state.
    // This part of the code might not be reached if redirect() works as expected.
    const error = new URLSearchParams(window.location.search).get('error');
    if (error) {
        setIsLoading(false);
        // We might need to manually refresh the page to show the error if Next.js doesn't
        router.refresh();
    }
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
            <CardTitle className="font-headline text-2xl">Acesso Restrito</CardTitle>
            <CardDescription>Faça login para gerenciar a loja.</CardDescription>
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
                <Input id="email" name="email" type="email" placeholder="admin@coposmania.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">Entrar</Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
