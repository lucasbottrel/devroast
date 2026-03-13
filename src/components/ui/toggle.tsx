"use client";

import { Switch } from "@base-ui/react/switch";
import type { ComponentProps, HTMLAttributes, PropsWithChildren } from "react";
import { tv, type VariantProps } from "tailwind-variants";

export const toggleRootVariants = tv({
  base: "group inline-flex items-center gap-3 font-mono text-xs text-[#6B7280] outline-none transition-colors data-[checked]:text-[#10B981] data-[disabled]:opacity-50",
  variants: {
    tone: {
      default: "",
      success: "",
    },
  },
  defaultVariants: {
    tone: "default",
  },
});

const toggleTrackVariants = tv({
  base: "relative inline-flex h-[22px] w-10 rounded-full bg-[#2A2A2A] p-[3px] transition-colors group-data-[checked]:bg-[#10B981]",
});

const toggleThumbVariants = tv({
  base: "pointer-events-none block size-4 rounded-full bg-[#6B7280] transition-transform group-data-[checked]:translate-x-[18px] group-data-[checked]:bg-[#0A0A0A]",
});

const toggleLabelVariants = tv({
  base: "text-xs",
});

export interface ToggleRootProps
  extends Omit<ComponentProps<typeof Switch.Root>, "className">,
    VariantProps<typeof toggleRootVariants> {
  className?: string;
}

function ToggleRoot({
  className,
  tone,
  children,
  ...props
}: PropsWithChildren<ToggleRootProps>) {
  return (
    <Switch.Root className={toggleRootVariants({ tone, className })} {...props}>
      {children}
    </Switch.Root>
  );
}

export interface ToggleTrackProps extends HTMLAttributes<HTMLSpanElement> {}

function ToggleTrack({ className, ...props }: ToggleTrackProps) {
  return <span className={toggleTrackVariants({ className })} {...props} />;
}

export interface ToggleThumbProps
  extends Omit<ComponentProps<typeof Switch.Thumb>, "className"> {
  className?: string;
}

function ToggleThumb({ className, ...props }: ToggleThumbProps) {
  return (
    <Switch.Thumb className={toggleThumbVariants({ className })} {...props} />
  );
}

export interface ToggleLabelProps extends HTMLAttributes<HTMLSpanElement> {}

function ToggleLabel({ className, ...props }: ToggleLabelProps) {
  return <span className={toggleLabelVariants({ className })} {...props} />;
}

export const Toggle = {
  Root: ToggleRoot,
  Track: ToggleTrack,
  Thumb: ToggleThumb,
  Label: ToggleLabel,
};
