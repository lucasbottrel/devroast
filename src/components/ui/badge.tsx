import type { HTMLAttributes, PropsWithChildren } from "react";
import { tv, type VariantProps } from "tailwind-variants";

export const badgeVariants = tv({
  base: "inline-flex items-center gap-2 font-mono",
  variants: {
    variant: {
      critical: "text-accent-red",
      warning: "text-accent-amber",
      good: "text-accent-green",
      neutral: "text-fg-muted",
    },
    size: {
      sm: "text-xs",
      md: "text-[13px]",
    },
  },
  defaultVariants: {
    variant: "neutral",
    size: "sm",
  },
});

const badgeDotVariants = tv({
  base: "rounded-full",
  variants: {
    variant: {
      critical: "bg-accent-red",
      warning: "bg-accent-amber",
      good: "bg-accent-green",
      neutral: "bg-fg-muted",
    },
    size: {
      sm: "size-2",
      md: "size-2.5",
    },
  },
  defaultVariants: {
    variant: "neutral",
    size: "sm",
  },
});

export interface BadgeRootProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function BadgeRoot({
  className,
  variant,
  size,
  children,
  ...props
}: PropsWithChildren<BadgeRootProps>) {
  return (
    <span className={badgeVariants({ variant, size, className })} {...props}>
      {children}
    </span>
  );
}

export interface BadgeDotProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function BadgeDot({ className, variant, size, ...props }: BadgeDotProps) {
  return (
    <span
      className={badgeDotVariants({ variant, size, className })}
      aria-hidden="true"
      {...props}
    />
  );
}

export interface BadgeLabelProps extends HTMLAttributes<HTMLSpanElement> {}

function BadgeLabel({ className, ...props }: BadgeLabelProps) {
  return <span className={className} {...props} />;
}

export const Badge = {
  Root: BadgeRoot,
  Dot: BadgeDot,
  Label: BadgeLabel,
};
