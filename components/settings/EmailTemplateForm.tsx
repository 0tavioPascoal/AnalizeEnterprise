"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { Save, Eye, MailCheck, MailX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { upsertEmailTemplate } from "@/actions/email/mail-templates";
import type {
  CandidateEmailTemplate,
  CandidateEmailTemplateType,
} from "@/types/email/email-template";

interface EmailTemplateFormProps {
  initialTemplates: CandidateEmailTemplate[];
}

const DEFAULT_APPROVED_SUBJECT =
  "Parabéns, você avançou no processo seletivo";

const DEFAULT_APPROVED_BODY = `Olá {{candidate_name}},

Temos uma boa notícia!

Você foi aprovado(a) para avançar no processo seletivo da vaga {{job_title}}.

Em breve entraremos em contato com os próximos passos.

Atenciosamente,
{{company_name}}`;

const DEFAULT_REJECTED_SUBJECT =
  "Atualização sobre seu processo seletivo";

const DEFAULT_REJECTED_BODY = `Olá {{candidate_name}},

Agradecemos muito seu interesse na vaga {{job_title}}.

Após análise do seu perfil, neste momento seguiremos com outros candidatos que estão mais alinhados aos requisitos da posição.

Desejamos sucesso em sua jornada profissional.

Atenciosamente,
{{company_name}}`;

const VARIABLES: string[] = [
  "{{candidate_name}}",
  "{{candidate_email}}",
  "{{job_title}}",
  "{{company_name}}",
  "{{score}}",
];

export function EmailTemplateForm({
  initialTemplates,
}: EmailTemplateFormProps) {
  const [selectedType, setSelectedType] =
    useState<CandidateEmailTemplateType>("approved");

  const currentTemplate = useMemo(() => {
    return initialTemplates.find((template) => template.type === selectedType);
  }, [initialTemplates, selectedType]);

  const [subject, setSubject] = useState<string>(
    currentTemplate?.subject ?? DEFAULT_APPROVED_SUBJECT,
  );

  const [body, setBody] = useState<string>(
    currentTemplate?.body ?? DEFAULT_APPROVED_BODY,
  );

  const [showPreview, setShowPreview] = useState<boolean>(true);
  const [isPending, startTransition] = useTransition();

  function handleChangeType(type: CandidateEmailTemplateType): void {
    setSelectedType(type);

    const template = initialTemplates.find((item) => item.type === type);

    if (template) {
      setSubject(template.subject);
      setBody(template.body);
      return;
    }

    if (type === "approved") {
      setSubject(DEFAULT_APPROVED_SUBJECT);
      setBody(DEFAULT_APPROVED_BODY);
      return;
    }

    setSubject(DEFAULT_REJECTED_SUBJECT);
    setBody(DEFAULT_REJECTED_BODY);
  }

  function getPreviewText(value: string): string {
    return value
      .replaceAll("{{candidate_name}}", "Exemplo")
      .replaceAll("{{candidate_email}}", "Exemplo@email.com")
      .replaceAll("{{job_title}}", "Vaga teste")
      .replaceAll("{{company_name}}", "Empresa 01")
      .replaceAll("{{score}}", "50");
  }

  function handleInsertVariable(variable: string): void {
    setBody((current) => `${current}${current.endsWith(" ") ? "" : " "}${variable}`);
  }

  function handleSubmit(): void {
    startTransition(async () => {
      try {
        await upsertEmailTemplate({
          type: selectedType,
          subject,
          body,
        });

        toast.success("Template salvo com sucesso.")
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Erro ao salvar template.";

        toast.error(message);
      }
    });
  }

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
      <Card className="border-border bg-card text-card-foreground shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            {selectedType === "approved" ? (
              <MailCheck className="h-5 w-5 text-emerald-500" />
            ) : (
              <MailX className="h-5 w-5 text-red-500" />
            )}
            Template de e-mail
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Button
              type="button"
              variant={selectedType === "approved" ? "default" : "outline"}
              onClick={() => handleChangeType("approved")}
              className="justify-start gap-2"
            >
              <MailCheck className="h-4 w-4" />
              Aprovação
            </Button>

            <Button
              type="button"
              variant={selectedType === "rejected" ? "default" : "outline"}
              onClick={() => handleChangeType("rejected")}
              className="justify-start gap-2"
            >
              <MailX className="h-4 w-4" />
              Reprovação
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Assunto do e-mail</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder="Digite o assunto do e-mail"
              className="bg-background text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">Mensagem</Label>
            <Textarea
              id="body"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="Digite a mensagem do e-mail"
              className="min-h-80 resize-none bg-background text-foreground"
            />
          </div>

          <div className="space-y-3">
            <Label>Variáveis disponíveis</Label>

            <div className="flex flex-wrap gap-2">
              {VARIABLES.map((variable) => (
                <Button
                  key={variable}
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => handleInsertVariable(variable)}
                  className="font-mono text-xs"
                >
                  {variable}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowPreview((current) => !current)}
              className="gap-2"
            >
              <Eye className="h-4 w-4" />
              {showPreview ? "Ocultar preview" : "Mostrar preview"}
            </Button>

            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isPending}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              {isPending ? "Salvando..." : "Salvar template"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {showPreview && (
        <Card className="border-border bg-card text-card-foreground shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Preview do e-mail
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Assunto
              </p>

              <p className="mt-1 font-medium text-foreground">
                {getPreviewText(subject)}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Corpo
              </p>

              <div className="mt-4 whitespace-pre-wrap text-sm leading-6 text-foreground">
                {getPreviewText(body)}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}