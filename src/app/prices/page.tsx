import { DashboardPage } from "@/components/DashboardPage";
import { PricesView } from "@/components/PricesView";
import { getSpecies, getLastUpdated } from "@/data/market-data";

export default async function PricesPage() {
  const [species, lastUpdated] = await Promise.all([getSpecies(), getLastUpdated()]);

  return (
    <DashboardPage>
      <PricesView species={species} lastUpdated={lastUpdated} />
    </DashboardPage>
  );
}
