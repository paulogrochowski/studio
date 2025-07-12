
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { handleAdminLogin } from '@/app/actions';
import { Checkbox } from '@/components/ui/checkbox';
import { useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface AdminLoginFormProps {
    onLoginSuccess?: () => void;
}

export function AdminLoginForm({ onLoginSuccess }: AdminLoginFormProps) {
    const { toast } = useToast();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const clientAction = async (formData: FormData) => {
        startTransition(async () => {
            try {
                const result = await handleAdminLogin(formData);
                if (result?.success) {
                    toast({
                        title: "Login de Admin bem-sucedido!",
                        description: "Bem-vindo ao painel.",
                    });
                    onLoginSuccess?.(); // This will close the modal
                    router.refresh(); // Refresh to ensure server components update
                }
            } catch (error: any) {
                toast({
                    title: "Erro de Autenticação",
                    description: error.message || "Credenciais inválidas.",
                    variant: "destructive",
                });
            }
        });
    }

    return (
        <Card className="w-full max-w-md border-0 shadow-none">
            <CardHeader className="text-center">
                <CardTitle className="font-headline text-2xl">Acesso Restrito</CardTitle>
                <CardDescription>Use suas credenciais de administrador para acessar o painel.</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={clientAction} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="admin@coposmania.com" required defaultValue="admin@coposmania.com" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Senha</Label>
                        <Input id="password" name="password" type="password" required defaultValue="12345" />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="remember" name="remember" defaultChecked />
                        <Label
                            htmlFor="remember"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Lembrar-me
                        </Label>
                    </div>
                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Entrar
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

    