# Diretrizes Globais do Projeto

## Objetivo
- Construir o devroast: app para analisar trechos de codigo com tom de humor/sarcasmo e ranking de "hall of shame".

## Stack e organizacao
- Next.js (App Router), TypeScript e Tailwind CSS v4.
- UI baseada em componentes reutilizaveis e composicao (`Componente.Root`, `Componente.*`).
- Exportacoes sempre nomeadas (sem `default export`).

## Padroes de UI
- Tema principal dark com tokens de cor globais no CSS.
- Tipografia: `font-sans` para texto comum e `font-mono` para contexto de codigo/terminal.
- Componentes de comportamento usam primitives acessiveis (ex.: Base UI).
- Componentes server-only devem ficar separados de barrels client-safe.

## Qualidade
- Manter codigo simples e consistente; evitar API de props inflada quando composicao resolver melhor.
- Usar mocks por padrao enquanto nao houver integracao com API.
- Validar alteracoes com lint e build antes de finalizar.
