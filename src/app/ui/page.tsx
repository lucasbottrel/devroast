import { TogglePreview } from "@/app/ui/_components/toggle-preview";
import {
  AnalysisCard,
  Badge,
  Button,
  CodeBlock,
  CodeBlockHeader,
  DiffLine,
  LeaderboardRow,
  ScoreRing,
  SectionTitle,
} from "@/components/ui/index.server";

const buttonVariants = ["primary", "secondary", "link", "danger"] as const;
const buttonSizes = ["sm", "md", "lg", "icon"] as const;

const codeSample = [
  "function calculateTotal(items) {",
  "  var total = 0;",
  "  for (var i = 0; i < items.length; i++) {",
  "    total = total + items[i].price;",
  "  }",
  "  return total;",
  "}",
].join("\n");

export default async function UiComponentsPage() {
  return (
    <main className="min-h-screen bg-page px-6 py-10 font-sans text-fg">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
        <header className="space-y-3">
          <SectionTitle.Root>
            <SectionTitle.Slash />
            <SectionTitle.Text>component_library</SectionTitle.Text>
          </SectionTitle.Root>
          <h1 className="font-mono text-4xl font-bold">UI Components</h1>
          <p className="max-w-3xl text-sm text-fg-muted">
            Catalogo visual dos componentes genericos e reaproveitaveis da
            aplicacao.
          </p>
        </header>

        <section className="space-y-4">
          <SectionTitle.Root>
            <SectionTitle.Slash />
            <SectionTitle.Text>buttons</SectionTitle.Text>
          </SectionTitle.Root>
          <div className="space-y-4 border border-border bg-surface p-5">
            <div className="flex flex-wrap gap-3">
              {buttonVariants.map((variant) => (
                <Button key={variant} variant={variant}>
                  $ {variant}
                </Button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {buttonSizes.map((size) => (
                <Button key={size} size={size}>
                  {size === "icon" ? "$" : size}
                </Button>
              ))}
              <Button disabled>$ disabled</Button>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <SectionTitle.Root>
            <SectionTitle.Slash />
            <SectionTitle.Text>toggle</SectionTitle.Text>
          </SectionTitle.Root>
          <TogglePreview />
        </section>

        <section className="space-y-4">
          <SectionTitle.Root>
            <SectionTitle.Slash />
            <SectionTitle.Text>badge_status</SectionTitle.Text>
          </SectionTitle.Root>
          <div className="flex flex-wrap gap-6 border border-border bg-surface p-5">
            <Badge.Root variant="critical">
              <Badge.Dot variant="critical" />
              <Badge.Label>critical</Badge.Label>
            </Badge.Root>
            <Badge.Root variant="warning">
              <Badge.Dot variant="warning" />
              <Badge.Label>warning</Badge.Label>
            </Badge.Root>
            <Badge.Root variant="good">
              <Badge.Dot variant="good" />
              <Badge.Label>good</Badge.Label>
            </Badge.Root>
            <Badge.Root variant="critical" size="md">
              <Badge.Dot variant="critical" size="md" />
              <Badge.Label>needs_serious_help</Badge.Label>
            </Badge.Root>
          </div>
        </section>

        <section className="space-y-4">
          <SectionTitle.Root>
            <SectionTitle.Slash />
            <SectionTitle.Text>cards</SectionTitle.Text>
          </SectionTitle.Root>
          <div className="grid gap-4 border border-border bg-surface p-5 md:grid-cols-2">
            <AnalysisCard.Root>
              <AnalysisCard.Header>
                <Badge.Root variant="critical">
                  <Badge.Dot variant="critical" />
                  <Badge.Label>critical</Badge.Label>
                </Badge.Root>
              </AnalysisCard.Header>
              <AnalysisCard.Title>
                using var instead of const/let
              </AnalysisCard.Title>
              <AnalysisCard.Description>
                The var keyword is function-scoped, which can lead to bugs.
                Prefer const for immutable bindings and let for mutable ones.
              </AnalysisCard.Description>
            </AnalysisCard.Root>

            <AnalysisCard.Root variant="elevated">
              <AnalysisCard.Header>
                <Badge.Root variant="warning">
                  <Badge.Dot variant="warning" />
                  <Badge.Label>warning</Badge.Label>
                </Badge.Root>
              </AnalysisCard.Header>
              <AnalysisCard.Title>nested loops complexity</AnalysisCard.Title>
              <AnalysisCard.Description>
                This section may degrade performance with large arrays. Consider
                using a map lookup to reduce repeated scans.
              </AnalysisCard.Description>
            </AnalysisCard.Root>
          </div>
        </section>

        <section className="space-y-4">
          <SectionTitle.Root>
            <SectionTitle.Slash />
            <SectionTitle.Text>code_block</SectionTitle.Text>
          </SectionTitle.Root>
          <div className="overflow-hidden border border-border bg-input">
            <CodeBlockHeader fileName="calculate.js" />
            <CodeBlock
              className="border-0"
              code={codeSample}
              lang="javascript"
            />
          </div>
        </section>

        <section className="space-y-4">
          <SectionTitle.Root>
            <SectionTitle.Slash />
            <SectionTitle.Text>diff_line</SectionTitle.Text>
          </SectionTitle.Root>
          <div className="border border-border bg-surface py-2">
            <DiffLine.Root variant="removed">
              <DiffLine.Prefix variant="removed" />
              <DiffLine.Code>var total = 0;</DiffLine.Code>
            </DiffLine.Root>
            <DiffLine.Root variant="added">
              <DiffLine.Prefix variant="added" />
              <DiffLine.Code>const total = 0;</DiffLine.Code>
            </DiffLine.Root>
            <DiffLine.Root variant="context">
              <DiffLine.Prefix variant="context" />
              <DiffLine.Code>
                for (let i = 0; i &lt; items.length; i++) {"{"}{" "}
              </DiffLine.Code>
            </DiffLine.Root>
          </div>
        </section>

        <section className="space-y-4">
          <SectionTitle.Root>
            <SectionTitle.Slash />
            <SectionTitle.Text>table_row</SectionTitle.Text>
          </SectionTitle.Root>
          <div className="border border-border bg-surface">
            <LeaderboardRow.Root scoreTone="critical">
              <LeaderboardRow.Rank>#1</LeaderboardRow.Rank>
              <LeaderboardRow.Score>2.1</LeaderboardRow.Score>
              <LeaderboardRow.Snippet>
                function calculateTotal(items) {"{"} var total = 0; ...
              </LeaderboardRow.Snippet>
              <LeaderboardRow.Language>javascript</LeaderboardRow.Language>
            </LeaderboardRow.Root>

            <LeaderboardRow.Root scoreTone="warning" className="border-b-0">
              <LeaderboardRow.Rank>#2</LeaderboardRow.Rank>
              <LeaderboardRow.Score>4.8</LeaderboardRow.Score>
              <LeaderboardRow.Snippet>
                def parse_user(payload): return payload.get('name')
              </LeaderboardRow.Snippet>
              <LeaderboardRow.Language>python</LeaderboardRow.Language>
            </LeaderboardRow.Root>
          </div>
        </section>

        <section className="space-y-4">
          <SectionTitle.Root>
            <SectionTitle.Slash />
            <SectionTitle.Text>score_ring</SectionTitle.Text>
          </SectionTitle.Root>
          <div className="flex items-end gap-8 border border-border bg-surface p-5">
            <ScoreRing.Root size="sm">
              <ScoreRing.Track />
              <ScoreRing.Arc score={7.2} />
              <ScoreRing.Value score={7.2} size="sm" />
            </ScoreRing.Root>
            <ScoreRing.Root size="md">
              <ScoreRing.Track />
              <ScoreRing.Arc score={5.6} />
              <ScoreRing.Value score={5.6} size="md" />
            </ScoreRing.Root>
            <ScoreRing.Root>
              <ScoreRing.Track />
              <ScoreRing.Arc score={3.5} />
              <ScoreRing.Value score={3.5} />
            </ScoreRing.Root>
          </div>
        </section>
      </div>
    </main>
  );
}
