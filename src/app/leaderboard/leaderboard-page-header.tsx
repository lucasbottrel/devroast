type LeaderboardPageHeaderProps = {
  averageScore: number | null;
  totalCompletedRoasts: number;
};

function formatAverageScore(score: number | null) {
  return score == null ? "-" : `${score.toFixed(1)}/10`;
}

function formatTotalCompletedRoasts(totalCompletedRoasts: number) {
  return new Intl.NumberFormat("en-US").format(totalCompletedRoasts);
}

export function LeaderboardPageHeader({
  averageScore,
  totalCompletedRoasts,
}: LeaderboardPageHeaderProps) {
  return (
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

      <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-fg-subtle">
        <span>
          {formatTotalCompletedRoasts(totalCompletedRoasts)} submissions
        </span>
        <span>·</span>
        <span>avg score: {formatAverageScore(averageScore)}</span>
      </div>
    </section>
  );
}
