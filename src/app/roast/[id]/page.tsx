import type { Metadata } from "next";
import { connection } from "next/server";
import type { BundledLanguage } from "shiki";
import {
  AnalysisCard,
  Badge,
  Button,
  CodeBlock,
  DiffLine,
  ScoreRing,
  SectionTitle,
} from "@/components/ui/index.server";

type RoastPageProps = {
  params: Promise<{ id: string }>;
};

type RoastFinding = {
  title: string;
  description: string;
  tone: "critical" | "warning" | "good";
};

type RoastDiffLine = {
  id: string;
  code: string;
  variant: "added" | "removed" | "context";
};

type RoastDetails = {
  score: number;
  verdict: string;
  quote: string;
  language: BundledLanguage;
  lineCountLabel: string;
  code: string;
  findings: RoastFinding[];
  diffHeader: string;
  diffLines: RoastDiffLine[];
};

const roastDetails: RoastDetails = {
  score: 3.5,
  verdict: "verdict: needs_serious_help",
  quote:
    '"this code looks like it was written during a power outage... in 2005."',
  language: "javascript",
  lineCountLabel: "7 lines",
  code: [
    "function calculateTotal(items) {",
    "  var total = 0;",
    "  for (var i = 0; i < items.length; i++) {",
    "    total = total + items[i].price;",
    "  }",
    " ",
    "  if (total > 100) {",
    '    console.log("discount applied");',
    "    total = total * 0.9;",
    "  }",
    " ",
    "  // TODO: handle tax calculation",
    "  // TODO: handle currency conversion",
    " ",
    "  return total;",
    "}",
  ].join("\n"),
  findings: [
    {
      tone: "critical",
      title: "using var instead of const/let",
      description:
        "var is function-scoped and leads to hoisting bugs. use const by default, let when reassignment is needed.",
    },
    {
      tone: "warning",
      title: "imperative loop pattern",
      description:
        "for loops are verbose and error-prone. use .reduce() or .map() for cleaner, functional transformations.",
    },
    {
      tone: "good",
      title: "clear naming conventions",
      description:
        "calculateTotal and items are descriptive, self-documenting names that communicate intent without comments.",
    },
    {
      tone: "good",
      title: "single responsibility",
      description:
        "the function does one thing well - calculates a total. no side effects, no mixed concerns, no hidden complexity.",
    },
  ],
  diffHeader: "your_code.ts → improved_code.ts",
  diffLines: [
    {
      id: "diff-1",
      code: "function calculateTotal(items) {",
      variant: "context",
    },
    { id: "diff-2", code: "  var total = 0;", variant: "removed" },
    {
      id: "diff-3",
      code: "  for (var i = 0; i < items.length; i++) {",
      variant: "removed",
    },
    {
      id: "diff-4",
      code: "    total = total + items[i].price;",
      variant: "removed",
    },
    { id: "diff-5", code: "  }", variant: "removed" },
    { id: "diff-6", code: "  return total;", variant: "removed" },
    {
      id: "diff-7",
      code: "  return items.reduce((sum, item) => sum + item.price, 0);",
      variant: "added",
    },
    { id: "diff-8", code: "}", variant: "context" },
  ],
};

export async function generateMetadata({
  params,
}: RoastPageProps): Promise<Metadata> {
  const { id } = await params;

  return {
    title: `Roast ${id.slice(0, 8)} | devroast`,
    description: "Detailed roast results for a submitted code snippet.",
  };
}

export default async function RoastResultPage({ params }: RoastPageProps) {
  await connection();
  await params;

  return (
    <main className="bg-page font-sans text-fg">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-4 py-10 sm:px-8 lg:px-20">
        <section className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">
          <div className="flex justify-center lg:justify-start">
            <ScoreRing.Root size="lg">
              <ScoreRing.Track />
              <ScoreRing.Arc score={roastDetails.score} />
              <ScoreRing.Value score={roastDetails.score} />
            </ScoreRing.Root>
          </div>

          <div className="flex flex-1 flex-col gap-4">
            <Badge.Root size="md" variant="critical">
              <Badge.Dot size="md" variant="critical" />
              <Badge.Label>{roastDetails.verdict}</Badge.Label>
            </Badge.Root>

            <h1 className="max-w-4xl font-mono text-xl font-normal leading-[1.5] text-fg">
              {roastDetails.quote}
            </h1>

            <div className="flex items-center gap-4 font-mono text-xs text-fg-subtle">
              <span>{`lang: ${roastDetails.language}`}</span>
              <span>&middot;</span>
              <span>{roastDetails.lineCountLabel}</span>
            </div>

            <div>
              <Button size="sm" variant="secondary">
                $ share_roast
              </Button>
            </div>
          </div>
        </section>

        <div className="h-px w-full bg-border" />

        <section className="flex flex-col gap-4">
          <SectionTitle.Root>
            <SectionTitle.Slash />
            <SectionTitle.Text>your_submission</SectionTitle.Text>
          </SectionTitle.Root>

          <CodeBlock
            className="h-[424px] [&_.line]:pl-16 [&_.line::before]:w-12 [&_.line::before]:pr-3 [&_.shiki]:h-full [&_.shiki]:overflow-auto"
            code={roastDetails.code}
            lang={roastDetails.language}
            showLineNumbers
          />
        </section>

        <div className="h-px w-full bg-border" />

        <section className="flex flex-col gap-6">
          <SectionTitle.Root>
            <SectionTitle.Slash />
            <SectionTitle.Text>detailed_analysis</SectionTitle.Text>
          </SectionTitle.Root>

          <div className="grid gap-5 md:grid-cols-2">
            {roastDetails.findings.map((finding) => (
              <AnalysisCard.Root key={finding.title} className="gap-4 p-5">
                <AnalysisCard.Header>
                  <Badge.Root variant={finding.tone}>
                    <Badge.Dot variant={finding.tone} />
                    <Badge.Label>{finding.tone}</Badge.Label>
                  </Badge.Root>
                </AnalysisCard.Header>
                <AnalysisCard.Title>{finding.title}</AnalysisCard.Title>
                <AnalysisCard.Description>
                  {finding.description}
                </AnalysisCard.Description>
              </AnalysisCard.Root>
            ))}
          </div>
        </section>

        <div className="h-px w-full bg-border" />

        <section className="flex flex-col gap-6">
          <SectionTitle.Root>
            <SectionTitle.Slash />
            <SectionTitle.Text>suggested_fix</SectionTitle.Text>
          </SectionTitle.Root>

          <div className="overflow-hidden border border-border bg-input">
            <div className="flex h-10 items-center border-b border-border px-4 font-mono text-xs text-fg-subtle">
              <span>{roastDetails.diffHeader}</span>
            </div>

            <div className="py-1">
              {roastDetails.diffLines.map((line) => (
                <DiffLine.Root
                  key={line.id}
                  className="min-h-7"
                  variant={line.variant}
                >
                  <DiffLine.Prefix variant={line.variant} />
                  <DiffLine.Code>{line.code}</DiffLine.Code>
                </DiffLine.Root>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
