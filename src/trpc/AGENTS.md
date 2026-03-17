# tRPC patterns

Este diretorio define a integracao padrao de `tRPC` com o projeto.

## Estrutura

- `init.ts` centraliza `createTRPCContext`, `initTRPC` e helpers base;
- `routers/_app.ts` agrega routers por dominio;
- cada dominio deve ter seu proprio router pequeno e focado;
- `client.tsx` concentra provider e hooks client-safe;
- `server.tsx` concentra helpers server-only;
- `query-client.ts` define a configuracao compartilhada do `QueryClient`.

## Regras

- procedures do `tRPC` orquestram regras e chamam services/queries; nao duplicar acesso a banco na UI;
- manter routers pequenos, nomeados por dominio (`metrics`, `roasts`, `leaderboard`, etc.);
- inputs/outputs devem ser tipados e validados quando houver input externo;
- quando uma procedure precisar de consultas independentes, executar em paralelo com `await Promise.all(...)`;
- seguir o padrao do App Router com `app/api/trpc/[trpc]/route.ts` usando `fetchRequestHandler`.

## Client vs server

- para consumo em client components, usar `useTRPC()` + `useQuery`/`useMutation`;
- para leitura server-first, preferir helpers server-only do `tRPC` quando a tela realmente se beneficiar disso;
- se a UX pedir animacao progressiva no client, pode buscar direto no client em vez de forcar suspense/hydration complexos.
