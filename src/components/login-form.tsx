
'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { handleCustomerLogin } from '@/app/actions';
import { Checkbox } from '@/components/ui/checkbox';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Entrar
        </Button>
    )
}

export function LoginForm({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Login</CardTitle>
        <CardDescription>Acesse sua conta para ver seus pedidos e favoritos.</CardDescription>
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
        <form action={handleCustomerLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="seu@email.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" name="password" type="password" required />
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
          <SubmitButton />
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-center justify-center text-center text-sm gap-2">
        <p>Não tem uma conta? <Link href="/register" className="text-primary hover:underline">Cadastre-se</Link></p>
        <p><Link href="/admin/login" className="text-xs text-muted-foreground hover:underline">Acessar painel de administrador</Link></p>
      </CardFooter>
    </Card>
  );
}
