
import { Header } from '@/components/header';
import { LoginForm } from '@/components/login-form';
import { Card, CardContent } from '@/components/ui/card';

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <Header />
      <main className="flex-1 flex items-center justify-center container mx-auto p-4 md:p-8">
        <Card className="w-full max-w-md">
            <CardContent className="p-0">
                <LoginForm />
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
