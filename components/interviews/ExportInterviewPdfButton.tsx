"use client";

import { FileDown } from "lucide-react";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

import { Button } from "@/components/ui/button";

import type { InterviewGuideDetail } from "@/actions/interviews/getInterviewById";

interface ExportInterviewPdfButtonProps {
  interview: InterviewGuideDetail;
}

export function ExportInterviewPdfButton({
  interview,
}: ExportInterviewPdfButtonProps) {
  function handleExport() {
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
      title: "Critérios Finais de Decisão",
      text: content.final_recommendation_criteria,
      startY: currentY,
    });

    addFooter(doc);

    doc.save(fileName);
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleExport}
      className="h-10 rounded-xl text-sm font-bold"
    >
      <FileDown size={17} />
      Exportar PDF
    </Button>
  );
}

function addCover(
  doc: jsPDF,
  interview: InterviewGuideDetail,
): number {
  doc.setFillColor(24, 24, 27);
  doc.rect(0, 0, 210, 42, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("RH ANALYZER", 14, 16);

  doc.setFontSize(21);
  doc.text("Roteiro de Entrevista IA", 14, 30);

  doc.setTextColor(39, 39, 42);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  autoTable(doc, {
    startY: 52,
    body: [
      ["Candidato", interview.candidate_name ?? "-"],
      ["Vaga", interview.job_title ?? "-"],
      ["Senioridade", interview.job_seniority ?? "-"],
      ["Contrato", interview.job_contract_type ?? "-"],
      ["Status", interview.status ?? "-"],
      [
        "Match",
        interview.analysis_score !== null
          ? `${interview.analysis_score}%`
          : "-",
      ],
    ],
    theme: "plain",
    styles: {
      font: "helvetica",
      fontSize: 10,
      cellPadding: 2.6,
      textColor: [39, 39, 42],
    },
    columnStyles: {
      0: {
        fontStyle: "bold",
        cellWidth: 40,
        textColor: [82, 82, 91],
      },
      1: {
        cellWidth: 140,
      },
    },
    margin: { left: 14, right: 14 },
  });

  doc.setTextColor(0, 0, 0);

  return getFinalY(doc) + 16;
}

function addTextSection({
  doc,
  title,
  text,
  startY,
}: {
  doc: jsPDF;
  title: string;
  text?: string | null;
  startY: number;
}) {
  const value = text?.trim() || "Informação não gerada.";
  const lines = doc.splitTextToSize(value, 176);

  const neededSpace = 24 + lines.length * 5;
  const y = ensurePageSpace(doc, startY + 8, neededSpace);

  addSectionHeader(doc, title, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(63, 63, 70);
  doc.text(lines, 17, y + 15);

  doc.setTextColor(0, 0, 0);

  return y + 20 + lines.length * 5;
}

function addScorecardSection({
  doc,
  items,
  startY,
}: {
  doc: jsPDF;
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

  autoTable(doc, {
    startY: y + 12,
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
      cellPadding: 3,
      overflow: "linebreak",
      valign: "top",
      textColor: [39, 39, 42],
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

  return getFinalY(doc) + 8;
}

function addQuestionSection({
  doc,
  title,
  items,
  startY,
}: {
  doc: jsPDF;
  title: string;
  items: string[];
  startY: number;
}) {
  let y = ensurePageSpace(doc, startY + 8, 42);

  addSectionHeader(doc, title, y);

  if (items.length === 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(113, 113, 122);
    doc.text("Nenhuma pergunta gerada.", 17, y + 16);
    doc.setTextColor(0, 0, 0);

    return y + 28;
  }

  y += 15;

  items.forEach((item, index) => {
    const questionLines = doc.splitTextToSize(item, 166);
    const blockHeight = 12 + questionLines.length * 5;

    y = ensurePageSpace(doc, y, blockHeight + 8);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(79, 70, 229);
    doc.text(
      `PERGUNTA ${String(index + 1).padStart(2, "0")}`,
      17,
      y,
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(39, 39, 42);
    doc.text(questionLines, 17, y + 7);

    doc.setDrawColor(228, 228, 231);
    doc.line(17, y + blockHeight, 193, y + blockHeight);

    y += blockHeight + 8;
  });

  doc.setTextColor(0, 0, 0);

  return y + 2;
}

function addSectionHeader(
  doc: jsPDF,
  title: string,
  y: number,
) {
  doc.setFillColor(79, 70, 229);
  doc.roundedRect(14, y - 5, 182, 9, 2, 2, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text(title.toUpperCase(), 17, y + 1.5);

  doc.setTextColor(0, 0, 0);
}

function addFooter(doc: jsPDF) {
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

function ensurePageSpace(
  doc: jsPDF,
  y: number,
  neededSpace: number,
) {
  const bottomLimit = doc.internal.pageSize.height - 24;

  if (y + neededSpace > bottomLimit) {
    doc.addPage();
    return 22;
  }

  return y;
}

function getFinalY(doc: jsPDF) {
  const docWithTable = doc as jsPDF & {
    lastAutoTable?: {
      finalY?: number;
    };
  };

  return docWithTable.lastAutoTable?.finalY ?? 20;
}

function getWeights(totalItems: number): number[] {
  if (totalItems <= 0) return [];

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