
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { redirect } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {

  async function handleLogin(formData: FormData) {
    'use server';
    const email = formData.get('email');
    const password = formData.get('password');

    // This is a prototype-only login.
    // In a real application, use a secure authentication provider.
    if (email === 'admin@coposmania.com' && password === '12345') {
      redirect('/admin/products');
    } else {
      redirect('/admin/login?error=true');
    }
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
            <form action={handleLogin} className="space-y-4">
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
