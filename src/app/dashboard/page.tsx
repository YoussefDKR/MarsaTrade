import { DashboardPage } from "@/components/DashboardPage";
import { MetricCards } from "@/components/MetricCards";
import { PriceTrendsChart } from "@/components/PriceTrendsChart";
import { FreightRatesPanel } from "@/components/FreightRatesPanel";
import { NewsFeed } from "@/components/NewsFeed";
import { LandedCostCalculator } from "@/components/LandedCostCalculator";
import { getSpecies, getFreightRoutes, getLastUpdated } from "@/data/market-data";
import { computeDashboardMetrics } from "@/lib/metrics";
import { countNewsToday, getNewsFeed } from "@/lib/news";

export default async function DashboardHomePage() {
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

        <div className="grid grid-cols-12 items-start gap-5">
          {/* Main column: charts + landed cost calculator (matches mockup left) */}
          <div className="col-span-12 space-y-5 xl:col-span-8">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-10">
              <div className="lg:col-span-7">
                <PriceTrendsChart species={species} lastUpdated={lastUpdated} />
              </div>
              <div className="lg:col-span-3">
                <FreightRatesPanel routes={freightRoutes} />
              </div>
            </div>

            <section id="landed-cost" className="scroll-mt-6">
              <LandedCostCalculator species={species} />
            </section>
          </div>

          {/* Right column: full-height news feed */}
          <div className="col-span-12 xl:col-span-4">
            <NewsFeed items={news} variant="sidebar" />
          </div>
        </div>
      </div>
    </DashboardPage>
  );
}
