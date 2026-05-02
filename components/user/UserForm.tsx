"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface UserFormData {
  name: string;
  email: string;
  password?: string;
  company: string;
}

interface Props {
  initialData?: UserFormData;
  onSubmit: (data: UserFormData) => Promise<void>;
  isEdit?: boolean;
}

const FIXED_COMPANY = "ACME Ltda";

export function UserForm({ initialData, onSubmit, isEdit }: Props) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<UserFormData>(
    initialData || {
      name: "",
      email: "",
      password: "",
      company: FIXED_COMPANY,
    }
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>
          {isEdit ? "Editar usuário" : "Cadastrar usuário"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="space-y-2">
            <Label>Empresa</Label>
            <Input value={form.company} disabled />
          </div>

          <div className="space-y-2">
            <Label>Nome</Label>
            <Input
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              required
            />
          </div>

          {!isEdit && (
            <div className="space-y-2">
              <Label>Senha</Label>
              <Input
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
              />
            </div>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading
                ? "Salvando..."
                : isEdit
                ? "Salvar alterações"
                : "Criar usuário"}
            </Button>
          </div>

        </form>
      </CardContent>
    </Card>
  );
}
