import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AnalyzeTips() {
  return (
    <Card className="hidden lg:block">
      <CardHeader>
        <CardTitle>Como funciona</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <p>✔ Escolha uma vaga cadastrada</p>
        <p>✔ Envie o currículo do candidato</p>
        <p>✔ IA analisa compatibilidade</p>
        <p>✔ Resultado salvo automaticamente</p>

        <div className="pt-4 border-t">
          <p className="text-xs">
            O sistema compara habilidades, experiência e contexto da vaga.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
