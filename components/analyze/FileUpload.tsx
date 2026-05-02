"use client";

import { UploadCloud, FileText, X } from "lucide-react";
import { Label } from "@/components/ui/label";

interface FileUploadProps {
  file: File | null;
  setFile: (file: File | null) => void;
}

export function FileUpload({ file, setFile }: FileUploadProps) {
  return (
    <div className="space-y-2">
      <Label className="text-[11px] font-black uppercase tracking-widest text-zinc-400">
        Currículo do Candidato
      </Label>

      {/* Container com altura fixa para evitar o efeito de recolhimento */}
      <div className="h-52 w-full relative">
        {!file ? (
          <label className="group flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl h-full cursor-pointer hover:border-indigo-500/50 hover:bg-indigo-50/10 transition-all duration-200">
            <div className="flex flex-col items-center justify-center pb-6 pt-5">
              <div className="p-4 bg-indigo-50 dark:bg-indigo-500/10 rounded-full mb-3 group-hover:scale-110 transition-transform">
                <UploadCloud className="text-indigo-600" size={28} />
              </div>
              <p className="mb-2 text-sm text-zinc-700 dark:text-zinc-300 font-bold">
                Clique ou arraste o arquivo
              </p>
              <p className="text-xs text-zinc-500">Apenas PDF (Máx. 10MB)</p>
            </div>
            <input
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>
        ) : (
          <div className="flex flex-col items-center justify-center h-full border border-indigo-200 dark:border-indigo-500/30 rounded-xl bg-indigo-50/30 dark:bg-indigo-500/5 animate-in fade-in zoom-in duration-300">
            <div className="p-4 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm mb-3">
              <FileText className="text-indigo-600" size={32} />
            </div>
            <div className="text-center px-4 w-full">
              <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate mx-auto max-w-[200px]">
                {file.name}
              </p>
              <p className="text-[10px] text-zinc-500 uppercase font-medium">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            
            <button
              type="button"
              onClick={() => setFile(null)}
              className="mt-4 flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
            >
              <X size={14} />
              REMOVER ARQUIVO
            </button>
          </div>
        )}
      </div>
    </div>
  );
}