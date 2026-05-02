import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function JobTips() {
  return (
    <Card className="hidden lg:block">
      <CardHeader>
        <CardTitle>Dicas</CardTitle>
      </CardHeader>

      <CardContent className="text-sm text-muted-foreground space-y-3">
        <p>✔ Seja objetivo nas hard skills</p>
        <p>✔ Defina um score mínimo realista</p>
        <p>✔ Use o contexto para detalhes importantes</p>

        <div className="pt-4 border-t">
          <p className="text-xs">
            O contexto será usado pela IA para complementar a análise do candidato.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
