"use client";

import { useTransition } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  CircleDot,
  MessageCircle,
  SearchCheck,
  XCircle,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/Pageheader";
import { TablePagination } from "@/components/layout/TablePagination";
import { SearchInput } from "@/components/layout/filters/SearchInput";
import { EmptyState } from "@/components/layout/filters/EmptyState";
import { FilterBar } from "@/components/layout/filters/FilterBar";
import { StatusFilterTabs } from "@/components/layout/filters/StatusFilterTabs";
import { FilterSelect } from "@/components/layout/filters/FilterSelect";

import { Button } from "@/components/ui/button";

import { PipelineRow } from "@/components/pipeline/pipelineRow";

import type {
  PipelineResult,
  PipelineStage,
} from "@/actions/pipeline/pipeline";

interface PipelineClientProps {
  pipeline: PipelineResult;
}

const baseStageOptions: Array<{ label: string; value: PipelineStage }> = [
  { label: "Triagem", value: "screening" },
  { label: "Aprovados", value: "approved" },
  { label: "Reprovados", value: "rejected" },
  { label: "Entrevista", value: "interview" },
];

const emptyStateByStage: Record<
  PipelineStage,
  {
    icon: typeof CircleDot;
    title: string;
    description: string;
  }
> = {
  new: {
    icon: CircleDot,
    title: "Nenhum candidato novo.",
    description: "Não existem candidatos novos.",
  },
  screening: {
    icon: SearchCheck,
    title: "Nenhum candidato em triagem.",
    description: "Não existem candidatos em triagem para o filtro atual.",
  },
  interview: {
    icon: MessageCircle,
    title: "Nenhum candidato em entrevista.",
    description: "Não existem candidatos na etapa de entrevista.",
  },
  approved: {
    icon: CheckCircle2,
    title: "Nenhum candidato aprovado.",
    description: "Não existem candidatos aprovados para o filtro atual.",
  },
  rejected: {
    icon: XCircle,
    title: "Nenhum candidato reprovado.",
    description: "Não existem candidatos reprovados para o filtro atual.",
  },
};

export function PipelineClient({ pipeline }: PipelineClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const stageOptions = baseStageOptions.map((option) => {
    const total =
      pipeline.stageCounts.find((item) => item.stage === option.value)?.total ??
      0;

    return {
      ...option,
      label: `${option.label} (${total})`,
    };
  });

  const emptyState = emptyStateByStage[pipeline.filters.stage];

  function updateFilter(key: string, value: string, resetPage = true): void {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === "all" || (key === "stage" && value === "screening")) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    if (resetPage) {
      params.delete("page");
    }

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <PageLayout
      header={
        <PageHeader
          title="Pipeline de Talentos"
          description="Acompanhe candidatos por etapa do processo seletivo."
          action={
            <FilterBar className="xl:flex-nowrap">
              <StatusFilterTabs
                value={pipeline.filters.stage}
                options={stageOptions}
                onChange={(value) => {
                  updateFilter("stage", value);
                }}
              />

              <SearchInput
                value={pipeline.filters.search}
                onChange={(value) => {
                  updateFilter("search", value);
                }}
                placeholder="Buscar candidato, e-mail ou vaga..."
              />

              <FilterSelect
                value={pipeline.filters.jobId}
                onChange={(value) => {
                  updateFilter("job", value);
                }}
                options={pipeline.jobOptions}
                ariaLabel="Filtrar por vaga"
              />

              <Button
                variant="outline"
                onClick={() => router.back()}
                className="h-10 gap-2 rounded-xl text-[10px] font-bold uppercase tracking-widest text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary"
              >
                <ArrowLeft size={16} />
                Voltar
              </Button>
            </FilterBar>
          }
        />
      }
      pagination={
        pipeline.total > pipeline.pageSize && (
          <TablePagination
            page={pipeline.page}
            totalPages={pipeline.totalPages}
            setPage={(nextPage) =>
              updateFilter("page", String(nextPage), false)
            }
            totalItems={pipeline.total}
            pageSize={pipeline.pageSize}
            itemLabel="candidatos"
          />
        )
      }
    >
      <div
        className="flex flex-col gap-3 pb-4 opacity-100 transition-opacity data-[pending=true]:opacity-60"
        data-pending={isPending}
      >
        {pipeline.items.length > 0 ? (
          pipeline.items.map((item) => (
            <PipelineRow key={item.id} item={item} />
          ))
        ) : (
          <EmptyState
            icon={emptyState.icon}
            title={emptyState.title}
            description={emptyState.description}
          />
        )}
      </div>
    </PageLayout>
  );
}
