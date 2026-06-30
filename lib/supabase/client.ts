import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/supabase/database";

/**
 * Helper para instanciar o Supabase em Client Components.
 * Utiliza as variáveis de ambiente públicas já definidas no seu projeto.
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing required Supabase public environment variables.");
  }

  return createBrowserClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
  );
}
