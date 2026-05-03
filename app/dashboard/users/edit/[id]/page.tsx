import { PageHeader } from "@/components/layout/Pageheader";
import { PageLayout } from "@/components/layout/PageLayout";
import { UserForm } from "@/components/user/UserForm";
import { UserTips } from "@/components/user/UserTips";
import { createServerClient } from "@/lib/supabase/server"; // Verifique se o nome exportado é este
import { notFound } from "next/navigation";
// ... outros imports

export default async function EditUserPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // ✅ CORREÇÃO: Aguarde a criação do cliente
  const supabase = await createServerClient();
  
  const { id } = await params;

  const { data: user, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !user) {
    console.error("Erro na busca:", error);
    notFound();
  }

  return (
    <PageLayout
      header={<PageHeader title="Editar Usuário" description={`Editando: ${user.name}`} />}
    >
      <div className="grid gap-6 lg:grid-cols-3 items-stretch h-full">
        <div className="lg:col-span-2">
          <UserForm initialData={user} isEdit={true} />
        </div>
        <div className="hidden lg:block lg:col-span-1">
          <UserTips />
        </div>
      </div>
    </PageLayout>
  );
}