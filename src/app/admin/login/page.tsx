
import { AdminLoginForm } from '@/components/admin-login-form';

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return <AdminLoginForm searchParams={searchParams} />;
}
