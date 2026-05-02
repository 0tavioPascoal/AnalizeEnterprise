import { Briefcase, CheckCircle2 } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-5">
      {/* 60% - Branding Section */}
      <div className="hidden lg:flex col-span-3 bg-zinc-950 relative overflow-hidden flex-col justify-between p-12 text-white">
        
        {/* Efeito de Gradiente de Fundo (Aura) */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(39,39,42,1)_0%,rgba(9,9,11,1)_100%)] z-0" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-8">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">RH Analyzer</span>
          </div>

          <h2 className="text-4xl font-extrabold leading-tight tracking-tight lg:text-5xl max-w-xl">
            A nova era do recrutamento <span className="text-indigo-500">inteligente.</span>
          </h2>
          <p className="mt-6 text-zinc-400 text-lg max-w-md leading-relaxed">
            Poupe horas de triagem manual. Deixe nossa IA identificar os talentos que realmente importam para o seu time.
          </p>
        </div>

        <div className="relative z-10 space-y-8">
          {/* Social Proof / Quote Area */}
          <blockquote className="border-l-2 border-indigo-500 pl-6 py-2">
            <p className="text-zinc-300 italic text-lg">
              Reduzimos nosso tempo de contratação em 40% no primeiro mês de uso.
            </p>
            <footer className="mt-2 text-sm font-medium text-zinc-500">
              — Diretor de Operações, Tech Corp
            </footer>
          </blockquote>

          <div className="grid grid-cols-2 gap-4 text-sm font-medium text-zinc-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-500" /> Análise de CVs
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-500" /> IA Generativa
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-500" /> Matching Real-time
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-500" /> Dashboard de KPIs
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between pt-8 border-t border-zinc-800">
          <p className="text-xs text-zinc-500">
            © {new Date().getFullYear()} RH Analyzer. Todos os direitos reservados.
          </p>
          <div className="flex gap-4 text-xs text-zinc-500">
            <button className="hover:text-zinc-300 transition-colors">Suporte</button>
            <button className="hover:text-zinc-300 transition-colors">Privacidade</button>
          </div>
        </div>
      </div>

      {/* 40% - Form Section */}
      <div className="col-span-5 lg:col-span-2 flex flex-col items-center justify-center p-8 bg-zinc-50 dark:bg-zinc-950">
        <div className="w-full max-w-100 space-y-6">
          {/* Logo mobile-only */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <Briefcase className="w-8 h-8 text-indigo-600" />
            <span className="text-2xl font-bold">RH Analyzer</span>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  )
}