import type { HTMLAttributes, PropsWithChildren } from "react";
import { tv, type VariantProps } from "tailwind-variants";

export const leaderboardRowVariants = tv({
  base: "grid w-full grid-cols-[40px_60px_1fr_100px] items-center gap-6 border-b border-border px-5 py-4 font-mono",
  variants: {
    scoreTone: {
      critical: "[&_.score-value]:text-accent-red",
      warning: "[&_.score-value]:text-accent-amber",
      good: "[&_.score-value]:text-accent-green",
      neutral: "[&_.score-value]:text-fg",
    },
  },
  defaultVariants: {
    scoreTone: "neutral",
  },
});

export interface LeaderboardRowRootProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof leaderboardRowVariants> {}

function LeaderboardRowRoot({
  className,
  scoreTone,
  children,
  ...props
}: PropsWithChildren<LeaderboardRowRootProps>) {
  return (
    <div
      className={leaderboardRowVariants({ scoreTone, className })}
      {...props}
    >
      {children}
    </div>
  );
}

export interface LeaderboardRowRankProps
  extends HTMLAttributes<HTMLSpanElement> {}

function LeaderboardRowRank({ className, ...props }: LeaderboardRowRankProps) {
  return (
    <span
      className={`text-[13px] text-fg-subtle ${className ?? ""}`}
      {...props}
    />
  );
}

export interface LeaderboardRowScoreProps
  extends HTMLAttributes<HTMLSpanElement> {}

function LeaderboardRowScore({
  className,
  ...props
}: LeaderboardRowScoreProps) {
  return (
    <span
      className={`score-value text-[13px] font-bold ${className ?? ""}`}
      {...props}
    />
  );
}

export interface LeaderboardRowSnippetProps
  extends HTMLAttributes<HTMLSpanElement> {}

function LeaderboardRowSnippet({
  className,
  ...props
}: LeaderboardRowSnippetProps) {
  return (
    <span
      className={`truncate text-xs text-fg-muted ${className ?? ""}`}
      {...props}
    />
  );
}

export interface LeaderboardRowLanguageProps
  extends HTMLAttributes<HTMLSpanElement> {}

function LeaderboardRowLanguage({
  className,
  ...props
}: LeaderboardRowLanguageProps) {
  return (
    <span className={`text-xs text-fg-subtle ${className ?? ""}`} {...props} />
  );
}

export const LeaderboardRow = {
  Root: LeaderboardRowRoot,
  Rank: LeaderboardRowRank,
  Score: LeaderboardRowScore,
  Snippet: LeaderboardRowSnippet,
  Language: LeaderboardRowLanguage,
};
