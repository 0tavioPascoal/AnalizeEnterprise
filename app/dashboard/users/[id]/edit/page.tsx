import { notFound, redirect } from "next/navigation";

import { PageHeader } from "@/components/layout/PageHeader";
import { PageLayout } from "@/components/layout/PageLayout";
import { UserForm } from "@/features/users/components/UserForm";
import { UserTips } from "@/features/users/components/UserTips";

import { createServerClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/features/auth/server/current-profile";

interface EditUserPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { id } = await params;

  const supabase = await createServerClient();

  const currentProfile = await getCurrentProfile();

  if (!currentProfile) {
    redirect("/login");
  }

  if (!currentProfile.company_id) {
    redirect("/dashboard");
  }

  const { data: user, error } = await supabase
    .from("profiles")
    .select("id, name, email, role, company_id, status")
    .eq("id", id)
    .eq("company_id", currentProfile.company_id)
    .single();

  if (error || !user) {
    notFound();
  }

  return (
    <PageLayout
      header={
        <PageHeader
          title="Editar Usuário"
          description={`Editando: ${user.name ?? "Usuário sem nome"}`}
        />
      }
    >
      <div className="grid min-h-full gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <UserForm
            initialData={{
              ...user,
              name: user.name ?? "",
              email: user.email ?? "",
            }}
            isEdit
            currentUserId={currentProfile.id}
            currentUserRole={currentProfile.role}
            companyName={
              currentProfile.company_name ?? "Organização não identificada"
            }
          />
        </div>

        <div className="hidden lg:block">
          <UserTips />
        </div>
      </div>
    </PageLayout>
  );
}
