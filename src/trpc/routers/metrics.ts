import { getHomeStats } from "@/db/queries/roasts";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const metricsRouter = createTRPCRouter({
  home: baseProcedure.query(async () => {
    return getHomeStats();
  }),
});
