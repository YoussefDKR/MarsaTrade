import type { Origin, Destination } from "@/types";

export const origins: Origin[] = [
  { id: "agadir", name: "Agadir", country: "Morocco" },
  { id: "tangier", name: "Tangier", country: "Morocco" },
  { id: "casablanca", name: "Casablanca", country: "Morocco" },
  { id: "shanghai", name: "Shanghai", country: "China" },
  { id: "oslo", name: "Oslo", country: "Norway" },
];

export const destinations: Destination[] = [
  { id: "rotterdam", name: "Rotterdam", country: "Netherlands", dutyMultiplier: 1.0 },
  { id: "marseille", name: "Marseille", country: "France", dutyMultiplier: 1.0 },
  { id: "dubai", name: "Dubai", country: "UAE", dutyMultiplier: 0.85 },
  { id: "barcelona", name: "Barcelona", country: "Spain", dutyMultiplier: 1.0 },
  { id: "london", name: "London", country: "United Kingdom", dutyMultiplier: 1.05 },
];

export const speciesColors: Record<string, string> = {
  "tuna-yellowfin": "#2563eb",
  sardine: "#10b981",
  octopus: "#8b5cf6",
  "shrimp-vannamei": "#f59e0b",
  salmon: "#ef4444",
};

export function getOriginById(id: string): Origin | undefined {
  return origins.find((o) => o.id === id);
}

export function getDestinationById(id: string): Destination | undefined {
  return destinations.find((d) => d.id === id);
}
