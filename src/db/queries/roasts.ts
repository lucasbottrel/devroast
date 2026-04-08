import { and, asc, desc, eq, sql } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { db } from "../client";
import { roastDiffLines } from "../schema/roast-diff-lines";
import { roastFindings } from "../schema/roast-findings";
import { roasts } from "../schema/roasts";

const LEADERBOARD_REVALIDATE_IN_SECONDS = 60 * 60;

const getCachedHomeStats = unstable_cache(
  async () => {
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
  },
  ["home-stats"],
  {
    revalidate: LEADERBOARD_REVALIDATE_IN_SECONDS,
    tags: ["roasts", "home-stats"],
  },
);

const getCachedLeaderboardPreview = unstable_cache(
  async (limit: number) => {
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
  },
  ["leaderboard-preview"],
  {
    revalidate: LEADERBOARD_REVALIDATE_IN_SECONDS,
    tags: ["roasts", "leaderboard"],
  },
);

const getCachedFullLeaderboard = unstable_cache(
  async (limit: number) => {
    return db
      .select({
        id: roasts.id,
        sourceCode: roasts.sourceCode,
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
  },
  ["full-leaderboard"],
  {
    revalidate: LEADERBOARD_REVALIDATE_IN_SECONDS,
    tags: ["roasts", "leaderboard"],
  },
);

export async function getHomeStats() {
  return getCachedHomeStats();
}

export async function getLeaderboardPreview(limit = 3) {
  return getCachedLeaderboardPreview(limit);
}

export async function getFullLeaderboard(limit = 20) {
  return getCachedFullLeaderboard(limit);
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
