
import { Header } from '@/components/header';
import { AdminLoginForm } from '@/components/admin-login-form';

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <Header />
      <main className="flex-1 flex items-center justify-center container mx-auto p-4 md:p-8">
        <AdminLoginForm searchParams={searchParams} />
      </main>
    </div>
  );
}
