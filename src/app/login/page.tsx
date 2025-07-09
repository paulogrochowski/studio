
import { Header } from '@/components/header';
import { LoginForm } from '@/components/login-form';

export default function LoginPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <Header />
      <main className="flex-1 flex items-center justify-center container mx-auto p-4 md:p-8">
        <LoginForm searchParams={searchParams} />
      </main>
    </div>
  );
}
