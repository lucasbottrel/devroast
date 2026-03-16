# Specs

Criamos specs em `@specs/` antes de implementar features novas.

## Objetivo

- registrar a decisao da feature antes do codigo;
- alinhar escopo, trade-offs e rollout;
- deixar claro o que entra agora e o que fica para depois.

## Formato

Cada spec deve ser um `.md` com o minimo necessario, nesta ordem:

1. `# Titulo da feature`
2. `## Objetivo`
3. `## Contexto atual`
4. `## Recomendacao final` ou `## Decisao`
5. `## Escopo da primeira implementacao`
6. `## To-dos de implementacao`
7. `## Perguntas em aberto` se ainda existir alguma

## Regras

- ser conciso e pragmatico;
- documentar o por que, nao so o que;
- seguir o estado atual do produto e dos mocks;
- evitar overengineering e escopo de roadmap misturado com MVP;
- incluir alternativas so quando isso mudar a decisao.
