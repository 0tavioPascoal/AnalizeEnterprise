# Supabase

Este diretório concentra a configuração local e o fluxo de schema do Supabase.

## Fluxo recomendado

1. Defina `SUPABASE_ACCESS_TOKEN` no ambiente local.
2. Rode `pnpm supabase:link` para vincular o projeto remoto.
3. Rode `pnpm supabase:types` sempre que o schema remoto mudar.
4. Use `pnpm supabase:pull` para materializar alterações remotas como migration local.
5. Use `pnpm supabase:diff` para auditar diferenças antes de subir mudanças.

O arquivo `types/supabase/database.ts` deve ser tratado como derivado do schema.
Enquanto o token do Supabase não estiver disponível, ele mantém uma base tipada
conservadora alinhada ao uso atual da aplicação.
