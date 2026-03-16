import type { HTMLAttributes } from "react";
import { tv } from "tailwind-variants";

export const codeBlockHeaderVariants = tv({
  base: "flex h-10 items-center gap-3 border-b border-border px-4 bg-input",
});

export interface CodeBlockHeaderProps extends HTMLAttributes<HTMLDivElement> {
  fileName: string;
}

export function CodeBlockHeader({
  fileName,
  className,
  ...props
}: CodeBlockHeaderProps) {
  return (
    <div className={codeBlockHeaderVariants({ className })} {...props}>
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
        {fileName}
      </span>
    </div>
  );
}
