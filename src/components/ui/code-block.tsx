import "server-only";

import { type BundledLanguage, codeToHtml } from "shiki";
import { tv, type VariantProps } from "tailwind-variants";

export const codeBlockVariants = tv({
  base: "w-full overflow-hidden border border-border bg-input",
  variants: {
    size: {
      md: "max-w-[560px]",
      full: "max-w-full",
    },
  },
  defaultVariants: {
    size: "full",
  },
});

export interface CodeBlockProps extends VariantProps<typeof codeBlockVariants> {
  code: string;
  lang: BundledLanguage;
  fileName?: string;
  className?: string;
}

export async function CodeBlock({
  code,
  lang,
  fileName,
  size,
  className,
}: CodeBlockProps) {
  const html = await codeToHtml(code, {
    lang,
    theme: "vesper",
  });

  return (
    <figure className={codeBlockVariants({ size, className })}>
      <figcaption className="flex h-10 items-center gap-3 border-b border-border px-4">
        <span
          className="size-2.5 rounded-full bg-accent-red"
          aria-hidden="true"
        />
        <span
          className="size-2.5 rounded-full bg-accent-amber"
          aria-hidden="true"
        />
        <span
          className="size-2.5 rounded-full bg-accent-green"
          aria-hidden="true"
        />
        <span className="ml-auto font-mono text-xs text-fg-subtle">
          {fileName ?? `snippet.${lang}`}
        </span>
      </figcaption>
      <div
        className="[&_.shiki]:m-0 [&_.shiki]:overflow-x-auto [&_.shiki]:bg-transparent [&_.shiki]:p-4 [&_.shiki]:font-mono [&_.shiki]:text-[13px]"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Server-side Shiki output is trusted generated HTML.
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </figure>
  );
}
