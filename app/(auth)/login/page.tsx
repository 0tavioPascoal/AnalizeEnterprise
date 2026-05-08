"use client";

import { useState } from "react";

import {
  LockKeyhole,
  Mail,
  Loader2,
  ArrowRight,
} from "lucide-react";

import { toast } from "sonner";

import { login, LoginError } from "@/actions/auth/login";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [loading, setLoading] =
    useState<boolean>(false);

  async function handleLogin(
    e: React.FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData(
      e.currentTarget,
    );

    const payload = {
      email: String(
        formData.get("email") ?? "",
      ),
      password: String(
        formData.get("password") ?? "",
      ),
    };

    try {
      await login(payload);

      toast.success(
        "Login realizado com sucesso",
      );

      window.location.href = "/dashboard";
    } catch (err: unknown) {
      const error = err as LoginError;

      toast.error(
        error.message ||
          "Erro ao fazer login",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-2xl shadow-zinc-900/5 dark:border-zinc-800 dark:bg-zinc-900/90">
      
      {/* GLOW */}
      <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-indigo-500/10 via-indigo-500/5 to-transparent" />

      <div className="relative z-10 p-8 sm:p-10">
        
        {/* HEADER */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-300">
            RH Analyzer Enterprise
          </div>

          <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
            Bem-vindo de volta
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            Entre com suas credenciais para acessar
            sua central inteligente de recrutamento.
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >
          {/* EMAIL */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="ml-1 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400"
            >
              E-mail corporativo
            </Label>

            <div className="group relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-indigo-500" />

              <Input
                id="email"
                name="email"
                type="email"
                placeholder="nome@empresa.com"
                required
                className="h-12 rounded-2xl border-zinc-200 bg-zinc-50 pl-10 text-sm shadow-sm transition-all placeholder:text-zinc-400 focus-visible:ring-2 focus-visible:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-950"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="space-y-2">
            <div className="ml-1 flex items-center justify-between">
              <Label
                htmlFor="password"
                className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400"
              >
                Senha
              </Label>

              <button
                type="button"
                className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 transition-colors hover:text-indigo-500 dark:text-indigo-400"
              >
                Recuperar acesso
              </button>
            </div>

            <div className="group relative">
              <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-indigo-500" />

              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="h-12 rounded-2xl border-zinc-200 bg-zinc-50 pl-10 text-sm shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-950"
              />
            </div>
          </div>

          {/* BUTTON */}
          <Button
            disabled={loading}
            className="mt-2 h-12 w-full rounded-2xl bg-zinc-900 text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-zinc-900/10 transition-all hover:bg-zinc-800 active:scale-[0.99] dark:bg-indigo-600 dark:shadow-indigo-500/20 dark:hover:bg-indigo-700"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Validando acesso
              </div>
            ) : (
              <div className="flex items-center gap-2">
                Acessar plataforma
                <ArrowRight className="h-4 w-4" />
              </div>
            )}
          </Button>

          {/* FOOTER */}
          <div className="relative pt-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-200 dark:border-zinc-800" />
            </div>

            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400 dark:bg-zinc-900 dark:text-zinc-600">
                RH Analyzer
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}