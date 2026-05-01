import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-background to-muted/40 px-6">
      
      <div className="text-center space-y-6 max-w-md">
        
        <FileX className="mx-auto opacity-50" size={48} />

        <h1 className="text-6xl font-bold tracking-tight">
          404
        </h1>

        <h2 className="text-xl font-semibold">
          Página não encontrada
        </h2>

        <p className="text-muted-foreground text-sm">
          Parece que você se perdeu. Vamos te colocar de volta no caminho certo.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Link href="/dashboard">
            <Button className="transition-all hover:scale-[1.03]">
              Ir para dashboard
            </Button>
          </Link>

          <Link href="/">
            <Button variant="outline">
              Início
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}
