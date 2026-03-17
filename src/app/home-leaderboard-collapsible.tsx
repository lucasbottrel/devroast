"use client";

import { Collapsible } from "@base-ui/react/collapsible";
import { useState } from "react";

export interface HomeLeaderboardCollapsibleProps {
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

export function HomeLeaderboardCollapsible({
  children,
  language,
  lineCount,
  rank,
  score,
  scoreTone,
}: HomeLeaderboardCollapsibleProps) {
  const [open, setOpen] = useState(false);

  const scoreToneClass =
    scoreTone === "critical"
      ? "text-accent-red"
      : scoreTone === "warning"
        ? "text-accent-amber"
        : scoreTone === "good"
          ? "text-accent-green"
          : "text-fg";

  return (
    <Collapsible.Root
      className="overflow-hidden border border-border bg-page"
      onOpenChange={setOpen}
      open={open}
    >
      <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 font-mono text-xs">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1.5">
            <span className="text-fg-subtle">#</span>
            <span className="font-bold text-accent-amber">{rank}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-fg-subtle">score:</span>
            <span className={`font-bold ${scoreToneClass}`}>{score}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-fg-subtle">
          <span>{language}</span>
          <span>{`${lineCount} lines`}</span>
        </div>
      </div>

      <Collapsible.Panel className="h-[var(--collapsible-panel-height)] overflow-hidden transition-[height] duration-200 ease-out data-[ending-style]:h-0 data-[starting-style]:h-0 [&[hidden]:not([hidden='until-found'])]:hidden">
        <div className="bg-page">
          <div className={open ? "" : "relative max-h-64 overflow-hidden"}>
            {children}
            {!open ? (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-page via-page/90 to-transparent" />
            ) : null}
          </div>
        </div>
      </Collapsible.Panel>

      <Collapsible.Trigger className="group inline-flex w-full items-center justify-center gap-2 border-t border-border bg-surface px-4 py-2.5 font-mono text-xs text-fg-muted transition-colors hover:bg-elevated hover:text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-green active:bg-surface">
        <span>{open ? "show less" : "show more"}</span>
        <ChevronIcon className="size-3 transition-transform duration-150 ease-out group-data-[panel-open]:rotate-90 group-data-[panel-open]:translate-y-px" />
      </Collapsible.Trigger>
    </Collapsible.Root>
  );
}
