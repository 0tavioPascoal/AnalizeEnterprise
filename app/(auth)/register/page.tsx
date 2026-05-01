"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    await new Promise((r) => setTimeout(r, 1000));

    setLoading(false);
  }

  return (
    <Card className="w-full max-w-md shadow-lg border">

      <CardHeader>
        <CardTitle className="text-2xl">Criar conta</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label>Nome</Label>
            <Input required />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" required />
          </div>

          <div className="space-y-2">
            <Label>Senha</Label>
            <Input type="password" required />
          </div>

          <Button className="w-full" disabled={loading}>
            {loading ? "Criando..." : "Criar conta"}
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
