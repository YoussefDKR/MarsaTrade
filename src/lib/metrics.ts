import { getSpecies, getFreightRoutes } from "@/data/market-data";
import type { DashboardMetrics } from "@/types";

export async function computeDashboardMetrics(): Promise<DashboardMetrics> {
  const species = await getSpecies();
  const freightRoutes = await getFreightRoutes();

  const avgPrice =
    species.reduce((sum, s) => sum + s.currentPrice, 0) / species.length;

  const avgFreight =
    freightRoutes.reduce((sum, r) => sum + r.rateUsd, 0) / freightRoutes.length;

  const priceSparkline = species[0]?.history.map((p) => p.price) ?? [];
  const freightSparkline = freightRoutes[0]?.history ?? [];

  const prevAvgPrice =
    species.reduce((sum, s) => sum + (s.history[s.history.length - 2]?.price ?? 0), 0) /
    species.length;

  const prevAvgFreight =
    freightRoutes.reduce(
      (sum, r) => sum + (r.history[r.history.length - 2] ?? 0),
      0
    ) / freightRoutes.length;

  return {
    avgLandedCost: {
      value: Math.round(avgPrice * 100) / 100,
      change7d: Math.round(((avgPrice - prevAvgPrice) / prevAvgPrice) * 1000) / 10,
      sparkline: priceSparkline,
    },
    freightIndex: {
      value: Math.round(avgFreight),
      change7d:
        Math.round(((avgFreight - prevAvgFreight) / prevAvgFreight) * 1000) / 10,
      sparkline: freightSparkline,
    },
    watchlistCount: species.length + 2,
    newsToday: 12,
  };
}
