import { AnalyzeForm } from "@/components/analyze/AnalyzeForm";
import { AnalyzeTips } from "@/components/analyze/AnalyzeTips";

export default function AnalyzePage() {
  return (
    <div className="w-full space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Análise de Currículo</h1>

        <p className="text-muted-foreground text-sm">
          Compare candidatos com suas vagas automaticamente
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <AnalyzeForm />
        <AnalyzeTips />
      </div>
    </div>
  );
}
