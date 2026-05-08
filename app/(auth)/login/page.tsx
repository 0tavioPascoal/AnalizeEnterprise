"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { LockKeyhole, Mail, Loader2 } from "lucide-react";

import { login, LoginError } from "@/actions/auth/login";

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
    /* Ajustado border e bg para serem adaptativos ao dark mode */
    <Card className="w-full max-w-105 border-zinc-200 dark:border-zinc-800 shadow-2xl bg-white dark:bg-zinc-900/90 backdrop-blur-sm">
      <CardHeader className="space-y-1 pb-8 text-center">
        <CardTitle className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
          Entrar na conta
        </CardTitle>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Digite suas credenciais para acessar o painel
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-zinc-700 dark:text-zinc-300 font-medium ml-1 text-xs uppercase tracking-widest">
              E-mail
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-4 w-4 text-zinc-400" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="nome@empresa.com"
                required
                className="pl-10 h-11 bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-zinc-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <Label htmlFor="password" className="text-zinc-700 dark:text-zinc-300 font-medium text-xs uppercase tracking-widest">
                Senha
              </Label>
              <button type="button" className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline font-bold uppercase tracking-tighter">
                Esqueceu a senha?
              </button>
            </div>
            <div className="relative">
              <LockKeyhole className="absolute left-3 top-3.5 h-4 w-4 text-zinc-400" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="pl-10 h-11 bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <Button 
            className="w-full h-11 bg-zinc-900 dark:bg-indigo-600 hover:bg-zinc-800 dark:hover:bg-indigo-700 text-white font-bold uppercase text-[10px] tracking-widest rounded-xl transition-all shadow-lg shadow-indigo-500/10 active:scale-[0.98]" 
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Validando...
              </div>
            ) : (
              "Acessar Sistema"
            )}
          </Button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-200 dark:border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.2em]">
              <span className="bg-white dark:bg-zinc-900 px-3 text-zinc-400 dark:text-zinc-600">RH Analyzer</span>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}