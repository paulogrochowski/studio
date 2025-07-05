import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench } from "lucide-react";

interface AdminPlaceholderProps {
    title: string;
}

export function AdminPlaceholder({ title }: AdminPlaceholderProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center text-center py-16">
                <Wrench className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-bold">Funcionalidade em Desenvolvimento</h3>
                <p className="text-muted-foreground">Esta área está sendo construída e estará disponível em breve.</p>
            </CardContent>
        </Card>
    )
}
