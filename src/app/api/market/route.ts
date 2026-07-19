import { getSpecies, getFreightRoutes, getLastUpdated } from "@/data/market-data";
import { NextResponse } from "next/server";

export async function GET() {
  const [species, freightRoutes, lastUpdated] = await Promise.all([
    getSpecies(),
    getFreightRoutes(),
    getLastUpdated(),
  ]);

  return NextResponse.json({
    species,
    freightRoutes,
    lastUpdated,
    note: "Prices and freight rates are compiled weekly from public trade sources — not real-time.",
  });
}
