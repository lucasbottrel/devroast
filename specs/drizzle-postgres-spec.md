# Especificacao de dados para Drizzle ORM + PostgreSQL

## Objetivo

Definir a primeira camada de persistencia real do `devroast` usando `Drizzle ORM` com `PostgreSQL`, cobrindo:

- modelo de dados inicial do produto;
- enums necessarios para o MVP atual;
- organizacao de arquivos para `drizzle-kit`;
- plano de implantacao com `docker compose` para subir o banco localmente.

## Base usada para esta especificacao

Esta proposta foi montada a partir de duas fontes:

- `README.md`, que descreve o produto como um app para colar codigo, receber uma analise com humor/sarcasmo e exibir ranking `hall of shame`;
- layout no Pencil (`C:\Users\lucas\Downloads\devroast.pen`), especialmente as telas `Screen 1 - Code Input`, `Screen 2 - Roast Results`, `Screen 3 - Shame Leaderboard` e `Screen 4 - OG Image`.

## O que o layout mostra hoje

Pelo layout atual, o dominio minimo do produto ja pede persistencia para:

1. um snippet enviado pelo usuario;
2. metadados do envio, como linguagem, quantidade de linhas e toggle de `roast mode`;
3. um resultado agregado do roast, com score, tom geral e frases exibidas na tela de resultado/OG image;
4. uma lista de achados exibidos como cards (`critical`, `warning`, `good`);
5. uma lista ordenada de diff lines (`removed`, `added`, `context`);
6. consultas para leaderboard e metricas agregadas da home.

## Decisao de modelagem

Para o MVP, a melhor relacao custo x beneficio e usar uma tabela-raiz chamada `roasts` e duas tabelas filhas:

- `roasts`: guarda o input e o resultado agregado;
- `roast_findings`: guarda os cards de analise;
- `roast_diff_lines`: guarda o bloco de diff/sugestao.

Isso evita separar cedo demais `submission` e `result` em duas entidades diferentes, mas continua deixando espaco para evoluir depois para fila assincrona, multiplas tentativas ou historico de reprocessamento.

## O que nao precisa virar tabela agora

- `leaderboard`: deve nascer de query sobre `roasts`, nao de tabela dedicada;
- `og image`: deve usar dados de `roasts`, sem persistencia propria neste momento;
- `users`: o produto ainda nao mostra autenticacao, perfis ou ownership;
- `component library`: nao representa dominio de negocio.

## Enums propostos

### `roast_status`

Controla o ciclo de vida da analise.

- `pending`
- `processing`
- `completed`
- `failed`

### `roast_language`

Lista enxuta, alinhada ao produto atual e ao spec do editor com syntax highlight.

- `plaintext`
- `javascript`
- `typescript`
- `jsx`
- `tsx`
- `python`
- `sql`
- `bash`
- `json`

### `language_source`

Ja prepara o banco para a futura escolha `auto` vs `manual` descrita em `specs/editor-syntax-highlight-spec.md`.

- `auto`
- `manual`

### `score_tone`

Representa o tom visual usado no score ring, badges e leaderboard.

- `good`
- `warning`
- `critical`

### `finding_severity`

Mesmo conjunto visual dos cards de analise.

- `good`
- `warning`
- `critical`

### `diff_line_kind`

Representa o tipo de linha do bloco de diff.

- `context`
- `added`
- `removed`

## Tabelas

### `roasts`

Entidade central do produto. Cada linha representa um snippet enviado e o estado atual do roast.

Campos sugeridos:

| Campo | Tipo | Regras | Observacao |
| --- | --- | --- | --- |
| `id` | `uuid` | PK, `defaultRandom` | chave primaria |
| `source_code` | `text` | `not null` | snippet completo enviado |
| `snippet_preview` | `varchar(280)` | `not null` | resumo curto para leaderboard/home |
| `language` | enum `roast_language` | `not null`, default `plaintext` | linguagem resolvida |
| `language_source` | enum `language_source` | `not null`, default `auto` | auto/manual |
| `line_count` | `integer` | `not null` | numero de linhas do snippet |
| `roast_mode_enabled` | `boolean` | `not null`, default `true` | toggle da home |
| `status` | enum `roast_status` | `not null`, default `pending` | estado da analise |
| `score` | `numeric(4,1)` | nullable | preenchido ao completar |
| `score_tone` | enum `score_tone` | nullable | cor/tom visual do resultado |
| `verdict_label` | `varchar(64)` | nullable | ex.: `needs_serious_help` |
| `headline` | `text` | nullable | frase principal do roast |
| `summary` | `text` | nullable | resumo extra/descricao curta |
| `processing_error` | `text` | nullable | motivo da falha se `status = failed` |
| `completed_at` | `timestamp with time zone` | nullable | quando o roast terminou |
| `created_at` | `timestamp with time zone` | `not null`, `defaultNow` | auditoria |
| `updated_at` | `timestamp with time zone` | `not null`, `defaultNow` | auditoria |

