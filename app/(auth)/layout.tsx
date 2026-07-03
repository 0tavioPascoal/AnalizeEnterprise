import type { ReactNode } from "react";
import {
  Activity,
  ArrowUpRight,
  Bot,
  BriefcaseBusiness,
  CheckCircle2,
  FileSearch,
  Gauge,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="grid h-dvh overflow-hidden bg-background text-foreground lg:grid-cols-[minmax(0,1.08fr)_minmax(420px,0.92fr)]">
      <section className="relative hidden overflow-hidden border-r border-border bg-zinc-950 text-white lg:flex">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(24,24,27,1)_0%,rgba(9,9,11,1)_58%,rgba(15,23,42,1)_100%)]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.7)_1px,transparent_1px)] [background-size:42px_42px]" />

        <div className="relative z-10 flex min-h-0 w-full flex-col justify-between gap-8 p-8 xl:p-10 2xl:p-12">
          <div className="min-h-0">
            <div className="mb-8 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/10 shadow-sm">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>

                <div>
                  <h1 className="text-xl font-black tracking-tight">
                    Analyzer
                  </h1>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/45">
                    Enterprise AI
                  </p>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-xs font-bold text-white/70">
                <Activity className="h-3.5 w-3.5 text-emerald-300" />
                Plataforma online
              </div>
            </div>

            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-white/65">
                <Bot className="h-3.5 w-3.5 text-sky-300" />
                IA para recrutamento
              </div>

              <h2 className="text-4xl font-black leading-[1.05] tracking-tight xl:text-5xl">
                Decida contratações com dados, velocidade e contexto.
              </h2>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/58">
                Centralize triagens, scores, entrevistas e pipeline em uma
                operação de RH mais previsível e orientada por IA.
              </p>
            </div>

            <ProductPreview />
          </div>

          <div className="grid shrink-0 grid-cols-3 gap-3 border-t border-white/10 pt-5">
            <FeatureStat label="CVs analisados" value="12k+" />
            <FeatureStat label="Tempo economizado" value="78%" />
            <FeatureStat label="Pipeline seguro" value="24/7" />
          </div>
        </div>
      </section>

      <section className="col-span-full flex min-h-0 items-center justify-center overflow-y-auto bg-muted/35 p-4 sm:p-6 lg:col-auto">
        <div className="w-full max-w-md">
          <div className="mb-5 flex items-center justify-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Sparkles className="h-5 w-5" />
            </div>

            <div>
              <span className="block text-xl font-black tracking-tight">
                Analyzer
              </span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                Enterprise AI
              </span>
            </div>
          </div>

          {children}
        </div>
      </section>
    </div>
  );
}

function ProductPreview() {
  return (
    <div className="mt-8 max-w-3xl rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-2xl shadow-black/20 backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-rose-300" />
          <div className="h-2.5 w-2.5 rounded-full bg-amber-300" />
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
        </div>

        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/55">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
          Secure workspace
        </div>
      </div>

      <div className="grid grid-cols-[0.9fr_1.1fr] gap-4">
        <div className="space-y-3">
          <PreviewMetric icon={FileSearch} label="Triagem IA" value="94%" />
          <PreviewMetric icon={Gauge} label="Score médio" value="82%" />
          <PreviewMetric icon={BriefcaseBusiness} label="Vagas ativas" value="18" />
        </div>

        <div className="rounded-xl border border-white/10 bg-black/20 p-3">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-white/45">
              Pipeline
            </p>
            <ArrowUpRight className="h-4 w-4 text-white/45" />
          </div>

          <div className="space-y-2">
            {["Triagem", "Aprovado", "Entrevista"].map((item, index) => (
              <div
                key={item}
                className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2"
              >
                <span className="text-sm font-bold text-white/78">{item}</span>
                <span className="text-xs font-black text-white/45">
                  {[24, 12, 8][index]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-3">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/8 text-sky-300">
        <Icon className="h-4 w-4" />
      </div>

      <p className="text-2xl font-black tracking-tight">{value}</p>
      <p className="mt-1 text-xs font-semibold text-white/45">{label}</p>
    </div>
  );
}

function FeatureStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.05] p-3">
      <div className="mb-2 flex items-center gap-2 text-emerald-300">
        <CheckCircle2 className="h-4 w-4" />
        <span className="text-[10px] font-black uppercase tracking-[0.18em]">
          Ativo
        </span>
      </div>

      <p className="text-xl font-black tracking-tight">{value}</p>
      <p className="mt-1 truncate text-xs font-medium text-white/45">{label}</p>
    </div>
  );
}
