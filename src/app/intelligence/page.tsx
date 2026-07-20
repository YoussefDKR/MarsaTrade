import { DashboardPage } from "@/components/DashboardPage";
import { IntelligenceView } from "@/components/IntelligenceView";
import { computeDashboardMetrics } from "@/lib/metrics";
import { countNewsToday, getNewsFeed } from "@/lib/news";
import { getMarketSignals, getWatchlistAlerts } from "@/lib/intelligence-signals";

export default async function IntelligencePage() {
  const [metrics, news, signals, alerts] = await Promise.all([
    computeDashboardMetrics(),
    getNewsFeed(),
    getMarketSignals(),
    getWatchlistAlerts(),
  ]);

  return (
    <DashboardPage>
      <IntelligenceView
        metrics={metrics}
        newsCount={countNewsToday(news)}
        signals={signals}
        alerts={alerts}
      />
    </DashboardPage>
  );
}
