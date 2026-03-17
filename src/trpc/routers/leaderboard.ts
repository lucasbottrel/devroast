import { getHomeStats, getLeaderboardPreview } from "@/db/queries/roasts";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const leaderboardRouter = createTRPCRouter({
  homePreview: baseProcedure.query(async () => {
    const [items, stats] = await Promise.all([
      getLeaderboardPreview(3),
      getHomeStats(),
    ]);

    return {
      items,
      totalCompletedRoasts: stats.totalCompletedRoasts,
    };
  }),
});
