function LeaderboardSkeletonCard({
  showFooter = true,
}: {
  showFooter?: boolean;
}) {
  return (
    <div className="overflow-hidden border border-border bg-page">
      <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="h-4 w-12 animate-pulse rounded bg-elevated" />
          <div className="h-4 w-16 animate-pulse rounded bg-elevated" />
        </div>

        <div className="h-4 w-20 animate-pulse rounded bg-elevated" />
      </div>

      <div className="space-y-2 px-5 py-4 sm:px-6">
        <div className="h-4 w-full animate-pulse rounded bg-elevated" />
        <div className="h-4 w-[92%] animate-pulse rounded bg-elevated" />
        <div className="h-4 w-[88%] animate-pulse rounded bg-elevated" />
      </div>

      {showFooter ? (
        <div className="h-9 animate-pulse border-t border-border bg-surface" />
      ) : null}
    </div>
  );
}

export default function LeaderboardLoading() {
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
            <div className="h-4 w-28 animate-pulse rounded bg-elevated" />
            <span>·</span>
            <div className="h-4 w-24 animate-pulse rounded bg-elevated" />
          </div>
        </section>

        <section className="flex flex-col gap-5">
          <LeaderboardSkeletonCard />
          <LeaderboardSkeletonCard />
          <LeaderboardSkeletonCard showFooter={false} />
        </section>
      </div>
    </main>
  );
}
