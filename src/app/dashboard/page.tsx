import { DashboardPage } from "@/components/DashboardPage";
import { OnboardingModal } from "@/components/OnboardingModal";
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
      <OnboardingModal />
      <div className="space-y-5 p-6">
        <MetricCards metrics={metrics} newsCount={newsCount} />

        <div className="flex flex-col gap-5 xl:flex-row xl:items-stretch">
          <div className="flex min-w-0 flex-1 flex-col gap-5">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <PriceTrendsChart species={species} lastUpdated={lastUpdated} />
              </div>
              <div className="lg:col-span-5">
                <FreightRatesPanel routes={freightRoutes} />
              </div>
            </div>

            <section id="landed-cost" className="scroll-mt-6">
              <LandedCostCalculator species={species} />
            </section>
          </div>

          <aside className="w-full xl:w-[min(380px,32%)] xl:shrink-0">
            <NewsFeed items={news} variant="sidebar" className="h-full" />
          </aside>
        </div>
      </div>
    </DashboardPage>
  );
}
