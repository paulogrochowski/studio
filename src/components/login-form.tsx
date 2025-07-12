'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { handleCustomerLogin } from '@/app/actions';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

export function LoginForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const clientAction = async (formData: FormData) => {
    startTransition(async () => {
        const result = await handleCustomerLogin(formData);
        if (result.success) {
            toast({
                title: "Login bem-sucedido!",
                description: "Bem-vindo de volta!",
            });
            router.push('/');
            router.refresh();
        } else {
            toast({
                title: "Erro de Autenticação",
                description: result.error,
                variant: "destructive",
            });
        }
    });
  };

  return (
    <Card className="w-full border-0 shadow-none">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Login</CardTitle>
        <CardDescription>Acesse sua conta para ver seus pedidos e favoritos.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={clientAction} className="space-y-4">
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
                <Checkbox id="remember-customer" name="remember-customer" defaultChecked />
                <Label htmlFor="remember-customer">Lembrar-me</Label>
            </div>
            <Link href="#" className="text-sm text-primary hover:underline">
                Esqueceu a senha?
            </Link>
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