Indices sugeridos:

- indice por `created_at desc` para telas recentes;
- indice por `status` para jobs/consultas administrativas;
- indice composto por `status`, `score`, `created_at` para leaderboard;
- indice por `language` para filtros futuros.

Observacoes:

- `snippet_preview` vale a pena ser persistido para evitar fazer `substring`/normalizacao toda vez na leaderboard;
- `verdict_label` fica como texto livre porque a interface usa frases mais editoriais do que um enum tecnico;
- `score` pode ser `numeric(4,1)` para preservar casa decimal como no layout.

### `roast_findings`

Tabela dos cards da secao `detailed_analysis`.

Campos sugeridos:

| Campo | Tipo | Regras | Observacao |
| --- | --- | --- | --- |
| `id` | `uuid` | PK, `defaultRandom` | chave primaria |
| `roast_id` | `uuid` | FK `roasts.id`, `not null`, `on delete cascade` | relacao pai-filho |
| `position` | `integer` | `not null` | ordem dos cards na tela |
| `severity` | enum `finding_severity` | `not null` | `good`, `warning`, `critical` |
| `title` | `varchar(160)` | `not null` | titulo do card |
| `description` | `text` | `not null` | corpo explicativo |
| `created_at` | `timestamp with time zone` | `not null`, `defaultNow` | auditoria |

Restricoes e indices:

- `unique (roast_id, position)` para preservar ordenacao sem duplicidade;
- indice por `roast_id`;
- indice opcional por `severity` se a UI ganhar filtros.

### `roast_diff_lines`

Tabela do bloco `suggested_fix`/diff.

Campos sugeridos:

| Campo | Tipo | Regras | Observacao |
| --- | --- | --- | --- |
| `id` | `uuid` | PK, `defaultRandom` | chave primaria |
| `roast_id` | `uuid` | FK `roasts.id`, `not null`, `on delete cascade` | relacao pai-filho |
| `position` | `integer` | `not null` | ordem da linha no diff |
| `kind` | enum `diff_line_kind` | `not null` | `context`, `added`, `removed` |
| `content` | `text` | `not null` | conteudo bruto da linha |
| `created_at` | `timestamp with time zone` | `not null`, `defaultNow` | auditoria |

Restricoes e indices:

- `unique (roast_id, position)`;
- indice por `roast_id`.

## Relacoes Drizzle esperadas

- `roasts` `hasMany` `roast_findings`
- `roasts` `hasMany` `roast_diff_lines`
- `roast_findings` `belongsTo` `roasts`
- `roast_diff_lines` `belongsTo` `roasts`

## Query shapes que este schema ja precisa suportar

### Home

- contar total de roasts concluidos;
- calcular media de score;
- buscar top 3 piores scores para preview da leaderboard.

### Resultado do roast

- buscar um `roast` por `id`;
- carregar `findings` ordenados por `position`;
- carregar `diff_lines` ordenadas por `position`.

### Leaderboard

- listar roasts com `status = completed` ordenados por `score asc`, depois `created_at desc`;
- opcionalmente filtrar por `language` no futuro.

## Estrutura de pastas recomendada

```text
src/
  db/
    client.ts
    schema/
      enums.ts
      roasts.ts
      roast-findings.ts
      roast-diff-lines.ts
      index.ts
    queries/
      roasts.ts
    seeds/
      seed.ts
drizzle/
drizzle.config.ts
docker-compose.yml
```

## Dependencias recomendadas

Com base na documentacao atual do Drizzle para PostgreSQL, a opcao mais segura aqui e usar `node-postgres`:

- runtime: `drizzle-orm`, `pg`
- dev: `drizzle-kit`, `@types/pg`, `dotenv`

## Configuracao recomendada do Drizzle

### `drizzle.config.ts`

Pontos importantes:

- `dialect: "postgresql"`;
- `schema: "./src/db/schema/index.ts"`;
- `out: "./drizzle"`;
- `dbCredentials.url` lendo `process.env.DATABASE_URL`.

### `src/db/client.ts`

Responsabilidades:

- inicializar `pg` com `DATABASE_URL`;
- exportar `db` com `drizzle({ client, schema })`;
- centralizar import do schema para relational queries.

## Docker Compose para PostgreSQL local

Criar `docker-compose.yml` com um unico servico `postgres`.

Configuracao recomendada:

- imagem `postgres:17-alpine`;
- `container_name: devroast-postgres`;
- porta local `5432:5432`;
- volume nomeado para persistencia;
- `healthcheck` com `pg_isready`;
- variaveis `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD` vindas de `.env`.

