export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-5">
      {/* 60% - Branding */}
      <div className="hidden lg:flex col-span-3 bg-zinc-900 text-white p-10 flex-col justify-between">
        <div>
          <h1 className="text-3xl font-bold">RH Analyzer</h1>
          <p className="mt-4 text-zinc-300 max-w-md">
            Automatize a triagem de currículos com inteligência artificial.
            Analise candidatos, identifique padrões e tome decisões mais rápidas
            e assertivas no recrutamento.
          </p>
        </div>

        <div className="space-y-4 text-sm text-zinc-400">
          <p>✔ Análise automática de CVs</p>
          <p>✔ Matching com vagas</p>
          <p>✔ Insights para RH</p>
        </div>

        <p className="text-xs text-zinc-500">
          © {new Date().getFullYear()} RH Analyzer
        </p>
      </div>

      {/* 40% - Form */}
      <div className="col-span-5 lg:col-span-2 flex items-center justify-center p-6 bg-background">
        {children}
      </div>
    </div>
  )
}
