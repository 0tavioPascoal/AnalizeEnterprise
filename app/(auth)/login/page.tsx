"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";


export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();


  async function handleLogin(e: React.FormEvent) {
  e.preventDefault();
  setLoading(true);

  await new Promise((r) => setTimeout(r, 1000));

  setLoading(false);

  router.push("/dashboard"); 
}

  return (
    <Card className="relative w-full max-w-md border shadow-xl backdrop-blur supports-backdrop-filter:bg-background/60">

      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold tracking-tight">
          Bem-vindo de volta
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Entre para acessar o RH Analyzer
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleLogin} className="space-y-5">
          
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="seu@email.com"
              className="h-10"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Senha</Label>
            <Input
              type="password"
              placeholder="••••••••"
              className="h-10"
              required
            />
          </div>

          <Button
            className="w-full h-10 text-sm font-medium transition-all hover:scale-[1.01]"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-2">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">ou</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Ação secundária */}
        <p className="text-sm text-center text-muted-foreground">
          Não tem conta?{" "}
          <Link
            href="/register"
            className="font-medium text-primary hover:underline"
          >
            Criar conta
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
