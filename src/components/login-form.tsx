
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { handleCustomerLogin } from '@/app/actions';
import { Checkbox } from '@/components/ui/checkbox';

export function LoginForm({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    await handleCustomerLogin(formData);
    // This will likely not be reached due to redirect, which is fine.
  };

  return (
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
            <Input id="email" name="email" type="email" placeholder="seu@email.com" required disabled={isLoading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" name="password" type="password" required disabled={isLoading} />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
                <Checkbox id="remember-customer" name="remember" defaultChecked />
                <Label htmlFor="remember-customer">Lembrar-me</Label>
            </div>
            <Link href="#" className="text-sm text-primary hover:underline">
                Esqueceu a senha?
            </Link>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Entrar
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-center text-sm">
        <p>Não tem uma conta? <Link href="/register" className="text-primary hover:underline">Cadastre-se</Link></p>
      </CardFooter>
    </Card>
  );
}
