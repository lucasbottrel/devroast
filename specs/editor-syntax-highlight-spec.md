# Editor com syntax highlight

## Objetivo

Construir um editor de codigo na homepage que:

- permita colar ou digitar codigo livremente;
- aplique syntax highlight no proprio campo de edicao;
- descubra a linguagem automaticamente;
- permita override manual da linguagem pelo usuario;
- preserve a estetica terminal/editor do devroast;
- seja leve o bastante para homepage e mobile.

## Contexto atual do projeto

- A homepage hoje usa `CodeInput` com `textarea` simples em `src/app/page.tsx`.
- O projeto ja possui `shiki` instalado e um `CodeBlock` server-side em `src/components/ui/code-block.tsx`.
- Isso reduz o custo de adotar uma stack centrada em Shiki tambem no editor.

## Pesquisa das opcoes

### Opcao 1 - `textarea` + camada visual highlighted por cima/baixo

**Como funciona**

- O input real continua sendo um `textarea`.
- Uma segunda camada renderiza o mesmo conteudo com highlight.
- O `textarea` fica transparente, mas mantem caret, selecao, colagem e acessibilidade nativa.

**Pontos fortes**

- Muito leve para homepage.
- UX excelente para colar snippets.
- Facil de controlar layout, line numbers, placeholder e visual custom.
- Menor custo de bundle que Monaco.
- Casa bem com a composicao atual do projeto.

**Pontos fracos**

- Exige sincronizar scroll, altura, tab, enter e indentacao manualmente.
- Recursos avancados de editor nao vem prontos.
- Se a implementacao for ingenua, pode haver flicker em textos grandes.

**Veredito**

- Melhor opcao para o devroast agora.

### Opcao 2 - CodeMirror 6

**Como funciona**

- Usa um editor real, modular e extensivel, com linguagem por extensoes.

**Pontos fortes**

- Excelente base para evoluir para selecao, historico, atalhos, plugins e lint futuro.
- Melhor ergonomia tecnica que montar tudo na mao.
- Mais leve e controlavel que Monaco.

**Pontos fracos**

- Mais complexo que o necessario para um MVP focado em colar snippet.
- O visual Ray.so-like fica menos direto do que no overlay com `textarea`.
- Deteccao automatica de linguagem nao vem pronta; continua sendo um problema separado.

**Veredito**

- Boa segunda melhor opcao se voces ja quiserem uma base de editor mais robusta.

### Opcao 3 - Monaco Editor

**Como funciona**

- Usa o editor do ecossistema VS Code, com workers e suporte amplo de linguagens.

**Pontos fortes**

- Editor mais completo.
- Excelente suporte a linguagens e features avancadas.

**Pontos fracos**

- Bundle e setup mais pesados para homepage.
- Overkill para o caso de uso principal do devroast.
- O look-and-feel do produto passa a girar em torno do Monaco, e nao da UI do app.

**Veredito**

- Nao recomendado para esta feature neste momento.

## O que o Ray.so faz e o que vale copiar

Pelo codigo aberto do Ray.so, o editor segue a abordagem de overlay:

- `Editor.tsx` usa `textarea` como camada de input real.
- `HighlightedCode.tsx` gera HTML highlighted separado.
- O `textarea` fica com texto transparente e o caret visivel.
- O highlight e feito com `Shiki`.
- A deteccao automatica de linguagem e feita com `highlight.js` (`highlightAuto`).
- Existe seletor manual de linguagem com opcao `Auto-Detect`.
- Linguagens do Shiki sao carregadas sob demanda.

### Licoes praticas do Ray.so

- Separar **input real** e **camada visual** simplifica muito a UX.
- `Shiki` entrega highlight bonito e consistente com temas.
- `highlight.js` resolve o auto-detect, mas nao deve ser tratado como verdade absoluta.
- O override manual e essencial para linguagens parecidas (`ts`/`tsx`, `js`/`jsx`, `json`/`js`, `bash`/`dockerfile`, etc).
- Lazy-loading de linguagens ajuda bundle e performance.

## Recomendacao final

Adotar uma arquitetura inspirada no Ray.so:

- `textarea` como fonte unica da verdade;
- highlight client-side em camada visual separada;
- `Shiki` para colorizacao;
- auto-detect com heuristica externa;
- seletor manual de linguagem na homepage.

### Stack recomendada

- **Highlight**: `shiki` (reaproveita dependencia ja instalada).
- **Auto-detect**: `highlight.js` ou heuristica equivalente com whitelist restrita.
- **UI**: evoluir o `CodeInput` atual para um `CodeEditor` composavel.

## Especificacao funcional

### Experiencia base

- O usuario cola codigo na homepage.
- O editor tenta detectar a linguagem automaticamente apos input/paste.
- O highlight aparece no proprio editor, sem trocar de tela.
- O usuario pode abrir um seletor e trocar a linguagem manualmente.
- Se nao houver confianca suficiente, o editor cai para `plaintext`.

### Comportamento de linguagem

- Estado de linguagem deve suportar dois modos: `auto` e `manual`.
- Em `auto`, toda alteracao relevante no snippet pode recalcular a linguagem.
- Em `manual`, a escolha do usuario nao deve ser sobrescrita pelo detector.
- Ao limpar o snippet, voltar para `auto + plaintext`.

### Regras recomendadas para auto-detect

