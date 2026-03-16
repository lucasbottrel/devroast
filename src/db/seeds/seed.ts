import "dotenv/config";
import { faker } from "@faker-js/faker";
import { db, pool } from "../client";
import {
  type DiffLineKind,
  type FindingSeverity,
  type RoastLanguage,
  type RoastStatus,
  roastDiffLines,
  roastFindings,
  roasts,
  type ScoreTone,
} from "../schema";

const TOTAL_ROASTS = 100;

const languages: RoastLanguage[] = [
  "javascript",
  "typescript",
  "jsx",
  "tsx",
  "python",
  "sql",
  "bash",
  "json",
];

const verdictLabels = [
  "needs_serious_help",
  "held_together_by_vibes",
  "dangerously_confident",
  "mildly_radioactive",
  "surprisingly_survivable",
  "one_merge_conflict_away",
] as const;

const completedHeadlines = [
  "This code has strong 'worked on my machine' energy.",
  "A brave interpretation of maintainability.",
  "Readable, if you enjoy suspense novels.",
  "This snippet is one coffee away from becoming legacy.",
  "You can feel the deadline in every line.",
  "Somewhere, a linter is crying softly.",
] as const;

const failedReasons = [
  "Analysis provider timed out before the roast was ready.",
  "The worker tripped over malformed input and gave up.",
  "The analysis pipeline hit a retry limit and stopped.",
] as const;

faker.seed(42);

function countLines(sourceCode: string) {
  return sourceCode.split(/\r?\n/).length;
}

function toSnippetPreview(sourceCode: string) {
  const singleLine = sourceCode.replace(/\s+/g, " ").trim();

  if (singleLine.length <= 280) {
    return singleLine;
  }

  return `${singleLine.slice(0, 277)}...`;
}

function toScoreTone(score: number): ScoreTone {
  if (score <= 3.4) {
    return "critical";
  }

  if (score <= 6.4) {
    return "warning";
  }

  return "good";
}

function randomStatus(): RoastStatus {
  return faker.helpers.weightedArrayElement([
    { value: "completed", weight: 72 },
    { value: "failed", weight: 12 },
    { value: "processing", weight: 8 },
    { value: "pending", weight: 8 },
  ]);
}

function createSourceCode(language: RoastLanguage) {
  const entityName = faker.hacker.noun().replace(/\W+/g, "") || "entity";
  const valueName = faker.hacker.verb().replace(/\W+/g, "") || "value";
  const tableName = faker.database.column().replace(/\W+/g, "_").toLowerCase();

  switch (language) {
    case "javascript":
      return [
        `function ${valueName}${faker.string.alpha({ length: 4, casing: "lower" })}(items) {`,
        "  var total = 0;",
        "  for (var i = 0; i < items.length; i++) {",
        `    if (items[i].${entityName}) total = total + items[i].${entityName};`,
        "  }",
        "  return total;",
        "}",
      ].join("\n");
    case "typescript":
      return [
        `type ${faker.person.firstName()}Payload = { value?: number; meta?: string };`,
        `export function ${valueName}(payload: ${faker.person.firstName()}Payload[]) {`,
        "  let score = 0;",
        "  for (const item of payload) {",
        "    score += item.value || 0;",
        "  }",
        "  return score as any;",
        "}",
      ].join("\n");
    case "jsx":
      return [
        "export function Widget() {",
        `  const items = ["${faker.commerce.productAdjective()}", "${faker.commerce.productAdjective()}"];`,
        "  return <div>{items.map((item, index) => <span key={index}>{item}</span>)}</div>;",
        "}",
      ].join("\n");
    case "tsx":
      return [
        "type Props = { users?: Array<{ id?: string; name?: string }> };",
        "export function UsersList(props: Props) {",
        "  return <ul>{props.users?.map((user, index) => <li key={index}>{user.name}</li>)}</ul>;",
        "}",
      ].join("\n");
    case "python":
      return [
        `def ${valueName}_${faker.word.verb()}(records):`,
        "    total = 0",
        "    for record in records:",
        `        total += record.get('${entityName}', 0)`,
        "    return total",
      ].join("\n");
    case "sql":
      return [
        `SELECT * FROM ${tableName}`,
        `WHERE ${faker.database.column().replace(/\W+/g, "_").toLowerCase()} = input`,
        "ORDER BY created_at DESC;",
      ].join("\n");
    case "bash":
      return [
        "#!/usr/bin/env bash",
        `FILES=$(ls ${faker.system.directoryPath()})`,
        'for file in $FILES; do echo "$file"; done',
        `rm -rf ./${faker.system.fileName()}`,
      ].join("\n");
    case "json":
      return JSON.stringify(
        {
          id: faker.string.uuid(),
          enabled: faker.datatype.boolean(),
          name: faker.person.fullName(),
          retries: faker.number.int({ min: 0, max: 9 }),
        },
        null,
        2,
      );
    case "plaintext":
      return faker.lorem.paragraph();
  }
}

