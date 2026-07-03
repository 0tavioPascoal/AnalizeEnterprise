import { redirect } from "next/navigation";
import { UserPlus } from "lucide-react";

import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { UserForm } from "@/features/users/components/UserForm";
import { UserTips } from "@/features/users/components/UserTips";
import { getCurrentProfile } from "@/features/auth/server/current-profile";

export default async function NewUserPage() {
  const currentProfile = await getCurrentProfile();

  if (!currentProfile) {
    redirect("/login");
  }

  return (
    <PageLayout
      header={
        <PageHeader
          title="Cadastro de Usuário"
          description="Adicione novos membros com permissões específicas ao sistema"
          action={
            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted px-3 py-1.5">
              <UserPlus className="h-4 w-4 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Novo Registro
              </span>
            </div>
          }
        />
      }
    >
      <div className="grid min-h-full items-stretch gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <UserForm
            currentUserId={currentProfile.id}
            currentUserRole={currentProfile.role}
            companyName={currentProfile.company_name ?? "Minha empresa"}
          />
        </div>

        <div className="hidden lg:col-span-1 lg:block">
          <UserTips />
        </div>
      </div>
    </PageLayout>
  );
}
