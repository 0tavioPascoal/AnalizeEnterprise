import { createBrowserClient } from "@supabase/ssr";

/**
 * Helper para instanciar o Supabase em Client Components.
 * Utiliza as variáveis de ambiente públicas já definidas no seu projeto.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}