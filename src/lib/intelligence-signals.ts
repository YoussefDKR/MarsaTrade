import { getSpecies, getFreightRoutes } from "@/data/market-data";
import { computeDashboardMetrics } from "@/lib/metrics";

export type IntelItem = {
  key: string;
  vars?: Record<string, string | number>;
};

export async function getMarketSignals(): Promise<IntelItem[]> {
  const [species, freightRoutes, metrics] = await Promise.all([
    getSpecies(),
    getFreightRoutes(),
    computeDashboardMetrics(),
  ]);

  const signals: IntelItem[] = [];

  const priceChange = metrics.avgLandedCost.change7d;
  if (priceChange < 0) {
    signals.push({
      key: "pages.signalPriceDown",
      vars: { pct: Math.abs(priceChange).toFixed(1) },
    });
  } else if (priceChange > 0) {
    signals.push({
      key: "pages.signalPriceUp",
      vars: { pct: priceChange.toFixed(1) },
    });
  }

  const freightChange = metrics.freightIndex.change7d;
  if (freightChange > 0) {
    signals.push({
      key: "pages.signalFreightUp",
      vars: { pct: freightChange.toFixed(1) },
    });
  } else if (freightChange < 0) {
    signals.push({
      key: "pages.signalFreightDown",
      vars: { pct: Math.abs(freightChange).toFixed(1) },
    });
  }

  const volatile = [...species].sort(
    (a, b) => Math.abs(b.change24h) - Math.abs(a.change24h)
  )[0];
  if (volatile) {
    signals.push({
      key: "pages.signalVolatile",
      vars: {
        species: volatile.displayName,
        pct: Math.abs(volatile.change24h).toFixed(1),
        direction: volatile.change24h >= 0 ? "up" : "down",
      },
    });
  }

  const topRoute = [...freightRoutes].sort(
    (a, b) => Math.abs(b.change7d) - Math.abs(a.change7d)
  )[0];
  if (topRoute) {
    signals.push({
      key: "pages.signalRoute",
      vars: {
        origin: topRoute.origin,
        destination: topRoute.destination,
        pct: Math.abs(topRoute.change7d).toFixed(1),
        direction: topRoute.change7d >= 0 ? "up" : "down",
      },
    });
  }

  if (signals.length === 0) {
    signals.push({ key: "pages.signalStable" });
  }

  return signals.slice(0, 5);
}

export async function getWatchlistAlerts(): Promise<IntelItem[]> {
  const [species, freightRoutes] = await Promise.all([
    getSpecies(),
    getFreightRoutes(),
  ]);

  const alerts: IntelItem[] = [];

  const cheapest = [...species].sort((a, b) => a.change24h - b.change24h)[0];
  if (cheapest && cheapest.change24h < 0) {
    alerts.push({
      key: "pages.alertBuy",
      vars: { species: cheapest.displayName, pct: Math.abs(cheapest.change24h).toFixed(1) },
    });
  }

  const expensive = [...species].sort((a, b) => b.change24h - a.change24h)[0];
  if (expensive && expensive.change24h > 0) {
    alerts.push({
      key: "pages.alertPeak",
      vars: { species: expensive.displayName },
    });
  }

  const freightAlert = [...freightRoutes].sort(
    (a, b) => b.change7d - a.change7d
  )[0];
  if (freightAlert) {
    alerts.push({
      key: "pages.alertFreight",
      vars: {
        origin: freightAlert.origin,
        destination: freightAlert.destination,
        pct: freightAlert.change7d.toFixed(1),
      },
    });
  }

  alerts.push({
    key: "pages.alertWatchlist",
    vars: { count: species.length },
  });

  return alerts.slice(0, 4);
}
