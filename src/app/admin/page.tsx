import { redirect } from "next/navigation";

export default function AdminPage() {
  // A página /admin agora redireciona para o dashboard por padrão
  redirect('/admin/dashboard');
}
