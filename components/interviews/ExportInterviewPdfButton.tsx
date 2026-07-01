"use client";

import { useState } from "react";

import { FileDown, Loader2 } from "lucide-react";
import type { jsPDF as JsPDF } from "jspdf";
import type { UserOptions } from "jspdf-autotable";

import { Button } from "@/components/ui/button";

import type { InterviewGuideDetail } from "@/actions/interviews/getInterviewById";

interface ExportInterviewPdfButtonProps {
  interview: InterviewGuideDetail;
}

type AutoTable = (doc: JsPDF, options: UserOptions) => void;

let autoTableFn: AutoTable | null = null;

export function ExportInterviewPdfButton({
  interview,
}: ExportInterviewPdfButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  async function handleExport() {
    try {
      setIsExporting(true);

      const [{ jsPDF }, { autoTable }] = await Promise.all([
        import("jspdf"),
        import("jspdf-autotable"),
      ]);

      autoTableFn = autoTable;

      const doc = new jsPDF();

      const content = interview.content;
      const candidateName = interview.candidate_name ?? "Candidato";
      const fileName = `entrevista-${slugify(candidateName)}.pdf`;

      let currentY = addCover(doc, interview);

      currentY = addTextSection({
        doc,
        title: "Resumo Executivo",
        text: content.summary,
        startY: currentY,
      });

      currentY = addTextSection({
        doc,
        title: "Objetivo da Entrevista",
        text: content.interview_objective,
        startY: currentY,
      });

      currentY = addScorecardSection({
        doc,
        items: content.scorecard ?? [],
        startY: currentY,
      });

      currentY = addQuestionSection({
        doc,
        title: "Perguntas Técnicas",
        items: content.technical_questions ?? [],
        startY: currentY,
      });

      currentY = addQuestionSection({
        doc,
        title: "Perguntas Comportamentais",
        items: content.behavioral_questions ?? [],
        startY: currentY,
      });

      currentY = addQuestionSection({
        doc,
        title: "Perguntas de Risco",
        items: content.risk_questions ?? [],
        startY: currentY,
      });

      currentY = addQuestionSection({
        doc,
        title: "Skills Ausentes",
        items: content.missing_skill_questions ?? [],
        startY: currentY,
      });

      addTextSection({
        doc,
        title: "Critério Final de Decisão",
        text: content.final_recommendation_criteria,
        startY: currentY,
      });

      addFooter(doc);

      doc.save(fileName);
    } catch (error) {
      console.error("Erro ao exportar PDF da entrevista:", error);
      window.alert("Não foi possível exportar o PDF da entrevista.");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <Button
      type="button"
      onClick={handleExport}
      disabled={isExporting}
      className="
        h-11 rounded-xl px-4
        text-sm font-black
        shadow-sm
        disabled:cursor-not-allowed disabled:opacity-70
      "
    >
      {isExporting ? (
        <Loader2 size={17} className="animate-spin" />
      ) : (
        <FileDown size={17} />
      )}

      {isExporting ? "Gerando PDF..." : "Exportar PDF"}
    </Button>
  );
}

function addCover(doc: JsPDF, interview: InterviewGuideDetail): number {
  const score =
    typeof interview.analysis_score === "number"
      ? `${Math.round(interview.analysis_score)}%`
      : "-";

  doc.setFillColor(24, 24, 27);
  doc.rect(0, 0, 210, 48, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("RH ANALYZER", 14, 16);

  doc.setFontSize(22);
  doc.text("Roteiro de Entrevista IA", 14, 31);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(212, 212, 216);
  doc.text("Documento gerado automaticamente para apoio à entrevista.", 14, 40);

  addAutoTable(doc, {
    startY: 58,
    body: [
      ["Candidato", interview.candidate_name ?? "-"],
      ["Vaga", interview.job_title ?? "-"],
      ["Senioridade", interview.job_seniority ?? "-"],
      ["Contrato", interview.job_contract_type ?? "-"],
      ["Status", interview.status ?? "-"],
      ["Match", score],
    ],
    theme: "plain",
    styles: {
      font: "helvetica",
      fontSize: 10.5,
      cellPadding: 3,
      textColor: [39, 39, 42],
      lineColor: [228, 228, 231],
      lineWidth: 0.1,
    },
    columnStyles: {
      0: {
        fontStyle: "bold",
        cellWidth: 42,
        fillColor: [250, 250, 250],
        textColor: [82, 82, 91],
      },
      1: {
        cellWidth: 138,
      },
    },
    margin: { left: 14, right: 14 },
  });

  doc.setTextColor(0, 0, 0);

  return getFinalY(doc) + 14;
}

function addTextSection({
  doc,
  title,
  text,
  startY,
}: {
  doc: JsPDF;
  title: string;
  text?: string | null;
  startY: number;
}) {
  const value = text?.trim() || "Informação não gerada.";
  const lines = doc.splitTextToSize(value, 176);

  const neededSpace = 24 + lines.length * 5.2;
  const y = ensurePageSpace(doc, startY + 8, neededSpace);

  addSectionHeader(doc, title, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(63, 63, 70);
  doc.text(lines, 17, y + 16);

  doc.setTextColor(0, 0, 0);

  return y + 22 + lines.length * 5.2;
}

function addScorecardSection({
  doc,
  items,
  startY,
}: {
  doc: JsPDF;
  items: {
    title: string;
    description: string;
    score_criteria: string;
  }[];
  startY: number;
}) {
  const y = ensurePageSpace(doc, startY + 8, 62);

  addSectionHeader(doc, "Scorecard Sugerido", y);

  const weights = getWeights(items.length);

  addAutoTable(doc, {
    startY: y + 13,
    head: [["Critério", "Peso", "Descrição", "Como avaliar"]],
    body:
      items.length > 0
        ? items.map((item, index) => [
            item.title,
            `${weights[index] ?? 0}%`,
            item.description,
            item.score_criteria,
          ])
        : [["-", "-", "Nenhum critério gerado.", "-"]],
    styles: {
      font: "helvetica",
      fontSize: 8.8,
      cellPadding: 3.2,
      overflow: "linebreak",
      valign: "top",
      textColor: [39, 39, 42],
      lineColor: [228, 228, 231],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [39, 39, 42],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250],
    },
    columnStyles: {
      0: { cellWidth: 42, fontStyle: "bold" },
      1: {
        cellWidth: 18,
        halign: "center",
        fontStyle: "bold",
      },
      2: { cellWidth: 56 },
      3: { cellWidth: 66 },
    },
    margin: { left: 14, right: 14 },
  });

  return getFinalY(doc) + 10;
}

function addQuestionSection({
  doc,
  title,
  items,
  startY,
}: {
  doc: JsPDF;
  title: string;
  items: string[];
  startY: number;
}) {
  let y = ensurePageSpace(doc, startY + 8, 42);

  addSectionHeader(doc, title, y);

  if (items.length === 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(113, 113, 122);
    doc.text("Nenhuma pergunta gerada.", 17, y + 17);
    doc.setTextColor(0, 0, 0);

    return y + 30;
  }

  y += 16;

  items.forEach((item, index) => {
    const questionLines = doc.splitTextToSize(item, 166);
    const blockHeight = 13 + questionLines.length * 5.4;

    y = ensurePageSpace(doc, y, blockHeight + 8);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(79, 70, 229);
    doc.text(`PERGUNTA ${String(index + 1).padStart(2, "0")}`, 17, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(39, 39, 42);
    doc.text(questionLines, 17, y + 8);

    doc.setDrawColor(228, 228, 231);
    doc.line(17, y + blockHeight, 193, y + blockHeight);

    y += blockHeight + 9;
  });

  doc.setTextColor(0, 0, 0);

  return y + 2;
}

function addSectionHeader(doc: JsPDF, title: string, y: number) {
  doc.setFillColor(79, 70, 229);
  doc.roundedRect(14, y - 5, 182, 10, 2, 2, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text(title.toUpperCase(), 17, y + 2);

  doc.setTextColor(0, 0, 0);
}

function addFooter(doc: JsPDF) {
  const generatedAt = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date());

  const pageCount = doc.getNumberOfPages();

  for (let page = 1; page <= pageCount; page++) {
    doc.setPage(page);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);

    doc.text("RH Analyzer", 14, doc.internal.pageSize.height - 10);

    doc.text(
      `Gerado em ${generatedAt}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: "center" },
    );

    doc.text(
      `Página ${page} de ${pageCount}`,
      doc.internal.pageSize.width - 14,
      doc.internal.pageSize.height - 10,
      { align: "right" },
    );
  }

  doc.setTextColor(0, 0, 0);
}

function ensurePageSpace(doc: JsPDF, y: number, neededSpace: number) {
  const bottomLimit = doc.internal.pageSize.height - 24;

  if (y + neededSpace > bottomLimit) {
    doc.addPage();
    return 22;
  }

  return y;
}

function getFinalY(doc: JsPDF) {
  const docWithTable = doc as JsPDF & {
    lastAutoTable?: {
      finalY?: number;
    };
  };

  return docWithTable.lastAutoTable?.finalY ?? 20;
}

function addAutoTable(doc: JsPDF, options: UserOptions): void {
  if (!autoTableFn) {
    throw new Error("PDF table generator was not loaded.");
  }

  autoTableFn(doc, options);
}

function getWeights(totalItems: number): number[] {
  if (totalItems <= 0) {
    return [];
  }

  const base = Math.floor(100 / totalItems);
  const remainder = 100 - base * totalItems;

  return Array.from({ length: totalItems }, (_, index) =>
    index === 0 ? base + remainder : base,
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}