- Detectar somente entre uma lista suportada pelo produto.
- Aplicar debounce curto apos digitar.
- Em paste, detectar imediatamente.
- Exigir minimo de caracteres/linhas antes de confiar no detector.
- Se o resultado for ambiguo, manter a linguagem anterior ou cair para `plaintext`.

## Arquitetura sugerida

### Componentes

- `CodeEditor.Root`
- `CodeEditor.Header`
- `CodeEditor.Toolbar`
- `CodeEditor.LanguageSelect`
- `CodeEditor.Body`
- `CodeEditor.Gutter`
- `CodeEditor.Textarea`
- `CodeEditor.HighlightLayer`

### Estado minimo

- `code: string`
- `languageMode: "auto" | "manual"`
- `detectedLanguage: SupportedLanguage | null`
- `manualLanguage: SupportedLanguage | null`
- `resolvedLanguage: SupportedLanguage | "plaintext"`
- `isDetectingLanguage: boolean`
- `isHighlightReady: boolean`

### Fluxo

1. Usuario cola ou digita no `textarea`.
2. O codigo atualiza o estado principal.
3. O detector infere a linguagem quando o modo for `auto`.
4. O editor resolve a linguagem final.
5. A camada visual re-renderiza com `Shiki`.
6. O seletor manual pode substituir a resolucao automatica.

## Decisoes tecnicas recomendadas

### 1. Reaproveitar `shiki`

- Ja existe no projeto.
- Ja combina com o `CodeBlock` atual.
- Permite alinhar tema do editor e preview futuro.

### 2. Nao usar Monaco agora

- O custo de bundle e setup nao se paga para homepage.
- A feature principal e colar snippet, nao editar um projeto inteiro.

### 3. Deixar CodeMirror como plano B estrategico

- Se a feature crescer para editor mais rico, ele e o melhor caminho de migracao.
- Mas para esta iteracao, a complexidade extra nao parece justificar.

### 4. Fazer lazy-load de linguagens

- Carregar base minima no primeiro render.
- Linguagens adicionais entram sob demanda.
- Evita penalizar usuarios que so colam JS, TS, Python, SQL, etc.

## UX recomendada para a homepage

- Manter o frame atual estilo terminal.
- Adicionar um seletor discreto no header do editor: `Auto` / linguagem atual.
- Exibir feedback sutil quando a linguagem vier do detector, ex.: `typescript (auto)`.
- Em mobile, o seletor deve virar trigger compacta, sem ocupar a largura toda.
- Nao mostrar excesso de controles agora; foco em colar, visualizar e enviar para roast.

## Riscos e mitigacoes

### Deteccao errada

- Mitigar com whitelist curta e fallback para `plaintext`.
- Sempre permitir override manual.

### Performance com snippets grandes

- Debounce na deteccao.
- Lazy-load de linguagens.
- Limite inicial de tamanho para highlight em tempo real, se necessario.

### Desalinhamento entre `textarea` e camada highlighted

- Garantir mesma fonte, line-height, padding, tab-size e quebra de linha nas duas camadas.
- Testar scroll, mobile e diferentes browsers cedo.

## Escopo da primeira implementacao

### Incluir

- highlight em tempo real;
- auto-detect de linguagem;
- seletor manual de linguagem;
- fallback para `plaintext`;
- integracao na homepage.

### Nao incluir agora

- autocomplete;
- linting;
- formatacao automatica;
- multi-file;
- minimap;
- diagnostics;
- diff editor.

## To-dos de implementacao

- [ ] Definir a lista oficial de linguagens suportadas no MVP.
- [ ] Criar um novo componente `CodeEditor` sem quebrar o `CodeInput` atual antes da migracao.
- [ ] Reaproveitar o visual atual da homepage para o frame do editor.
- [ ] Implementar camada de highlight separada do `textarea`.
- [ ] Sincronizar fonte, espacamento, altura automatica e scroll entre input e highlight.
- [ ] Implementar estado `auto` vs `manual` para linguagem.
- [ ] Integrar auto-detect com whitelist e fallback seguro.
- [ ] Adicionar seletor manual de linguagem no header/toolbar do editor.
- [ ] Fazer lazy-load das linguagens highlight mais pesadas.
- [ ] Validar acessibilidade basica: focus, teclado, aria-label e contraste.
- [ ] Validar UX mobile e desktop.
- [ ] Rodar `pnpm lint` e `pnpm build` ao final da implementacao.

## Perguntas em aberto

- O MVP deve suportar quantas linguagens logo de inicio: lista enxuta (JS/TS/TSX/JSX/Python/SQL/Bash/JSON) ou lista ampla?
- O seletor manual deve ficar sempre visivel ou aparecer so quando houver codigo no editor?
- O highlight deve atualizar a cada tecla ou pode usar debounce curto para snippets maiores?

## Conclusao

Para o devroast, a melhor direcao e **seguir o principio do Ray.so, nao necessariamente copiar toda a estrutura dele**:

- manter um editor visualmente customizado;
- usar `textarea` + camada highlighted;
- usar `Shiki` para cores;
- usar auto-detect com fallback prudente;
- oferecer selecao manual de linguagem como escape hatch.

Essa abordagem entrega o melhor equilibrio entre qualidade visual, custo de implementacao, bundle e aderencia ao produto atual.
