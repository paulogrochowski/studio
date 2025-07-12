import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function AdminDashboardPage() {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Bem-vindo ao seu Painel!</CardTitle>
          <CardDescription>
            Use o menu à esquerda para navegar pelas seções e gerenciar sua loja.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Esta é a sua área de trabalho. Aqui você poderá ver resumos de vendas, atividades recentes e atalhos para as tarefas mais comuns.</p>
        </CardContent>
      </Card>
    </div>
  );
}
