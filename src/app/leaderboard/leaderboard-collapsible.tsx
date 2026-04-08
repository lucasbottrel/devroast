"use client";

import { useState } from "react";

export interface LeaderboardCollapsibleProps {
  children: React.ReactNode;
  language: string;
  lineCount: number;
  rank: number;
  score: string;
  scoreTone: "critical" | "warning" | "good" | "neutral";
}

function ChevronIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 10 10" {...props}>
      <path d="M3.5 1 6.5 5 3.5 9" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

function formatLineCount(lineCount: number) {
  return `${lineCount} ${lineCount === 1 ? "line" : "lines"}`;
}

export function LeaderboardCollapsible({
  children,
  language,
  lineCount,
  rank,
  score,
  scoreTone,
}: LeaderboardCollapsibleProps) {
  const [open, setOpen] = useState(false);
  const canExpand = lineCount > 3;

  const scoreToneClass =
    scoreTone === "critical"
      ? "text-accent-red"
      : scoreTone === "warning"
        ? "text-accent-amber"
        : scoreTone === "good"
          ? "text-accent-green"
          : "text-fg";

  return (
    <article className="overflow-hidden border border-border bg-page">
      <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 font-mono text-xs sm:px-6">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-1.5 text-[13px]">
            <span className="text-fg-subtle">#</span>
            <span className="font-bold text-accent-amber">{rank}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-fg-subtle">score</span>
            <span className={`text-[13px] font-bold ${scoreToneClass}`}>
              {score}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-right text-fg-subtle sm:gap-4">
          <span className="text-fg-muted">{language}</span>
          <span>{formatLineCount(lineCount)}</span>
        </div>
      </div>

      <div className="bg-page">
        <div
          className={
            open || !canExpand
              ? ""
              : "relative max-h-[7.875rem] overflow-hidden"
          }
        >
          {children}
          {!open && canExpand ? (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-page via-page/90 to-transparent" />
          ) : null}
        </div>
      </div>

      {canExpand ? (
        <button
          className="group inline-flex w-full items-center justify-center gap-2 border-t border-border bg-surface px-4 py-2.5 font-mono text-xs text-fg-muted transition-colors hover:bg-elevated hover:text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-green active:bg-surface"
          onClick={() => setOpen((currentOpen) => !currentOpen)}
          type="button"
        >
          <span>{open ? "show less" : "show more"}</span>
          <ChevronIcon
            className={`size-3 transition-transform duration-150 ease-out ${open ? "rotate-90 translate-y-px" : ""}`}
          />
        </button>
      ) : null}
    </article>
  );
}
