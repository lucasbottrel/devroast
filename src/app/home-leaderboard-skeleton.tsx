import { Button, SectionTitle } from "@/components/ui";

export function HomeLeaderboardSkeleton() {
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
        {["skeleton-1", "skeleton-2", "skeleton-3"].map((key) => (
          <div
            className="overflow-hidden border border-border bg-page"
            key={key}
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-5">
                <div className="h-4 w-12 animate-pulse rounded bg-elevated" />
                <div className="h-4 w-16 animate-pulse rounded bg-elevated" />
              </div>
              <div className="h-4 w-20 animate-pulse rounded bg-elevated" />
            </div>

            <div className="space-y-2 px-5 py-4">
              <div className="h-4 w-full animate-pulse rounded bg-elevated" />
              <div className="h-4 w-[92%] animate-pulse rounded bg-elevated" />
              <div className="h-4 w-[88%] animate-pulse rounded bg-elevated" />
              <div className="h-4 w-[76%] animate-pulse rounded bg-elevated" />
            </div>

            <div className="h-9 animate-pulse border-t border-border bg-surface" />
          </div>
        ))}
      </div>

      <div className="flex justify-center py-4">
        <div className="h-4 w-56 animate-pulse rounded bg-elevated" />
      </div>
    </section>
  );
}
