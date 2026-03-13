# UI component patterns

Este arquivo define o padrao para criacao de componentes visuais reutilizaveis em `src/components/ui`.

## Regras gerais

- Usar **named exports** sempre. Nao usar `export default`.
- Componentes devem ficar em arquivos proprios dentro de `src/components/ui`.
- Preferir TypeScript estrito, sem `any`.
- Manter API consistente entre componentes (`variant`, `size`, `className`, etc. quando fizer sentido).

## Variantes com tailwind-variants

- Usar `tv` para modelar estilos base e variantes.
- Tipar variantes com `VariantProps<typeof componentVariants>`.
- Para componentes baseados em `tv`, **nao usar `twMerge` externamente**.
- Passar `className` direto no `tv`, por exemplo:

```tsx
className={buttonVariants({ variant, size, className })}
```

- Usar `defaultVariants` para defaults de API.
- Usar `compoundVariants` para combinacoes de estado/variante.

## Fontes

- Para texto tradicional, usar `font-sans` (fonte padrao de sistema via `--font-sans`).
- Para texto monospaced, usar `font-mono` (JetBrains Mono como primeira opcao via `--font-mono`).
- Nao criar classes de fonte custom como `font-primary` e `font-secondary`.

## Tipagem de elementos nativos

- Sempre estender as props nativas do elemento HTML correspondente.
- Exemplo para botao:

```tsx
export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}
```

- Definir `type="button"` como padrao quando o elemento for `button` para evitar submit acidental em formularios.

## Estrutura recomendada

1. Imports de tipos/bibliotecas
2. `const <component>Variants = tv({...})`
3. `interface <Component>Props ...`
4. `export function <Component>(props) { ... }`

## Qualidade

- Rodar `pnpm lint` apos criar/alterar componentes.
- Preservar consistencia visual com os tokens e referencias do projeto (ex.: base vinda do Pencil quando aplicavel).
