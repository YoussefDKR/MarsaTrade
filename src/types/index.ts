export type SpeciesId =
  | "tuna-yellowfin"
  | "sardine"
  | "octopus"
  | "shrimp-vannamei"
  | "salmon";

export type SpeciesPricePoint = {
  date: string;
  price: number;
};

export type Species = {
  id: SpeciesId;
  name: string;
  displayName: string;
  unit: string;
  currentPrice: number;
  change24h: number;
  history: SpeciesPricePoint[];
  fobPriceEur: number;
  dutyRate: number;
  vatRate: number;
};

export type FreightRoute = {
  id: string;
  origin: string;
  destination: string;
  rateUsd: number;
  change7d: number;
  containerType: string;
  history: number[];
  lastUpdated: string;
};

export type NewsCategory =
  | "Regulation"
  | "Disruption"
  | "Market Update"
  | "Price Trend";

export type NewsLanguage = "EN" | "FR" | "AR" | "JA";

export type NewsItem = {
  id: string;
  category: NewsCategory;
  title: string;
  summary: string;
  languages: NewsLanguage[];
  sourceUrl: string;
  sourceName: string;
  publishedAt: string;
  aiSummarized: boolean;
};

export type Origin = {
  id: string;
  name: string;
  country: string;
};

export type Destination = {
  id: string;
  name: string;
  country: string;
  dutyMultiplier: number;
};

export type Incoterm = "FOB" | "CIF" | "CFR" | "DAP";

export type Currency = "EUR" | "USD" | "MAD" | "GBP";

export type LandedCostInput = {
  speciesId: SpeciesId;
  originId: string;
  destinationId: string;
  incoterm: Incoterm;
  currency: Currency;
};

export type LandedCostBreakdown = {
  fob: number;
  freight: number;
  insurance: number;
  duties: number;
  vat: number;
  total: number;
  margin: number;
  marginPercent: number;
  currency: Currency;
  details: {
    fob: string;
    freight: string;
    insurance: string;
    duties: string;
    vat: string;
  };
};

export type ExchangeRates = {
  base: string;
  date: string;
  rates: Record<string, number>;
};

export type DashboardMetrics = {
  avgLandedCost: { value: number; change7d: number; sparkline: number[] };
  freightIndex: { value: number; change7d: number; sparkline: number[] };
  watchlistCount: number;
  newsToday: number;
};
