import type { NewsItem, NewsLanguage } from "@/types";

/** Seed news shown when RSS/AI pipeline has not run yet */
export const seedNews: NewsItem[] = [
  {
    id: "seed-1",
    category: "Regulation",
    title: "EU updates seafood import regulation",
    summary:
      "The European Commission published revised import documentation requirements for frozen seafood, effective Q3 2026. Exporters must now include enhanced catch certificates and cold-chain logs.",
    languages: ["EN", "FR"],
    sourceUrl: "https://ec.europa.eu/food/safety/import",
    sourceName: "EU Commission",
    publishedAt: "2026-05-27T08:00:00Z",
    aiSummarized: true,
  },
  {
    id: "seed-2",
    category: "Disruption",
    title: "Red Sea shipping disruption affects delivery times",
    summary:
      "Continued rerouting around the Cape of Good Hope is adding 10–14 days to Asia–Europe reefer lanes. Moroccan exporters to Gulf markets report moderate delays on consolidated shipments.",
    languages: ["EN", "AR"],
    sourceUrl: "https://www.joc.com",
    sourceName: "Journal of Commerce",
    publishedAt: "2026-05-27T06:30:00Z",
    aiSummarized: true,
  },
  {
    id: "seed-3",
    category: "Market Update",
    title: "Moroccan sardine exports increase 18% in April",
    summary:
      "ONPDA data shows sardine export volumes rose sharply in April, driven by strong demand from EU canneries. FOB prices remain stable despite higher volumes.",
    languages: ["FR", "AR"],
    sourceUrl: "https://www.fao.org/fishery",
    sourceName: "FAO Fishery",
    publishedAt: "2026-05-26T14:00:00Z",
    aiSummarized: true,
  },
  {
    id: "seed-4",
    category: "Price Trend",
    title: "Japanese tuna auction prices rise for high-grade cuts",
    summary:
      "Tsukiji wholesale market reports a 6% week-on-week increase for #1 grade bluefin and yellowfin loins, attributed to pre-summer restaurant demand in Tokyo and Osaka.",
    languages: ["EN", "JA"],
    sourceUrl: "https://www.seafoodsource.com",
    sourceName: "SeafoodSource",
    publishedAt: "2026-05-26T10:15:00Z",
    aiSummarized: true,
  },
];

export type RssFeed = {
  url: string;
  name: string;
  defaultLanguage: NewsLanguage;
  region: string;
};

export const RSS_FEEDS: RssFeed[] = [
  // English
  { url: "https://www.seafoodsource.com/rss", name: "SeafoodSource", defaultLanguage: "EN", region: "Global" },
  { url: "https://www.fao.org/fishery/rss/en", name: "FAO Fishery", defaultLanguage: "EN", region: "Global" },
  { url: "https://www.intrafish.com/rss", name: "IntraFish", defaultLanguage: "EN", region: "Global" },
  { url: "https://www.undercurrentnews.com/feed/", name: "Undercurrent News", defaultLanguage: "EN", region: "Global" },
  { url: "https://www.thefishsite.com/rss", name: "The Fish Site", defaultLanguage: "EN", region: "Global" },
  // French
  { url: "https://www.europeche.ch/fr/rss.xml", name: "Europeche", defaultLanguage: "FR", region: "Europe" },
  { url: "https://www.fao.org/fishery/rss/fr", name: "FAO Pêche", defaultLanguage: "FR", region: "Global" },
  // Arabic — use English feeds with Arabic keyword matching + regional sources
  { url: "https://www.agrifocus.com/feed/", name: "AgriFocus MENA", defaultLanguage: "AR", region: "MENA" },
  // Japanese
  { url: "https://www.fisheries.jp/en/rss.xml", name: "Japan Fisheries", defaultLanguage: "JA", region: "Asia" },
];

export const SEAFOOD_KEYWORDS = [
  "seafood", "fish", "tuna", "sardine", "shrimp", "salmon", "octopus",
  "aquaculture", "fisheries", "export", "import", "freight", "reefer",
  "maritime", "poisson", "fruits de mer", "pêche", "thon", "crevette",
  "أسماك", "سمك", "تونة", "جمبري", "سلmon", "exports", "imports",
  "マグロ", "サーモン", "水産", "魚", "エビ",
];

export const GNEWS_QUERIES = [
  { q: "seafood trade export", lang: "en", label: "EN" as NewsLanguage },
  { q: "poisson exportation commerce", lang: "fr", label: "FR" as NewsLanguage },
  { q: "أسماك تصدير تجارة", lang: "ar", label: "AR" as NewsLanguage },
];
