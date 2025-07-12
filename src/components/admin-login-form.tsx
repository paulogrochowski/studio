
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { handleAdminLogin } from '@/app/actions';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useAdminLogin } from './admin-login-modal-provider';
import { AdminLoginButton } from './admin-login-button';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Entrar
        </Button>
    )
}

interface AdminLoginFormProps {
    onLoginSuccess?: () => void;
}

export function AdminLoginForm({ onLoginSuccess }: AdminLoginFormProps) {
    const [state, formAction] = useFormState(handleAdminLogin, { success: false, error: null });
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        if (state.success) {
            toast({
                title: "Login de Admin bem-sucedido!",
                description: "Bem-vindo ao painel.",
            });
            onLoginSuccess?.();
            router.push('/admin'); // Redirect to admin dashboard on success
        }
    }, [state.success, onLoginSuccess, router, toast]);

    return (
        <Card className="w-full max-w-md border-0 shadow-none">
            <CardHeader className="text-center">
                <CardTitle className="font-headline text-2xl">Acesso Restrito</CardTitle>
                <CardDescription>Use suas credenciais de administrador para acessar o painel.</CardDescription>
            </CardHeader>
            <CardContent>
                {state.error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Erro de Autenticação</AlertTitle>
                        <AlertDescription>
                            {state.error}
                        </AlertDescription>
                    </Alert>
                )}
                <form action={formAction} className="space-y-4">
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
                    <SubmitButton />
                </form>
            </CardContent>
        </Card>
    );
}
