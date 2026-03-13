import type { HTMLAttributes, PropsWithChildren } from "react";
import { tv, type VariantProps } from "tailwind-variants";

export const diffLineVariants = tv({
  base: "flex w-full items-start gap-2 px-4 py-2 font-mono text-[13px]",
  variants: {
    variant: {
      added: "bg-[#0A1A0F] text-fg",
      removed: "bg-[#1A0A0A] text-fg-muted",
      context: "bg-transparent text-fg-muted",
    },
  },
  defaultVariants: {
    variant: "context",
  },
});

const diffPrefixVariants = tv({
  base: "w-3 text-left",
  variants: {
    variant: {
      added: "text-accent-green",
      removed: "text-accent-red",
      context: "text-fg-subtle",
    },
  },
  defaultVariants: {
    variant: "context",
  },
});

export interface DiffLineRootProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof diffLineVariants> {}

function DiffLineRoot({
  className,
  variant,
  children,
  ...props
}: PropsWithChildren<DiffLineRootProps>) {
  return (
    <div className={diffLineVariants({ variant, className })} {...props}>
      {children}
    </div>
  );
}

export interface DiffLinePrefixProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof diffLineVariants> {}

function DiffLinePrefix({
  className,
  children,
  variant,
  ...props
}: DiffLinePrefixProps) {
  const fallbackPrefix =
    variant === "added" ? "+" : variant === "removed" ? "-" : " ";

  return (
    <span className={diffPrefixVariants({ variant, className })} {...props}>
      {children ?? fallbackPrefix}
    </span>
  );
}

export interface DiffLineCodeProps extends HTMLAttributes<HTMLSpanElement> {}

function DiffLineCode({ className, ...props }: DiffLineCodeProps) {
  return <span className={className} {...props} />;
}

export const DiffLine = {
  Root: DiffLineRoot,
  Prefix: DiffLinePrefix,
  Code: DiffLineCode,
};
