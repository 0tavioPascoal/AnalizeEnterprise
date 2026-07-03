"use client";

import { UploadCloud, FileText, X } from "lucide-react";
import { Label } from "@/components/ui/label";

interface FileUploadProps {
  file: File | null;
  setFile: (file: File | null) => void;
}

export function FileUpload({ file, setFile }: FileUploadProps) {
  return (
    <div className="space-y-3">
      <Label className="text-xs font-extrabold uppercase tracking-[0.14em] text-muted-foreground">
        Currículo do Candidato
      </Label>

      <div className="relative h-52 w-full">
        {!file ? (
          <label className="group flex h-full cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-muted/10 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/45 hover:bg-primary/5 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/15">
            <div className="flex flex-col items-center justify-center px-4 pb-6 pt-5 text-center">
              <div className="mb-4 rounded-2xl border border-primary/10 bg-primary/10 p-4 text-primary transition-all duration-300 group-hover:scale-105 group-hover:rotate-2">
                <UploadCloud size={30} />
              </div>

              <p className="mb-1 text-sm font-black text-foreground">
                Clique ou arraste o arquivo
              </p>

              <p className="text-xs font-semibold text-muted-foreground/80">
                Apenas PDF (Máx. 10MB)
              </p>
            </div>

            <input
              type="file"
              accept=".pdf"
              className="sr-only"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>
        ) : (
          <div className="flex h-full animate-in flex-col items-center justify-center rounded-2xl border border-primary/20 bg-primary/5 duration-300 fade-in zoom-in">
            <div className="mb-3 rounded-2xl border border-border/40 bg-card p-4 shadow-sm">
              <FileText className="text-primary" size={32} />
            </div>

            <div className="w-full px-4 text-center">
              <p className="mx-auto max-w-56 truncate text-sm font-black text-foreground">
                {file.name}
              </p>

              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground/80">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>

            <button
              type="button"
              onClick={() => setFile(null)}
              className="mt-4 flex items-center gap-2 rounded-xl border border-rose-500/15 bg-rose-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-rose-700 transition-all duration-200 hover:bg-rose-500/15 active:scale-95 dark:text-rose-300"
            >
              <X size={14} />
              Remover arquivo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
