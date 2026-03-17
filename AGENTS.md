# Diretrizes Globais do Projeto

## Objetivo
- Construir o devroast: app para analisar trechos de codigo com tom de humor/sarcasmo e ranking de "hall of shame".

## Stack e organizacao
- Next.js (App Router), TypeScript e Tailwind CSS v4.
- UI baseada em componentes reutilizaveis e composicao (`Componente.Root`, `Componente.*`).
- Exportacoes sempre nomeadas (sem `default export`).
- Features novas devem nascer com spec em `specs/` antes da implementacao.

## Arquitetura de app
- Componentes especificos de rota/pagina devem ficar em `src/app`, proximos de `page.tsx`/`layout.tsx`.
- `src/components` deve guardar apenas componentes reutilizaveis entre rotas ou features.
- Quando uma parte da tela existir so para uma pagina, preferir mover para a arvore da propria rota em vez de promover cedo demais para `src/components`.

## Dados e backend
- `tRPC` e a camada padrao de API/backend do projeto.
- `Drizzle` continua como camada de persistencia por tras das procedures do `tRPC`.
- Em App Router, preferir `Server Components` para leitura de dados quando isso simplificar a tela.
- Usar client components sem medo quando houver interatividade real, estado local ou animacao dependente do browser.

## Padroes de UI
- Tema principal dark com tokens de cor globais no CSS.
- Tipografia: `font-sans` para texto comum e `font-mono` para contexto de codigo/terminal.
- Componentes de comportamento usam primitives acessiveis (ex.: Base UI).
- Componentes server-only devem ficar separados de barrels client-safe.
- Para contadores/metricas animadas, preferir iniciar em `0` e animar para o valor carregado, em vez de suspense/skeleton quando a experiencia pedir continuidade visual.

## Qualidade
- Manter codigo simples e consistente; evitar API de props inflada quando composicao resolver melhor.
- Usar mocks por padrao enquanto nao houver integracao com API.
- Validar alteracoes com lint e build antes de finalizar.
