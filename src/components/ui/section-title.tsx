import type { HTMLAttributes, PropsWithChildren } from "react";
import { tv, type VariantProps } from "tailwind-variants";

export const sectionTitleVariants = tv({
  base: "inline-flex items-center gap-2 font-mono text-sm font-bold",
  variants: {
    tone: {
      default: "text-fg",
      muted: "text-fg-muted",
    },
  },
  defaultVariants: {
    tone: "default",
  },
});

export interface SectionTitleRootProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sectionTitleVariants> {}

function SectionTitleRoot({
  className,
  tone,
  children,
  ...props
}: PropsWithChildren<SectionTitleRootProps>) {
  return (
    <div className={sectionTitleVariants({ tone, className })} {...props}>
      {children}
    </div>
  );
}

export interface SectionTitleSlashProps
  extends HTMLAttributes<HTMLSpanElement> {}

function SectionTitleSlash({ className, ...props }: SectionTitleSlashProps) {
  return (
    <span
      className={tv({ base: "text-accent-green" })({ className })}
      {...props}
    >
      {"//"}
    </span>
  );
}

export interface SectionTitleTextProps
  extends HTMLAttributes<HTMLSpanElement> {}

function SectionTitleText({ className, ...props }: SectionTitleTextProps) {
  return <span className={className} {...props} />;
}

export const SectionTitle = {
  Root: SectionTitleRoot,
  Slash: SectionTitleSlash,
  Text: SectionTitleText,
};
