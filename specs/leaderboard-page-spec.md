# Leaderboard full page

## Objetivo

- substituir a `/leaderboard` estatica por uma pagina conectada ao backend real;
- seguir o mesmo modelo visual da home com card expansivel e syntax highlight;
- exibir os 20 piores snippets sem paginacao nesta primeira iteracao.

## Contexto atual

- a home ja consome `leaderboard.homePreview()` via `tRPC` em `src/app/home-leaderboard-section.tsx`;
- o banco ja possui queries para preview e metricas em `src/db/queries/roasts.ts`;
- `src/app/leaderboard/page.tsx` ainda renderiza dados mockados direto na rota;
- o produto ja usa `CodeBlock` server-side com `Shiki` e um collapsible local na home.

## Decisao

Usar uma pagina server-first com `getCaller()` e uma nova procedure `leaderboard.full()`.

Padrao adotado:

- `leaderboard.full()` retorna os 20 itens do ranking e as metricas do header em paralelo;
- a UI da rota reutiliza o modelo mental da home: linha fechada enxuta + codigo completo no collapsible;
- os componentes especificos da rota ficam em `src/app/leaderboard`;
- nao entra paginacao, filtro ou ordenacao configuravel agora.

## Escopo da primeira implementacao

- criar query dedicada para o leaderboard completo com `sourceCode`, `language`, `lineCount`, `score` e `scoreTone`;
- expor procedure `leaderboard.full()` no router atual;
- extrair componentes locais da rota para header, item e collapsible;
- trocar os mocks da pagina por dados reais do banco;
- mostrar metricas reais no topo: total de roasts concluidos e media de score;
- renderizar estado vazio quando nao houver itens.

## To-dos de implementacao

- [ ] adicionar query `getFullLeaderboard(20)` em `src/db/queries/roasts.ts`;
- [ ] adicionar procedure `leaderboard.full()` em `src/trpc/routers/leaderboard.ts`;
- [ ] criar componentes locais da rota em `src/app/leaderboard`;
- [ ] reescrever `src/app/leaderboard/page.tsx` para SSR com `getCaller()`;
- [ ] validar contagem fixa de 20 itens sem paginacao;
- [ ] validar estado vazio e collapsible com `CodeBlock`;
- [ ] rodar `pnpm lint` e `pnpm build`.

## Perguntas em aberto

- nenhuma para esta iteracao.
