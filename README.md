# AnalizeEnterprise

Aplicação Next.js para análise de candidatos, gestão de vagas, pipeline e guias
de entrevista integrados ao Supabase e webhooks externos.

## Desenvolvimento

```bash
pnpm install
pnpm dev
```

A aplicação roda em `http://localhost:3000`.

## Qualidade

```bash
pnpm lint
pnpm typecheck
pnpm build
```

## Ambiente

Copie as chaves de `.env.example` para `.env.local` e preencha os valores do
projeto. A service role deve ficar apenas em variável privada:

```bash
SUPABASE_SERVICE_ROLE_KEY=
```

Nunca use prefixo `NEXT_PUBLIC_` para a service role.

## Supabase

O projeto remoto atual está configurado em `supabase/config.toml`.

```bash
pnpm supabase:link
pnpm supabase:types
pnpm supabase:pull
pnpm supabase:diff
```

Para gerar tipos a partir do projeto remoto, defina `SUPABASE_ACCESS_TOKEN` no
ambiente. Sem esse token, `types/supabase/database.ts` fica como baseline local
conservador alinhado ao uso atual da aplicação.