Variaveis esperadas em `.env.example`:

```env
POSTGRES_DB=devroast
POSTGRES_USER=devroast
POSTGRES_PASSWORD=devroast
POSTGRES_PORT=5432
DATABASE_URL=postgresql://devroast:devroast@localhost:5432/devroast
```

## Scripts recomendados no `package.json`

```json
{
  "db:generate": "drizzle-kit generate",
  "db:migrate": "drizzle-kit migrate",
  "db:studio": "drizzle-kit studio",
  "db:seed": "tsx src/db/seeds/seed.ts",
  "db:up": "docker compose up -d postgres",
  "db:down": "docker compose down"
}
```

Observacao: para `db:seed`, sera preciso adicionar `tsx` como dependencia de desenvolvimento ou trocar por outro runner de TS adotado no projeto.

## Workflow recomendado de migracao

Fluxo base, alinhado com a documentacao atual do Drizzle:

1. alterar arquivos de schema em `src/db/schema`;
2. rodar `pnpm db:generate` para gerar migration SQL em `drizzle/`;
3. subir o Postgres com `pnpm db:up`;
4. rodar `pnpm db:migrate` para aplicar migrations;
5. opcionalmente abrir `pnpm db:studio` para inspecao local.

## Seed inicial recomendada

Criar um seed pequeno com os mesmos exemplos mockados que ja aparecem na home/leaderboard:

- 3 a 5 `roasts` completos;
- `findings` para pelo menos um resultado detalhado;
- `diff_lines` para pelo menos um resultado detalhado.

Isso ajuda a substituir os mocks visuais sem depender da futura integracao de IA.

## Ordem sugerida de implantacao

### Fase 1 - Infra local

- [ ] Adicionar dependencias `drizzle-orm`, `pg`, `drizzle-kit`, `@types/pg`, `dotenv`.
- [ ] Criar `docker-compose.yml` com Postgres e volume persistente.
- [ ] Criar `.env.example` com `DATABASE_URL` e variaveis do Postgres.

### Fase 2 - Camada de banco

- [ ] Criar `drizzle.config.ts`.
- [ ] Criar `src/db/client.ts`.
- [ ] Criar `src/db/schema/enums.ts`.
- [ ] Criar tabelas `roasts`, `roast_findings` e `roast_diff_lines`.
- [ ] Exportar schema central em `src/db/schema/index.ts`.

### Fase 3 - Migrations e dados iniciais

- [ ] Gerar migration inicial com `pnpm db:generate`.
- [ ] Aplicar migration com `pnpm db:migrate`.
- [ ] Criar `seed.ts` com dados mockados equivalentes ao layout atual.
- [ ] Validar dados via `drizzle-kit studio`.

### Fase 4 - Integracao no app

- [ ] Substituir mocks da home por query real para preview do leaderboard e metricas agregadas.
- [ ] Substituir mocks de `/leaderboard` por query real ordenada por score.
- [ ] Preparar rota/acao server-side para criar novos `roasts`.
- [ ] Preparar carregamento do detalhe de um roast completo com findings e diff.

### Fase 5 - Documentacao e qualidade

- [ ] Atualizar `README.md` com setup do banco.
- [ ] Documentar comandos `db:*`.
- [ ] Rodar `pnpm lint` e `pnpm build` depois da implantacao.

## Decisoes de produto ja assumidas por esta especificacao

- Nao existe multi-usuario no MVP.
- Nao existe historico de varias analises para o mesmo snippet como conceito separado.
- Leaderboard e um recorte dos `roasts` concluidos, nao uma entidade propria.
- A persistencia deve suportar tanto o estado atual mockado quanto a futura evolucao do editor com deteccao de linguagem.

## Evolucoes previstas, mas fora do primeiro passo

Se o produto crescer, os proximos desdobramentos naturais sao:

- separar `roast_submissions` de `roast_results` caso haja fila assincrona;
- adicionar `provider`, `model`, `raw_response` e `analysis_version`;
- criar tabela de `tags` ou `categories` para findings;
- criar materialized view para leaderboard se volume crescer muito;
- adicionar ownership quando houver autenticacao.

## Recomendacao final

Para o estado atual do `devroast`, a implementacao inicial deve comecar com um schema pequeno e intencional:

- `roasts` como raiz do dominio;
- `roast_findings` e `roast_diff_lines` como detalhes do resultado;
- leaderboard derivada por query;
- Drizzle + `pg` + `drizzle-kit`;
- Postgres local via `docker compose`.

Essa base cobre o que ja esta desenhado no Pencil, substitui os mocks de forma progressiva e evita overengineering cedo demais.
