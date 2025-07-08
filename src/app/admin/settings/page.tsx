
import { AdminPlaceholder } from "@/components/admin-placeholder";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, CreditCard, Truck, Users } from "lucide-react";

export default function AdminSettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Configurações da Loja</h1>
                <p className="text-muted-foreground">Gerencie as informações gerais da sua loja e integrações.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Building /> Detalhes da Loja</CardTitle>
                        <CardDescription>Edite o nome, endereço e informações de contato da sua loja.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AdminPlaceholder title="Detalhes da Loja" icon={Building} hideTitle />
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><CreditCard /> Pagamentos</CardTitle>
                        <CardDescription>Configure seus provedores de pagamento (Ex: Stripe, Mercado Pago).</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AdminPlaceholder title="Pagamentos" icon={CreditCard} hideTitle />
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Truck /> Frete e Entrega</CardTitle>
                        <CardDescription>Gerencie as zonas de entrega e opções de frete.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AdminPlaceholder title="Frete e Entrega" icon={Truck} hideTitle />
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Users /> Contas e Permissões</CardTitle>
                        <CardDescription>Gerencie os usuários administradores da sua loja.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AdminPlaceholder title="Contas e Permissões" icon={Users} hideTitle />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
