"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShieldCheck,
  Users,
  Key,
  Info,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export function UserTips() {
  return (
    <Card className="hidden h-full flex-col overflow-hidden border border-border bg-card shadow-sm lg:flex">
      <CardHeader className="shrink-0 border-b border-border py-5">
        <CardTitle className="flex items-center gap-2 text-base font-extrabold uppercase tracking-wide text-primary">
          <Info className="h-5 w-5" />
          Gestão de Acessos
        </CardTitle>
      </CardHeader>

      <CardContent className="custom-scrollbar flex-1 space-y-8 overflow-y-auto p-6 xl:p-8">
        <div className="space-y-5">
          <h4 className="text-sm font-extrabold uppercase tracking-wide text-muted-foreground">
            Níveis de Permissão
          </h4>

          <div className="space-y-6">
            <TipItem
              icon={<ShieldCheck className="text-indigo-600 dark:text-indigo-400" size={22} />}
              title="Administrador"
              desc="Controle total sobre usuários, configurações e faturamento do sistema."
            />

            <TipItem
              icon={<Users className="text-blue-600 dark:text-blue-400" size={22} />}
              title="Recrutador (RH)"
              desc="Acesso completo ao scanner de IA, gestão de vagas e análise de candidatos."
            />

            <TipItem
              icon={<Key className="text-amber-500 dark:text-amber-400" size={22} />}
              title="Gestor de Área"
              desc="Visualiza apenas as análises e candidatos das vagas sob sua responsabilidade."
            />
          </div>
        </div>

        <div className="space-y-5 border-t border-border pt-6">
          <h4 className="text-sm font-extrabold uppercase tracking-wide text-muted-foreground">
            Segurança de Dados
          </h4>

          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-sm leading-relaxed text-foreground/80">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
              <span>
                Utilize preferencialmente e-mails corporativos (@empresa.com).
              </span>
            </li>

            <li className="flex items-start gap-3 text-sm leading-relaxed text-foreground/80">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-indigo-500 dark:text-indigo-400" />
              <span>
                Novos usuários receberão um link de ativação por e-mail para
                definir a senha.
              </span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

interface TipItemProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

function TipItem({ icon, title, desc }: TipItemProps) {
  return (
    <div className="flex gap-4">
      <div className="mt-1 shrink-0">{icon}</div>

      <div className="space-y-1">
        <p className="text-base font-bold text-foreground">
          {title}
        </p>

        <p className="text-sm leading-relaxed text-muted-foreground">
          {desc}
        </p>
      </div>
    </div>
  );
}
