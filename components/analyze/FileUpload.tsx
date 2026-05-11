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
      <Label className="text-xs font-extrabold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        Currículo do Candidato
      </Label>

      <div className="relative h-52 w-full">
        {!file ? (
          <label className="group flex h-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-200 transition-all duration-200 hover:border-indigo-500/50 hover:bg-indigo-50/10 dark:border-zinc-800">
            <div className="flex flex-col items-center justify-center px-4 pb-6 pt-5 text-center">
              <div className="mb-4 rounded-full bg-indigo-50 p-4 transition-transform group-hover:scale-110 dark:bg-indigo-500/10">
                <UploadCloud className="text-indigo-600 dark:text-indigo-400" size={30} />
              </div>

              <p className="mb-2 text-base font-bold text-zinc-800 dark:text-zinc-100">
                Clique ou arraste o arquivo
              </p>

              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Apenas PDF (Máx. 10MB)
              </p>
            </div>

            <input
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>
        ) : (
          <div className="flex h-full animate-in flex-col items-center justify-center rounded-xl border border-indigo-200 bg-indigo-50/30 duration-300 fade-in zoom-in dark:border-indigo-500/30 dark:bg-indigo-500/5">
            <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm dark:bg-zinc-900">
              <FileText className="text-indigo-600 dark:text-indigo-400" size={34} />
            </div>

            <div className="w-full px-4 text-center">
              <p className="mx-auto max-w-56 truncate text-base font-bold text-zinc-900 dark:text-zinc-100">
                {file.name}
              </p>

              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>

            <button
              type="button"
              onClick={() => setFile(null)}
              className="mt-4 flex items-center gap-2 rounded-lg bg-rose-50 px-4 py-2 text-xs font-bold uppercase tracking-wide text-rose-600 transition-colors hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/15"
            >
              <X size={15} />
              Remover arquivo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}