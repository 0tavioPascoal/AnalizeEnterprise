import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/Pageheader";

import { EmailTemplateForm } from "@/components/settings/EmailTemplateForm";

import { getEmailTemplates } from "@/actions/email/mail-templates";

export default async function EmailTemplatesPage() {
  const templates = await getEmailTemplates();

  return (
    <PageLayout
      header={
        <PageHeader
          title="Templates de e-mail"
          description="Configure as mensagens enviadas aos candidatos aprovados e reprovados."
        />
      }
    >
      <EmailTemplateForm initialTemplates={templates} />
    </PageLayout>
  );
}