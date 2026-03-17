import { and, asc, desc, eq, sql } from "drizzle-orm";
import { db } from "../client";
import { roastDiffLines } from "../schema/roast-diff-lines";
import { roastFindings } from "../schema/roast-findings";
import { roasts } from "../schema/roasts";

export async function getHomeStats() {
  const [stats] = await db
    .select({
      totalCompletedRoasts: sql<number>`count(*)::int`,
      averageScore: sql<string | null>`round(avg(${roasts.score}), 1)::text`,
    })
    .from(roasts)
    .where(eq(roasts.status, "completed"));

  return {
    totalCompletedRoasts: stats?.totalCompletedRoasts ?? 0,
    averageScore:
      stats?.averageScore == null ? null : Number(stats.averageScore),
  };
}

export async function getLeaderboardPreview(limit = 3) {
  return db
    .select({
      id: roasts.id,
      sourceCode: roasts.sourceCode,
      snippetPreview: roasts.snippetPreview,
      language: roasts.language,
      lineCount: roasts.lineCount,
      score: roasts.score,
      scoreTone: roasts.scoreTone,
      createdAt: roasts.createdAt,
    })
    .from(roasts)
    .where(
      and(eq(roasts.status, "completed"), sql`${roasts.score} is not null`),
    )
    .orderBy(asc(roasts.score), desc(roasts.createdAt))
    .limit(limit);
}

export async function getLeaderboard(options?: {
  language?: (typeof roasts.$inferSelect)["language"];
  limit?: number;
}) {
  const filters = [
    eq(roasts.status, "completed"),
    sql`${roasts.score} is not null`,
  ];

  if (options?.language) {
    filters.push(eq(roasts.language, options.language));
  }

  return db
    .select({
      id: roasts.id,
      snippetPreview: roasts.snippetPreview,
      language: roasts.language,
      score: roasts.score,
      scoreTone: roasts.scoreTone,
      createdAt: roasts.createdAt,
    })
    .from(roasts)
    .where(and(...filters))
    .orderBy(asc(roasts.score), desc(roasts.createdAt))
    .limit(options?.limit ?? 50);
}

export async function getRoastDetail(roastId: string) {
  const [roast] = await db
    .select()
    .from(roasts)
    .where(eq(roasts.id, roastId))
    .limit(1);

  if (!roast) {
    return null;
  }

  const [findings, diffLines] = await Promise.all([
    db
      .select()
      .from(roastFindings)
      .where(eq(roastFindings.roastId, roastId))
      .orderBy(asc(roastFindings.position)),
    db
      .select()
      .from(roastDiffLines)
      .where(eq(roastDiffLines.roastId, roastId))
      .orderBy(asc(roastDiffLines.position)),
  ]);

  return {
    roast,
    findings,
    diffLines,
  };
}
