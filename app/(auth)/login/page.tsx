"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

import { login, LoginError } from "@/actions/login";

// =========================
// TYPES
// =========================
interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

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

      // 🔥 forma mais confiável no SSR + middleware
      window.location.href = "/dashboard";
    } catch (err: unknown) {
      const error = err as LoginError;

      toast.error(error.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md border shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl">Bem-vindo de volta</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input name="email" type="email" required />
          </div>

          <div className="space-y-2">
            <Label>Senha</Label>
            <Input name="password" type="password" required />
          </div>

          <Button className="w-full" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
