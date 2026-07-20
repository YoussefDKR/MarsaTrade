import { DashboardPage } from "@/components/DashboardPage";
import { ReportsView } from "@/components/ReportsView";
import { getSpecies, getFreightRoutes, getLastUpdated } from "@/data/market-data";
import { computeDashboardMetrics } from "@/lib/metrics";

export default async function ReportsPage() {
  const [species, freightRoutes, lastUpdated, metrics] = await Promise.all([
    getSpecies(),
    getFreightRoutes(),
    getLastUpdated(),
    computeDashboardMetrics(),
  ]);

  return (
    <DashboardPage>
      <ReportsView
        species={species}
        freightRoutes={freightRoutes}
        metrics={metrics}
        lastUpdated={lastUpdated}
      />
    </DashboardPage>
  );
}
