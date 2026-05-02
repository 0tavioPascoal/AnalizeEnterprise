"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { LockKeyhole, Mail, Loader2 } from "lucide-react"; // Ícones para um toque profissional

import { login, LoginError } from "@/actions/login";

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
    <Card className="w-full max-w-[420px] border-zinc-200/50 shadow-2xl bg-white/80 backdrop-blur-sm">
      <CardHeader className="space-y-1 pb-8 text-center">
        <CardTitle className="text-3xl font-extrabold tracking-tight text-zinc-900">
          Entrar na conta
        </CardTitle>
        <p className="text-sm text-zinc-500">
          Digite suas credenciais para acessar o painel
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-zinc-700 font-medium ml-1">
              E-mail
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="nome@empresa.com"
                required
                className="pl-10 h-11 bg-zinc-50/50 border-zinc-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <Label htmlFor="password" className="text-zinc-700 font-medium">
                Senha
              </Label>
              <button type="button" className="text-xs text-indigo-600 hover:underline font-medium">
                Esqueceu a senha?
              </button>
            </div>
            <div className="relative">
              <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="pl-10 h-11 bg-zinc-50/50 border-zinc-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <Button 
            className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold rounded-lg transition-transform active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100" 
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
              <span className="w-full border-t border-zinc-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-zinc-400">RH Analyzer Platform</span>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}