import type { ButtonHTMLAttributes } from "react";
import { tv, type VariantProps } from "tailwind-variants";

export const buttonVariants = tv({
  base: "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap border border-transparent font-mono transition-[background-color,color,transform] duration-150 hover:-translate-y-px disabled:pointer-events-none disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50",
  variants: {
    variant: {
      primary: "border-transparent bg-accent-green text-[#0A0A0A]",
      secondary: "border-border bg-transparent text-fg",
      link: "border-border bg-transparent text-fg-muted",
      danger: "border-transparent bg-accent-red text-[#FAFAFA]",
    },
    size: {
      sm: "px-3 py-1.5 text-xs",
      md: "px-6 py-2.5 text-[13px]",
      lg: "px-7 py-3 text-sm",
      icon: "size-10 p-0",
    },
    fullWidth: {
      true: "w-full",
    },
  },
  compoundVariants: [
    {
      variant: "primary",
      class: "hover:bg-emerald-400 active:bg-accent-green",
    },
    {
      variant: "secondary",
      class: "hover:bg-surface active:bg-elevated",
    },
    {
      variant: "link",
      class: "hover:bg-surface hover:text-fg active:bg-elevated",
    },
    {
      variant: "danger",
      class: "hover:bg-red-500 active:bg-accent-red",
    },
  ],
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  fullWidth?: boolean;
}

export function Button({
  className,
  variant,
  size,
  fullWidth,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={buttonVariants({ variant, size, fullWidth, className })}
      type={type}
      {...props}
    />
  );
}
