import type { BundledLanguage } from "shiki";
import { HomeLeaderboardCollapsible } from "@/app/home-leaderboard-collapsible";
import { CodeBlock } from "@/components/ui/index.server";

type HomeLeaderboardEntryProps = {
  item: {
    id: string;
    language: string;
    lineCount: number;
    score: string | number | null;
    scoreTone: "critical" | "warning" | "good" | null;
    snippetPreview: string;
    sourceCode: string;
  };
  rank: number;
};

function formatScore(score: string | number | null) {
  if (typeof score === "number") {
    return score.toFixed(1);
  }

  return score ?? "-";
}

export async function HomeLeaderboardEntry({
  item,
  rank,
}: HomeLeaderboardEntryProps) {
  return (
    <HomeLeaderboardCollapsible
      language={item.language}
      lineCount={item.lineCount}
      rank={rank}
      score={formatScore(item.score)}
      scoreTone={item.scoreTone ?? "neutral"}
    >
      <CodeBlock
        className="max-w-none border-0"
        code={item.sourceCode}
        lang={item.language as BundledLanguage}
        showLineNumbers
      />
    </HomeLeaderboardCollapsible>
  );
}
