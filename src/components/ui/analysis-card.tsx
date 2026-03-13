import type { HTMLAttributes, PropsWithChildren } from "react";
import { tv, type VariantProps } from "tailwind-variants";

export const analysisCardVariants = tv({
  base: "flex w-full flex-col gap-3 border border-border bg-transparent p-5",
  variants: {
    variant: {
      default: "",
      elevated: "bg-surface",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface AnalysisCardRootProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof analysisCardVariants> {}

function AnalysisCardRoot({
  className,
  variant,
  children,
  ...props
}: PropsWithChildren<AnalysisCardRootProps>) {
  return (
    <article
      className={analysisCardVariants({ variant, className })}
      {...props}
    >
      {children}
    </article>
  );
}

export interface AnalysisCardHeaderProps
  extends HTMLAttributes<HTMLDivElement> {}

function AnalysisCardHeader({ className, ...props }: AnalysisCardHeaderProps) {
  return <div className={className} {...props} />;
}

export interface AnalysisCardTitleProps
  extends HTMLAttributes<HTMLHeadingElement> {}

function AnalysisCardTitle({ className, ...props }: AnalysisCardTitleProps) {
  return (
    <h3
      className={`font-mono text-[13px] text-fg ${className ?? ""}`}
      {...props}
    />
  );
}

export interface AnalysisCardDescriptionProps
  extends HTMLAttributes<HTMLParagraphElement> {}

function AnalysisCardDescription({
  className,
  ...props
}: AnalysisCardDescriptionProps) {
  return (
    <p
      className={`font-sans text-xs leading-5 text-fg-muted ${className ?? ""}`}
      {...props}
    />
  );
}

export const AnalysisCard = {
  Root: AnalysisCardRoot,
  Header: AnalysisCardHeader,
  Title: AnalysisCardTitle,
  Description: AnalysisCardDescription,
};
