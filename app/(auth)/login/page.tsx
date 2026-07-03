"use client";

import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { login, LoginError } from "@/features/auth/server/login";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [loading, setLoading] = useState<boolean>(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };

    try {
      await login(payload);
      toast.success("Login realizado com sucesso");
      window.location.href = "/dashboard";
    } catch (err: unknown) {
      const error = err as LoginError;
      toast.error(error.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-border bg-card shadow-xl shadow-foreground/5">
      <div className="border-b border-border bg-muted/35 px-6 py-5 sm:px-7">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Enterprise AI
          </div>

          <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-500/15 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
            <ShieldCheck className="h-4 w-4" />
          </div>
        </div>

        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
          Acesse sua operação
        </h1>

        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Entre para acompanhar triagens, entrevistas e decisões do seu pipeline
          de talentos.
        </p>
      </div>

      <div className="px-6 py-6 sm:px-7">
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-[11px] font-black uppercase tracking-[0.16em] text-muted-foreground"
            >
              E-mail corporativo
            </Label>

            <div className="group relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />

              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="nome@empresa.com"
                required
                className="h-11 rounded-xl border-border bg-background pl-10 text-sm shadow-sm transition focus-visible:ring-3 focus-visible:ring-primary/15"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Label
                htmlFor="password"
                className="text-[11px] font-black uppercase tracking-[0.16em] text-muted-foreground"
              >
                Senha
              </Label>

              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                Acesso seguro
              </span>
            </div>

            <div className="group relative">
              <LockKeyhole className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />

              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Digite sua senha"
                required
                className="h-11 rounded-xl border-border bg-background pl-10 text-sm shadow-sm transition focus-visible:ring-3 focus-visible:ring-primary/15"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded-xl text-sm font-black shadow-lg shadow-primary/15 transition active:scale-[0.99]"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Validando acesso
              </>
            ) : (
              <>
                Entrar no dashboard
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-5">
          <TrustItem label="Multiempresa" />
          <TrustItem label="IA Scanner" />
        </div>
      </div>
    </div>
  );
}

function TrustItem({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/30 px-3 py-2">
      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
      <span className="truncate text-xs font-bold text-muted-foreground">
        {label}
      </span>
    </div>
  );
}
