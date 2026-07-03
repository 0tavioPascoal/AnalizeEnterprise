"use client";

import { useTransition } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  CircleDot,
  LayoutGrid,
  List,
  MessageCircle,
  SearchCheck,
  XCircle,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { TablePagination } from "@/components/layout/TablePagination";
import { SearchInput } from "@/components/layout/filters/SearchInput";
import { EmptyState } from "@/components/layout/filters/EmptyState";
import { FilterBar } from "@/components/layout/filters/FilterBar";
import { StatusFilterTabs } from "@/components/layout/filters/StatusFilterTabs";
import { FilterSelect } from "@/components/layout/filters/FilterSelect";

import { Button } from "@/components/ui/button";

import { PipelineRow } from "@/features/pipeline/components/PipelineRow";
import { PipelineKanbanCard } from "@/features/pipeline/components/PipelineKanbanCard";

import type {
  PipelineKanbanResult,
  PipelineResult,
  PipelineStage,
  PipelineView,
} from "@/features/pipeline/server/pipeline";

interface PipelineClientProps {
  pipeline: PipelineResult | PipelineKanbanResult;
  view: PipelineView;
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

export function PipelineClient({ pipeline, view }: PipelineClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const isKanbanView = view === "kanban";
  const listPipeline = !isKanbanView ? (pipeline as PipelineResult) : null;
  const kanbanPipeline = isKanbanView
    ? (pipeline as PipelineKanbanResult)
    : null;

  const stageOptions = baseStageOptions.map((option) => {
    const total =
      pipeline.stageCounts.find((item) => item.stage === option.value)?.total ??
      0;

    return {
      ...option,
      label: `${option.label} (${total})`,
    };
  });

  const emptyState = listPipeline
    ? emptyStateByStage[listPipeline.filters.stage]
    : null;

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

  function updateView(nextView: PipelineView): void {
    const params = new URLSearchParams(searchParams.toString());

    if (nextView === "list") {
      params.set("view", nextView);
    } else {
      params.delete("view");
    }

    params.delete("page");

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <PageLayout
      contentClassName={isKanbanView ? "h-full" : undefined}
      header={
        <PageHeader
          title="Pipeline de Talentos"
          description="Acompanhe candidatos por etapa do processo seletivo."
          action={
            <FilterBar className="xl:flex-nowrap">
              {!isKanbanView && listPipeline && (
                <StatusFilterTabs
                  value={listPipeline.filters.stage}
                  options={stageOptions}
                  onChange={(value) => {
                    updateFilter("stage", value);
                  }}
                />
              )}

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

              <div className="flex h-10 shrink-0 rounded-xl border border-border bg-background p-1 shadow-sm">
                <Button
                  type="button"
                  variant={view === "list" ? "default" : "ghost"}
                  onClick={() => updateView("list")}
                  className="h-8 gap-2 rounded-lg px-3 text-[10px] font-bold uppercase tracking-widest"
                  aria-pressed={view === "list"}
                >
                  <List size={15} />
                  Lista
                </Button>

                <Button
                  type="button"
                  variant={view === "kanban" ? "default" : "ghost"}
                  onClick={() => updateView("kanban")}
                  className="h-8 gap-2 rounded-lg px-3 text-[10px] font-bold uppercase tracking-widest"
                  aria-pressed={view === "kanban"}
                >
                  <LayoutGrid size={15} />
                  Kanban
                </Button>
              </div>

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
        listPipeline &&
        listPipeline.total > listPipeline.pageSize && (
          <TablePagination
            page={listPipeline.page}
            totalPages={listPipeline.totalPages}
            setPage={(nextPage) =>
              updateFilter("page", String(nextPage), false)
            }
            totalItems={listPipeline.total}
            pageSize={listPipeline.pageSize}
            itemLabel="candidatos"
          />
        )
      }
    >
      {isKanbanView && kanbanPipeline ? (
        <div
          className="custom-scrollbar flex h-full min-h-[620px] gap-4 overflow-x-auto pb-4 opacity-100 transition-opacity data-[pending=true]:opacity-60"
          data-pending={isPending}
        >
          {kanbanPipeline.columns.map((column) => (
            <KanbanColumn key={column.stage} column={column} />
          ))}
        </div>
      ) : (
        <div
          className="flex flex-col gap-3 pb-4 opacity-100 transition-opacity data-[pending=true]:opacity-60"
          data-pending={isPending}
        >
          {listPipeline && listPipeline.items.length > 0 ? (
            listPipeline.items.map((item) => (
              <PipelineRow key={item.id} item={item} />
            ))
          ) : (
            emptyState && (
              <EmptyState
                icon={emptyState.icon}
                title={emptyState.title}
                description={emptyState.description}
              />
            )
          )}
        </div>
      )}
    </PageLayout>
  );
}

interface KanbanColumnProps {
  column: PipelineKanbanResult["columns"][number];
}

function KanbanColumn({ column }: KanbanColumnProps) {
  const config = emptyStateByStage[column.stage];
  const Icon = config.icon;

  return (
    <section className="flex min-h-0 w-[min(82vw,21rem)] shrink-0 flex-col rounded-2xl border border-border/70 bg-background/70 shadow-sm backdrop-blur-sm xl:w-auto xl:min-w-0 xl:flex-1">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border/70 p-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/10 bg-primary/10 text-primary">
            <Icon size={19} />
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-sm font-black text-foreground">
              {baseStageOptions.find((option) => option.value === column.stage)
                ?.label ?? "Etapa"}
            </h2>

            <p className="truncate text-xs font-medium text-muted-foreground">
              {column.total} candidato(s)
            </p>
          </div>
        </div>

        <span className="rounded-full border border-border bg-card px-2.5 py-1 text-xs font-black text-muted-foreground">
          {column.total}
        </span>
      </div>

      <div className="custom-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto p-3">
        {column.items.length > 0 ? (
          column.items.map((item) => (
            <PipelineKanbanCard key={item.id} item={item} />
          ))
        ) : (
          <div className="flex min-h-44 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 px-4 text-center">
            <Icon className="mb-3 h-8 w-8 text-muted-foreground" />

            <p className="text-sm font-bold text-foreground">{config.title}</p>

            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {config.description}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
