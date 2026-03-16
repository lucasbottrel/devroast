import type { Metadata } from "next";
import { connection } from "next/server";
import type { BundledLanguage } from "shiki";
import { CodeBlock } from "@/components/ui/index.server";

export const metadata: Metadata = {
  title: "Shame Leaderboard | devroast",
  description:
    "Browse the most roasted code snippets on devroast's static shame leaderboard.",
};

type LeaderboardEntry = {
  rank: number;
  score: number;
  language: BundledLanguage;
  linesLabel: string;
  code: string;
};

const leaderboardEntries: LeaderboardEntry[] = [
  {
    rank: 1,
    score: 1.2,
    language: "javascript",
    linesLabel: "3 lines",
    code: [
      'eval(prompt("enter code"))',
      "document.write(response)",
      "// trust the user lol",
    ].join("\n"),
  },
  {
    rank: 2,
    score: 1.8,
    language: "typescript",
    linesLabel: "3 lines",
    code: [
      "if (x == true) { return true; }",
      "else if (x == false) { return false; }",
      "else { return !false; }",
    ].join("\n"),
  },
  {
    rank: 3,
    score: 2.1,
    language: "sql",
    linesLabel: "2 lines",
    code: ["SELECT * FROM users WHERE 1=1", "-- TODO: add authentication"].join(
      "\n",
    ),
  },
  {
    rank: 4,
    score: 2.3,
    language: "java",
    linesLabel: "3 lines",
    code: ["catch (e) {", "  // ignore", "}"].join("\n"),
  },
  {
    rank: 5,
    score: 2.5,
    language: "javascript",
    linesLabel: "3 lines",
    code: [
      "const sleep = (ms) =>",
      "  new Date(Date.now() + ms)",
      "  while(new Date() < end) {}",
    ].join("\n"),
  },
];

function formatScore(score: number) {
  return score.toFixed(1);
}

async function LeaderboardEntryCard({ entry }: { entry: LeaderboardEntry }) {
  return (
    <article className="overflow-hidden border border-border bg-page">
      <div className="flex h-12 items-center justify-between gap-4 border-b border-border px-5 font-mono text-xs sm:px-6">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-1.5 text-[13px]">
            <span className="text-fg-subtle">#</span>
            <span className="font-bold text-accent-amber">{entry.rank}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-fg-subtle">score</span>
            <span className="text-[13px] font-bold text-accent-red">
              {formatScore(entry.score)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-right sm:gap-4">
          <span className="text-fg-muted">{entry.language}</span>
          <span className="text-fg-subtle">{entry.linesLabel}</span>
        </div>
      </div>

      <CodeBlock
        className="border-0 border-t"
        code={entry.code}
        lang={entry.language}
        showLineNumbers
      />
    </article>
  );
}

export default async function LeaderboardPage() {
  await connection();

  return (
    <main className="bg-page font-sans text-fg">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-4 py-10 sm:px-8 lg:px-20">
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-3 font-mono">
            <span className="text-3xl font-bold text-accent-green">{">"}</span>
            <h1 className="text-3xl font-bold text-fg sm:text-[2rem]">
              shame_leaderboard
            </h1>
          </div>

          <p className="font-mono text-sm text-fg-muted">
            {"// the most roasted code on the internet"}
          </p>

          <div className="flex items-center gap-2 font-mono text-xs text-fg-subtle">
            <span>2,847 submissions</span>
            <span>·</span>
            <span>avg score: 4.2/10</span>
          </div>
        </section>

        <section className="flex flex-col gap-5">
          {leaderboardEntries.map((entry) => (
            <LeaderboardEntryCard key={entry.rank} entry={entry} />
          ))}
        </section>
      </div>
    </main>
  );
}
