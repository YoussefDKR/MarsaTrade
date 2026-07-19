import "server-only";
import {
  getSpeciesData,
  getFreightData,
  getDataLastUpdated,
} from "@/lib/store";
import type { Species, FreightRoute } from "@/types";

export { origins, destinations, speciesColors, getOriginById, getDestinationById } from "@/data/reference-data";

export async function getSpecies(): Promise<Species[]> {
  return getSpeciesData();
}

export async function getFreightRoutes(): Promise<FreightRoute[]> {
  return getFreightData();
}

export async function getLastUpdated(): Promise<string> {
  return getDataLastUpdated();
}

export async function getSpeciesById(id: string): Promise<Species | undefined> {
  const species = await getSpecies();
  return species.find((s) => s.id === id);
}
