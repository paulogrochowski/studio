
import { Header } from '@/components/header';
import { LoginForm } from '@/components/login-form';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { AdminLoginButton } from '@/components/admin-login-button';

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <Header />
      <main className="flex-1 flex items-center justify-center container mx-auto p-4 md:p-8">
        <Card className="w-full max-w-md">
            <CardContent className="p-0">
                <LoginForm />
            </CardContent>
             <CardFooter className="flex flex-col items-center justify-center text-center text-sm gap-4 pt-4">
                <AdminLoginButton />
            </CardFooter>
        </Card>
      </main>
    </div>
  );
}
