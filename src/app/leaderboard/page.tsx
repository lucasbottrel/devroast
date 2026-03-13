import { LeaderboardRow, SectionTitle } from "@/components/ui";

export default function LeaderboardPage() {
  return (
    <main className="bg-page font-sans text-fg">
      <div className="mx-auto w-full max-w-6xl px-10 py-16">
        <div className="space-y-4">
          <SectionTitle.Root>
            <SectionTitle.Slash />
            <SectionTitle.Text>leaderboard</SectionTitle.Text>
          </SectionTitle.Root>
          <p className="text-sm text-fg-subtle">{"// mocked data for now"}</p>
        </div>

        <div className="mt-6 border border-border bg-surface">
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
      </div>
    </main>
  );
}
