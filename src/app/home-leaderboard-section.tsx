import Link from "next/link";
import { HomeLeaderboardEntry } from "@/app/home-leaderboard-entry";
import { Button, SectionTitle } from "@/components/ui";
import { getCaller } from "@/trpc/server";

export async function HomeLeaderboardSection() {
  const caller = await getCaller();
  const data = await caller.leaderboard.homePreview();

  return (
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

      <div className="space-y-4">
        {data.items.map((item, index) => (
          <HomeLeaderboardEntry item={item} key={item.id} rank={index + 1} />
        ))}
      </div>

      <div className="flex justify-center py-4">
        <span className="text-xs text-fg-subtle">
          showing top 3 of {data.totalCompletedRoasts} completed roasts -{" "}
          <Link
            className="underline-offset-4 hover:underline"
            href="/leaderboard"
          >
            view full leaderboard &gt;&gt;
          </Link>
        </span>
      </div>
    </section>
  );
}
