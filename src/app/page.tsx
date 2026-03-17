import { Suspense } from "react";
import { HomeLeaderboardSection } from "@/app/home-leaderboard-section";
import { HomeLeaderboardSkeleton } from "@/app/home-leaderboard-skeleton";
import { HomePageClient } from "@/app/home-page-client";
import { HomeMetrics } from "@/components/ui";

export default function HomePage() {
  return (
    <HomePageClient
      leaderboardSlot={
        <Suspense fallback={<HomeLeaderboardSkeleton />}>
          <HomeLeaderboardSection />
        </Suspense>
      }
      metricsSlot={<HomeMetrics />}
    />
  );
}
