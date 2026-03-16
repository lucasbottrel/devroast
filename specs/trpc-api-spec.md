# TRPC como camada de API

## Objetivo

- adotar `tRPC` como camada de API/backend tipada do projeto;
- centralizar acesso a dados e regras de negocio em procedures;
- integrar com `Next.js App Router`, `SSR` e `Server Components` sem perder a DX do React Query.

## Contexto atual

- o projeto esta em `Next.js` App Router com `React 19` e `Next 16`;
- hoje os dados vivem em mocks locais e em funcoes diretas em `src/db/queries`;
- ja existe `Drizzle` configurado, entao o `tRPC` deve orquestrar o acesso ao banco, nao substituir a camada de persistencia;
- algumas telas ainda sao client-heavy, mas a direcao correta para dados e usar server components quando fizer sentido.

## Decisao

Usar `tRPC v11` com `TanStack React Query` como interface de dados do app.

Padrao adotado:

- `app/api/trpc/[trpc]/route.ts` com `fetchRequestHandler`;
- `src/trpc/init.ts` para `createTRPCContext`, `initTRPC` e helpers base;
- `src/trpc/routers/_app.ts` como router raiz e routers por dominio (`roasts`, `leaderboard`);
- `src/trpc/query-client.ts` para a factory do `QueryClient`;
- `src/trpc/client.tsx` como provider client-side montado no `layout`;
- `src/trpc/server.ts` com helpers server-only para prefetch em server components;
- `src/server/*` ou `src/features/*/server/*` para services consumidos pelas procedures.

Para `Server Components`, seguir o fluxo oficial:

1. a pagina server cria ou reutiliza o `QueryClient` da request;
2. faz `prefetchQuery(trpc.rota.queryOptions(input))`;
3. renderiza `HydrationBoundary` com `dehydrate(queryClient)`;
4. componentes client usam `useQuery` com `useTRPC()`.

Isso evita waterfalls no client e mantem a integracao correta com SSR do App Router.

## Escopo da primeira implementacao

- instalar `@trpc/server`, `@trpc/client`, `@trpc/tanstack-react-query`, `@tanstack/react-query`, `zod` e `superjson`;
- criar contexto base do `tRPC` com acesso a `db`, headers/cookies e metadados da request;
- expor o endpoint `/api/trpc` no App Router;
- criar provider global do React Query + tRPC no `src/app/layout.tsx`;
- criar helpers server-only para prefetch em `Server Components`;
- migrar as leituras iniciais de `home`, `leaderboard` e `roast/[id]` para routers `roasts` e `leaderboard`;
- manter `src/db/queries` como implementacao interna chamada pelas procedures neste primeiro passo.

## To-dos de implementacao

- [ ] adicionar dependencias do `tRPC` e `React Query`;
- [ ] criar `src/trpc/init.ts` com `createTRPCContext`, `createTRPCRouter` e `baseProcedure`;
- [ ] criar `src/trpc/routers/_app.ts` e routers por dominio;
- [ ] criar `app/api/trpc/[trpc]/route.ts` com `fetchRequestHandler`;
- [ ] criar `src/trpc/query-client.ts` com `staleTime` default e dehydration de queries pendentes;
- [ ] criar `src/trpc/client.tsx` com `TRPCProvider` client-safe;
- [ ] montar o provider no `src/app/layout.tsx`;
- [ ] criar `src/trpc/server.ts` com helper server-only para `getQueryClient` e factories de `queryOptions`;
- [ ] migrar queries de leitura atuais para procedures tipadas com `zod`;
- [ ] usar prefetch + hydration nas paginas server relevantes;
- [ ] manter mutations fora do escopo inicial, exceto se a submissao do roast entrar junto;
- [ ] rodar `pnpm lint` e `pnpm build` no fim.

## Perguntas em aberto

- a submissao de novo roast entra ja nesta etapa ou fica para a segunda iteracao;
- auth entra no contexto agora ou o contexto nasce anonimo e evolui depois;
- vamos adotar invalidacao por tags/utilitarios desde o inicio ou so quando entrarem mutations.

## Referencia oficial

- `https://trpc.io/docs/client/tanstack-react-query/server-components`
- `https://trpc.io/docs/client/tanstack-react-query/setup`

Essas docs definem o padrao base desta spec: provider client-side no layout, route handler no App Router e prefetch/hydration para `Server Components`.
