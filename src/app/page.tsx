import { HomePageClient } from "@/app/home-page-client";
import { HomeMetrics } from "@/components/ui";

export default function HomePage() {
  return <HomePageClient metricsSlot={<HomeMetrics />} />;
}
