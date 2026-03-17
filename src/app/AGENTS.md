# App Router patterns

Este diretorio concentra codigo especifico de rotas do App Router.

## Organizacao

- componentes usados so por uma pagina devem ficar em `src/app`, perto da rota dona;
- `page.tsx` e `layout.tsx` devem permanecer enxutos, extraindo partes locais quando necessario;
- nao promover componentes para `src/components` se eles nao forem reutilizados fora da rota.

## Dados

- para leituras, preferir `Server Components` quando isso reduzir acoplamento e facilitar SSR;
- usar client components para estado local, eventos de formulario, animacoes e hooks do browser;
- quando uma secao usar query no client por decisao de UX, documentar o por que no proprio codigo pela estrutura do componente, nao por comentarios longos.

## Homepage

- a homepage pode usar um client component local para o editor e estados de input;
- metricas animadas da home devem iniciar em `0` e subir para o valor real com `NumberFlow`;
- para esse caso, nao usar suspense/skeleton como loading state principal das metricas.
