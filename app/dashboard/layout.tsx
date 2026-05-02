import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /* h-screen: trava a altura na resolução do monitor */
    /* overflow-hidden: impede que qualquer elemento "empurre" a tela para baixo */
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />

      {/* 
         flex-1: ocupa o restante da largura 
         h-full: garante que o main tenha a altura total disponível
         relative: importante para posicionamento de componentes internos
         overflow-hidden: garante que o scroll aconteça apenas nos cards internos, não aqui
      */}
      <main className="flex-1 h-full overflow-hidden relative bg-muted/40">
        {children}
      </main>
    </div>
  );
}