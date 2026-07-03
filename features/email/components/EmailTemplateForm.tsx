"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Save,
  Eye,
  MailCheck,
  MailX,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { upsertEmailTemplate } from "@/features/email/server/mail-templates";

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
    return initialTemplates.find(
      (template) => template.type === selectedType,
    );
  }, [initialTemplates, selectedType]);

  const [subject, setSubject] = useState<string>(
    currentTemplate?.subject ?? DEFAULT_APPROVED_SUBJECT,
  );

  const [body, setBody] = useState<string>(
    currentTemplate?.body ?? DEFAULT_APPROVED_BODY,
  );

  const [showPreview, setShowPreview] =
    useState<boolean>(true);

  const [isPending, startTransition] =
    useTransition();

  function handleChangeType(
    type: CandidateEmailTemplateType,
  ): void {
    setSelectedType(type);

    const template = initialTemplates.find(
      (item) => item.type === type,
    );

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
      .replaceAll(
        "{{candidate_email}}",
        "exemplo@email.com",
      )
      .replaceAll("{{job_title}}", "Vaga teste")
      .replaceAll("{{company_name}}", "Empresa 01")
      .replaceAll("{{score}}", "50");
  }

  function handleInsertVariable(
    variable: string,
  ): void {
    setBody(
      (current) =>
        `${current}${
          current.endsWith(" ") ? "" : " "
        }${variable}`,
    );
  }

  function handleSubmit(): void {
    startTransition(async () => {
      try {
        await upsertEmailTemplate({
          type: selectedType,
          subject,
          body,
        });

        toast.success(
          "Template salvo com sucesso.",
        );
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
    <div className="grid min-h-full grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
      {/* LEFT */}
      <Card className="flex min-h-0 flex-col border-border bg-card text-card-foreground shadow-sm">
        <CardHeader className="shrink-0 border-b border-border">
          <CardTitle className="flex items-center gap-3 text-lg font-bold">
            {selectedType === "approved" ? (
              <MailCheck className="h-5 w-5 text-emerald-500" />
            ) : (
              <MailX className="h-5 w-5 text-red-500" />
            )}

            Template de e-mail
          </CardTitle>
        </CardHeader>

        <CardContent className="flex min-h-0 flex-1 flex-col p-4 sm:p-6">
          <div className="flex min-h-0 flex-1 flex-col gap-5">
            {/* TYPE */}
            <div className="grid shrink-0 grid-cols-1 gap-3 sm:grid-cols-2">
              <Button
                type="button"
                variant={
                  selectedType === "approved"
                    ? "default"
                    : "outline"
                }
                onClick={() =>
                  handleChangeType("approved")
                }
                className="h-10 justify-start gap-2 rounded-xl text-sm font-bold"
              >
                <MailCheck className="h-4 w-4" />
                Aprovação
              </Button>

              <Button
                type="button"
                variant={
                  selectedType === "rejected"
                    ? "default"
                    : "outline"
                }
                onClick={() =>
                  handleChangeType("rejected")
                }
                className="h-10 justify-start gap-2 rounded-xl text-sm font-bold"
              >
                <MailX className="h-4 w-4" />
                Reprovação
              </Button>
            </div>

            {/* SUBJECT */}
            <div className="shrink-0 space-y-2">
              <Label className="text-xs font-extrabold uppercase tracking-wide">
                Assunto
              </Label>

              <Input
                value={subject}
                onChange={(event) =>
                  setSubject(event.target.value)
                }
                className="h-10 rounded-xl text-sm font-medium"
              />
            </div>

            {/* BODY */}
            <div className="flex min-h-96 flex-1 flex-col space-y-2">
              <Label className="shrink-0 text-xs font-extrabold uppercase tracking-wide">
                Mensagem
              </Label>

              <Textarea
                value={body}
                onChange={(event) =>
                  setBody(event.target.value)
                }
                className="min-h-80 flex-1 resize-y rounded-xl text-sm leading-relaxed xl:resize-none"
              />
            </div>

            {/* VARIABLES */}
            <div className="shrink-0 space-y-3">
              <Label className="text-xs font-extrabold uppercase tracking-wide">
                Variáveis disponíveis
              </Label>

              <div className="flex flex-wrap gap-2">
                {VARIABLES.map((variable) => (
                  <Button
                    key={variable}
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      handleInsertVariable(variable)
                    }
                    className="h-8 rounded-lg font-mono text-xs font-bold"
                  >
                    {variable}
                  </Button>
                ))}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex shrink-0 flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setShowPreview(
                    (current) => !current,
                  )
                }
                className="h-10 w-full gap-2 rounded-xl text-sm font-bold sm:w-auto"
              >
                <Eye className="h-4 w-4" />

                {showPreview
                  ? "Ocultar preview"
                  : "Mostrar preview"}
              </Button>

              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isPending}
                className="h-10 w-full gap-2 rounded-xl text-sm font-bold sm:w-auto"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}

                {isPending
                  ? "Salvando..."
                  : "Salvar template"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* RIGHT */}
      {showPreview && (
        <Card className="flex min-h-96 flex-col border-border bg-card text-card-foreground shadow-sm">
          <CardHeader className="shrink-0 border-b border-border">
            <CardTitle className="text-lg font-bold">
              Preview
            </CardTitle>
          </CardHeader>

          <CardContent className="flex min-h-0 flex-1 flex-col gap-4 p-4 sm:p-5">
            <div className="shrink-0 rounded-xl border border-border bg-background p-4">
              <p className="text-xs font-extrabold uppercase tracking-wide text-muted-foreground">
                Assunto
              </p>

              <p className="mt-2 text-sm font-semibold text-foreground">
                {getPreviewText(subject)}
              </p>
            </div>

            <div className="min-h-80 flex-1 rounded-xl border border-border bg-background p-4">
              <p className="mb-3 text-xs font-extrabold uppercase tracking-wide text-muted-foreground">
                Corpo
              </p>

              <div className="custom-scrollbar h-full overflow-y-auto whitespace-pre-wrap pr-1 text-sm leading-6 text-foreground">
                {getPreviewText(body)}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
