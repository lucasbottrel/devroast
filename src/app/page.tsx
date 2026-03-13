"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Button,
  CodeInput,
  LeaderboardRow,
  SectionTitle,
  Toggle,
} from "@/components/ui";

export default function Home() {
  const [code, setCode] = useState("");
  const isSubmitDisabled = useMemo(() => code.trim().length === 0, [code]);

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
          <CodeInput.Root size="full" className="max-w-none">
            <CodeInput.Header />
            <CodeInput.Body>
              <CodeInput.Gutter lineCount={15} />
              <CodeInput.Textarea
                aria-label="Code input"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="// paste your code here"
              />
            </CodeInput.Body>
          </CodeInput.Root>
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

        <section className="mx-auto flex w-full max-w-[780px] items-center justify-center gap-6 pb-6 pt-1">
          <span className="text-xs text-fg-subtle">2,847 codes roasted</span>
          <span className="font-mono text-xs text-fg-subtle">.</span>
          <span className="text-xs text-fg-subtle">avg score: 4.2/10</span>
        </section>

        <div className="h-10" />

        <section className="mx-auto w-full max-w-[960px] space-y-5 pb-16">
          <div className="flex items-center justify-between">
            <SectionTitle.Root>
              <SectionTitle.Slash />
              <SectionTitle.Text>hall_of_shame</SectionTitle.Text>
            </SectionTitle.Root>
            <Button size="sm" variant="link">
              $ view_all &gt;&gt;
            </Button>
          </div>

          <p className="text-sm text-fg-subtle">
            {"// the worst code on the internet, ranked by shame"}
          </p>

          <div className="border border-border bg-surface">
            <div className="grid grid-cols-[40px_60px_1fr_100px] items-center gap-6 border-b border-border bg-elevated px-5 py-3 font-mono text-xs text-fg-subtle">
              <span>rank</span>
              <span>score</span>
              <span>snippet</span>
              <span>lang</span>
            </div>

            <LeaderboardRow.Root scoreTone="critical">
              <LeaderboardRow.Rank>#1</LeaderboardRow.Rank>
              <LeaderboardRow.Score>2.1</LeaderboardRow.Score>
              <LeaderboardRow.Snippet>
                function calculateTotal(items) {"{"} var total = 0; ...
              </LeaderboardRow.Snippet>
              <LeaderboardRow.Language>javascript</LeaderboardRow.Language>
            </LeaderboardRow.Root>

            <LeaderboardRow.Root scoreTone="warning">
              <LeaderboardRow.Rank>#2</LeaderboardRow.Rank>
              <LeaderboardRow.Score>3.0</LeaderboardRow.Score>
              <LeaderboardRow.Snippet>
                for (var i in users) {"{"} delete users[i].password {"}"}
              </LeaderboardRow.Snippet>
              <LeaderboardRow.Language>javascript</LeaderboardRow.Language>
            </LeaderboardRow.Root>

            <LeaderboardRow.Root scoreTone="warning" className="border-b-0">
              <LeaderboardRow.Rank>#3</LeaderboardRow.Rank>
              <LeaderboardRow.Score>4.4</LeaderboardRow.Score>
              <LeaderboardRow.Snippet>
                SELECT * FROM users WHERE name = input
              </LeaderboardRow.Snippet>
              <LeaderboardRow.Language>sql</LeaderboardRow.Language>
            </LeaderboardRow.Root>
          </div>

          <div className="flex justify-center py-4">
            <span className="text-xs text-fg-subtle">
              showing top 3 of 2,847 -{" "}
              <Link
                className="underline-offset-4 hover:underline"
                href="/leaderboard"
              >
                view full leaderboard &gt;&gt;
              </Link>
            </span>
          </div>
        </section>
      </div>
    </main>
  );
}