function createFindings(scoreTone: ScoreTone) {
  const severities: FindingSeverity[] =
    scoreTone === "critical"
      ? ["critical", "warning", "good"]
      : scoreTone === "warning"
        ? ["warning", "critical", "good"]
        : ["good", "warning", "critical"];

  const count = faker.number.int({ min: 2, max: 4 });

  return Array.from({ length: count }, (_, index) => ({
    position: index + 1,
    severity: severities[index % severities.length],
    title: faker.hacker.phrase().slice(0, 160),
    description: faker.lorem.sentences({ min: 1, max: 2 }),
  }));
}

function createDiffLines(sourceCode: string) {
  const sourceLines = sourceCode.split("\n").slice(0, 4);
  const diffLines: Array<{ kind: DiffLineKind; content: string }> =
    sourceLines.map((line) => ({
      kind: "removed",
      content: line,
    }));

  diffLines.push({
    kind: "added",
    content: `// improved: ${faker.hacker.phrase()}`,
  });
  diffLines.push({
    kind: "context",
    content: faker.lorem.sentence(),
  });

  return diffLines;
}

async function main() {
  const roastSeedData = Array.from({ length: TOTAL_ROASTS }, () => {
    const language = faker.helpers.arrayElement(languages);
    const status = randomStatus();
    const sourceCode = createSourceCode(language);
    const createdAt = faker.date.recent({ days: 45 });
    const updatedAt = faker.date.between({ from: createdAt, to: new Date() });

    if (status !== "completed") {
      return {
        roast: {
          sourceCode,
          snippetPreview: toSnippetPreview(sourceCode),
          language,
          languageSource: faker.helpers.arrayElement(["auto", "manual"]),
          lineCount: countLines(sourceCode),
          roastModeEnabled: faker.datatype.boolean({ probability: 0.8 }),
          status,
          processingError:
            status === "failed"
              ? faker.helpers.arrayElement(failedReasons)
              : null,
          createdAt,
          updatedAt,
        },
        findings: [],
        diffLines: [],
      };
    }

    const scoreNumber = faker.number.float({
      min: 1.2,
      max: 9.8,
      fractionDigits: 1,
    });
    const score = scoreNumber.toFixed(1);
    const scoreTone = toScoreTone(scoreNumber);
    const completedAt = faker.date.between({ from: updatedAt, to: new Date() });

    return {
      roast: {
        sourceCode,
        snippetPreview: toSnippetPreview(sourceCode),
        language,
        languageSource: faker.helpers.arrayElement(["auto", "manual"]),
        lineCount: countLines(sourceCode),
        roastModeEnabled: faker.datatype.boolean({ probability: 0.85 }),
        status,
        score,
        scoreTone,
        verdictLabel: faker.helpers.arrayElement(verdictLabels),
        headline: faker.helpers.arrayElement(completedHeadlines),
        summary: faker.lorem.sentences({ min: 1, max: 2 }),
        completedAt,
        createdAt,
        updatedAt: completedAt,
      },
      findings: createFindings(scoreTone),
      diffLines: createDiffLines(sourceCode),
    };
  });

  await db.delete(roasts);

  const insertedRoasts = await db
    .insert(roasts)
    .values(roastSeedData.map((entry) => entry.roast))
    .returning({ id: roasts.id });

  const findingRows = insertedRoasts.flatMap(
    (insertedRoast, roastIndex) =>
      roastSeedData[roastIndex]?.findings.map((finding) => ({
        roastId: insertedRoast.id,
        position: finding.position,
        severity: finding.severity,
        title: finding.title,
        description: finding.description,
      })) ?? [],
  );

  const diffLineRows = insertedRoasts.flatMap(
    (insertedRoast, roastIndex) =>
      roastSeedData[roastIndex]?.diffLines.map((diffLine, diffLineIndex) => ({
        roastId: insertedRoast.id,
        position: diffLineIndex + 1,
        kind: diffLine.kind,
        content: diffLine.content,
      })) ?? [],
  );

  if (findingRows.length > 0) {
    await db.insert(roastFindings).values(findingRows);
  }

  if (diffLineRows.length > 0) {
    await db.insert(roastDiffLines).values(diffLineRows);
  }

  console.log(
    `Seeded ${insertedRoasts.length} roasts, ${findingRows.length} findings and ${diffLineRows.length} diff lines.`,
  );
}

main()
  .catch((error) => {
    console.error("Failed to seed database.", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
