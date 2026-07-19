import { DashboardPage } from "@/components/DashboardPage";
import { MetricCards } from "@/components/MetricCards";
import { PriceTrendsChart } from "@/components/PriceTrendsChart";
import { FreightRatesPanel } from "@/components/FreightRatesPanel";
import { NewsFeed } from "@/components/NewsFeed";
import { LandedCostCalculator } from "@/components/LandedCostCalculator";
import { getSpecies, getFreightRoutes, getLastUpdated } from "@/data/market-data";
import { computeDashboardMetrics } from "@/lib/metrics";
import { countNewsToday, getNewsFeed } from "@/lib/news";

export default async function HomePage() {
  const [species, freightRoutes, lastUpdated, metrics, news] = await Promise.all([
    getSpecies(),
    getFreightRoutes(),
    getLastUpdated(),
    computeDashboardMetrics(),
    getNewsFeed(),
  ]);
  const newsCount = countNewsToday(news);

  return (
    <DashboardPage>
      <div className="space-y-5 p-6">
        <MetricCards metrics={metrics} newsCount={newsCount} />

        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-7">
            <PriceTrendsChart species={species} lastUpdated={lastUpdated} />
          </div>
          <div className="col-span-2">
            <FreightRatesPanel routes={freightRoutes} />
          </div>
          <div className="col-span-3">
            <NewsFeed items={news} />
          </div>
        </div>

        <LandedCostCalculator species={species} />
      </div>
    </DashboardPage>
  );
}
