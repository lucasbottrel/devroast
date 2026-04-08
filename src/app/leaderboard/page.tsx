import type { Metadata } from "next";
import { LeaderboardEntry } from "@/app/leaderboard/leaderboard-entry";
import { LeaderboardPageHeader } from "@/app/leaderboard/leaderboard-page-header";
import { getCaller } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Shame Leaderboard | devroast",
  description:
    "Browse the most roasted code snippets on devroast's leaderboard.",
};

export const revalidate = 3600;

export default async function LeaderboardPage() {
  const caller = await getCaller();
  const data = await caller.leaderboard.full();

  return (
    <main className="bg-page font-sans text-fg">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-4 py-10 sm:px-8 lg:px-20">
        <LeaderboardPageHeader
          averageScore={data.averageScore}
          totalCompletedRoasts={data.totalCompletedRoasts}
        />

        {data.items.length > 0 ? (
          <section className="flex flex-col gap-5">
            {data.items.map((item, index) => (
              <LeaderboardEntry item={item} key={item.id} rank={index + 1} />
            ))}
          </section>
        ) : (
          <section className="border border-border bg-page px-6 py-10 text-center font-mono text-sm text-fg-muted">
            no completed roasts yet
          </section>
        )}
      </div>
    </main>
  );
}
