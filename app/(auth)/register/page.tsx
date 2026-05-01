"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Router from "next/router";

// 👇 IMPORTA SUA SERVER ACTION REAL
import { registerCompany } from "@/actions/register";

// =========================
// TYPES
// =========================
interface RegisterFormData {
  companyName: string;
  name: string;
  email: string;
  password: string;
}

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const routes = Router;

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload: RegisterFormData = {
      companyName: String(formData.get("companyName") || ""),
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
    };

    try {
      setLoading(true);

      // 🔥 CHAMADA REAL NO SUPABASE (AGORA VAI PRO NETWORK)
      await registerCompany(payload);

      toast.success("Empresa criada com sucesso!");

      routes.push("/login");

      form.reset();
    } catch (err) {
      console.error("REGISTER ERROR:", err);
      toast.error("Erro ao criar empresa");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md shadow-lg border">
      <CardHeader>
        <CardTitle className="text-2xl">Criar empresa</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleRegister} className="space-y-4">
          {/* COMPANY */}
          <div className="space-y-2">
            <Label>Nome da empresa</Label>
            <Input name="companyName" required placeholder="Ex: Acme Ltda" />
          </div>

          {/* USER NAME */}
          <div className="space-y-2">
            <Label>Seu nome</Label>
            <Input name="name" required placeholder="Ex: João Silva" />
          </div>

          {/* EMAIL */}
          <div className="space-y-2">
            <Label>Email</Label>
            <Input name="email" type="email" required />
          </div>

          {/* PASSWORD */}
          <div className="space-y-2">
            <Label>Senha</Label>
            <Input name="password" type="password" required />
          </div>

          <Button className="w-full" disabled={loading}>
            {loading ? "Criando empresa..." : "Criar empresa"}
          </Button>
        </form>

        <p className="mt-4 text-sm text-center text-muted-foreground">
          Já tem conta?{" "}
          <Link href="/login" className="underline">
            Entrar
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
