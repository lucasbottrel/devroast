"use client";

import { useMemo, useState } from "react";
import {
  Button,
  CODE_SNIPPET_MAX_LENGTH,
  CodeEditor,
  Toggle,
} from "@/components/ui";

type HomePageClientProps = {
  leaderboardSlot: React.ReactNode;
  metricsSlot: React.ReactNode;
};

export function HomePageClient({
  leaderboardSlot,
  metricsSlot,
}: HomePageClientProps) {
  const [code, setCode] = useState("");
  const isOverCodeLimit = code.length > CODE_SNIPPET_MAX_LENGTH;
  const isSubmitDisabled = useMemo(
    () => code.trim().length === 0 || isOverCodeLimit,
    [code, isOverCodeLimit],
  );

  return (
    <main className="bg-page font-sans text-fg">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-10 pb-0 pt-20">
        <section className="flex w-full flex-col items-center space-y-3 text-center">
          <h1 className="inline-flex items-center gap-3 font-mono text-4xl font-bold">
            <span className="text-accent-green">$</span>
            <span>paste your code. get roasted.</span>
          </h1>
          <p className="max-w-3xl text-sm text-fg-muted">
            {"// drop your code below and we'll rate it - brutally honest or"}
            full roast mode
          </p>
        </section>

        <section className="mx-auto w-full max-w-[780px]">
          <CodeEditor
            size="full"
            className="max-w-none"
            value={code}
            onChange={setCode}
            textareaLabel="Code input"
            placeholder="// paste your code here"
            maxLength={CODE_SNIPPET_MAX_LENGTH}
          />
        </section>

        <section className="mx-auto flex w-full max-w-[780px] items-center justify-between gap-4">
          <div className="inline-flex items-center gap-4">
            <Toggle.Root defaultChecked>
              <Toggle.Track>
                <Toggle.Thumb />
              </Toggle.Track>
              <Toggle.Label>roast mode</Toggle.Label>
            </Toggle.Root>
            <span className="text-xs text-fg-subtle">
              {"// maximum sarcasm enabled"}
            </span>
          </div>

          <Button disabled={isSubmitDisabled}>$ roast_my_code</Button>
        </section>

        {metricsSlot}

        <div className="h-10" />

        {leaderboardSlot}
      </div>
    </main>
  );
}
