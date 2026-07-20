import { DashboardPage } from "@/components/DashboardPage";
import { FreightView } from "@/components/FreightView";
import { getFreightRoutes } from "@/data/market-data";

export default async function FreightPage() {
  const freightRoutes = await getFreightRoutes();

  return (
    <DashboardPage>
      <FreightView routes={freightRoutes} />
    </DashboardPage>
  );
}
