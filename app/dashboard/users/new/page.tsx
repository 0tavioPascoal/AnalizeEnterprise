"use client";

import { UserPlus } from "lucide-react";

import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/Pageheader";
import { UserForm } from "@/components/user/UserForm";
import { UserTips } from "@/components/user/UserTips";

export default function NewUserPage() {
  return (
    <PageLayout
      header={
        <PageHeader
          title="Cadastro de Usuário"
          description="Adicione novos membros com permissões específicas ao sistema"
          action={
            <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
              <UserPlus className="w-4 h-4 text-zinc-500" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                Novo Registro
              </span>
            </div>
          }
        />
      }
    >
      <div className="grid gap-6 lg:grid-cols-3 items-stretch h-full">
        <div className="lg:col-span-2">
          <UserForm />
        </div>

        <div className="hidden lg:block lg:col-span-1">
          <UserTips />
        </div>
      </div>
    </PageLayout>
  );
}