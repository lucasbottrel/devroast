import "server-only";

import { type BundledLanguage, codeToHtml } from "shiki";
import { tv, type VariantProps } from "tailwind-variants";

export const codeBlockVariants = tv({
  base: "w-full overflow-hidden border border-border bg-input [&_.line]:block [&_.line]:whitespace-pre [&_.shiki]:m-0 [&_.shiki]:overflow-x-auto [&_.shiki]:bg-transparent [&_.shiki]:font-mono [&_.shiki]:text-[13px] [&_.shiki]:whitespace-normal",
  variants: {
    size: {
      md: "max-w-[560px]",
      full: "max-w-full",
    },
    showLineNumbers: {
      true: "[&_.shiki]:p-0 [&_.line]:relative [&_.line]:min-h-5 [&_.line]:pr-4 [&_.line]:pl-14 [&_.line]:py-[3px] [&_.line::before]:absolute [&_.line::before]:top-0 [&_.line::before]:bottom-0 [&_.line::before]:left-0 [&_.line::before]:box-border [&_.line::before]:w-10 [&_.line::before]:border-r [&_.line::before]:border-border [&_.line::before]:bg-surface [&_.line::before]:pr-2 [&_.line::before]:pt-[3px] [&_.line::before]:text-right [&_.line::before]:text-xs [&_.line::before]:text-fg-subtle [&_.line::before]:content-[attr(data-line)]",
      false: "[&_.shiki]:p-4",
    },
  },
  defaultVariants: {
    size: "full",
    showLineNumbers: false,
  },
});

export interface CodeBlockProps extends VariantProps<typeof codeBlockVariants> {
  code: string;
  lang: BundledLanguage;
  className?: string;
}

export async function CodeBlock({
  code,
  lang,
  size,
  showLineNumbers,
  className,
}: CodeBlockProps) {
  const html = await codeToHtml(code, {
    lang,
    theme: "vesper",
    transformers: [
      {
        line(node, line) {
          node.properties["data-line"] = String(line);
        },
      },
    ],
  });

  return (
    <figure className={codeBlockVariants({ size, showLineNumbers, className })}>
      <div
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Server-side Shiki output is trusted generated HTML.
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </figure>
  );
}
