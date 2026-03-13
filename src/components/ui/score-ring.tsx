import type { HTMLAttributes, PropsWithChildren } from "react";
import { tv, type VariantProps } from "tailwind-variants";

export const scoreRingVariants = tv({
  base: "relative grid place-items-center",
  variants: {
    size: {
      sm: "size-[112px]",
      md: "size-[140px]",
      lg: "size-[180px]",
    },
  },
  defaultVariants: {
    size: "lg",
  },
});

function getRingMetrics(score: number, max = 10) {
  const safeMax = max <= 0 ? 10 : max;
  const clampedScore = Math.min(Math.max(score, 0), safeMax);
  const percent = (clampedScore / safeMax) * 100;
  const amberStop = Math.max(percent - 1, 0);

  return { safeMax, clampedScore, percent, amberStop };
}

export interface ScoreRingRootProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof scoreRingVariants> {}

function ScoreRingRoot({
  className,
  size,
  children,
  ...props
}: PropsWithChildren<ScoreRingRootProps>) {
  return (
    <div className={scoreRingVariants({ size, className })} {...props}>
      {children}
    </div>
  );
}

export interface ScoreRingTrackProps extends HTMLAttributes<HTMLDivElement> {}

function ScoreRingTrack({ className, ...props }: ScoreRingTrackProps) {
  return (
    <div
      className={`absolute inset-0 rounded-full border-4 border-[#2A2A2A] ${className ?? ""}`}
      aria-hidden="true"
      {...props}
    />
  );
}

export interface ScoreRingArcProps extends HTMLAttributes<HTMLDivElement> {
  score: number;
  max?: number;
}

function ScoreRingArc({
  className,
  style,
  score,
  max = 10,
  ...props
}: ScoreRingArcProps) {
  const { percent, amberStop } = getRingMetrics(score, max);

  return (
    <div
      className={`absolute inset-0 rounded-full ${className ?? ""}`}
      style={{
        backgroundImage: `conic-gradient(#10B981 0%, #F59E0B ${amberStop}%, transparent ${percent}% 100%)`,
        WebkitMask:
          "radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 4px))",
        mask: "radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 4px))",
        ...style,
      }}
      aria-hidden="true"
      {...props}
    />
  );
}

export interface ScoreRingValueProps extends HTMLAttributes<HTMLDivElement> {
  score: number;
  max?: number;
  size?: VariantProps<typeof scoreRingVariants>["size"];
}

function ScoreRingValue({
  className,
  score,
  max = 10,
  size = "lg",
  ...props
}: ScoreRingValueProps) {
  const { clampedScore, safeMax } = getRingMetrics(score, max);
  const scoreClass =
    size === "sm" ? "text-3xl" : size === "md" ? "text-4xl" : "text-5xl";

  const maxClass =
    size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base";

  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center gap-0.5 ${className ?? ""}`}
      {...props}
    >
      <p
        className={`font-mono leading-none font-bold text-[#FAFAFA] ${scoreClass}`}
      >
        {clampedScore.toFixed(1)}
      </p>
      <p className={`font-mono leading-none text-[#4B5563] ${maxClass}`}>
        /{safeMax}
      </p>
    </div>
  );
}

export const ScoreRing = {
  Root: ScoreRingRoot,
  Track: ScoreRingTrack,
  Arc: ScoreRingArc,
  Value: ScoreRingValue,
};
