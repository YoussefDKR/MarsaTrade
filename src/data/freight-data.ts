import "server-only";
import { getFreightRoutes } from "@/data/market-data";
import type { FreightRoute } from "@/types";

export async function getFreightRate(
  originId: string,
  destinationId: string
): Promise<FreightRoute | undefined> {
  const routes = await getFreightRoutes();
  return routes.find(
    (r) =>
      r.id === `${originId}-${destinationId}` ||
      (r.origin.toLowerCase() === originId && r.destination.toLowerCase() === destinationId)
  );
}

export async function getFreightRateByRouteKey(key: string): Promise<FreightRoute | undefined> {
  const routes = await getFreightRoutes();
  return routes.find((r) => r.id === key);
}

export function estimateFreightPerKg(route: FreightRoute, kgPerContainer = 20000): number {
  return route.rateUsd / kgPerContainer;
}
