import "server-only";
import crypto from "crypto";
import { fetchRssFeed } from "@/lib/rss";
import {
  RSS_FEEDS,
  SEAFOOD_KEYWORDS,
  seedNews,
  GNEWS_QUERIES,
  type RssFeed,
} from "@/data/news-data";
import type { NewsCategory, NewsItem, NewsLanguage } from "@/types";

let cachedNews: NewsItem[] | null = null;
let cacheTimestamp = 0;

const CACHE_TTL_MS =
  (parseInt(process.env.NEWS_CACHE_TTL_MINUTES ?? "60", 10) || 60) * 60 * 1000;

function makeNewsId(prefix: string, ...parts: string[]): string {
  const input = parts.filter(Boolean).join("|");
  return `${prefix}-${crypto.createHash("sha256").update(input).digest("hex").slice(0, 16)}`;
}

function dedupeNewsItems(items: NewsItem[]): NewsItem[] {
  const seenIds = new Set<string>();
  const seenLinks = new Set<string>();
  const seenTitles = new Set<string>();

  return items.filter((item) => {
    const titleKey = item.title.toLowerCase().trim();
    const linkKey = item.sourceUrl.replace(/\/$/, "").toLowerCase();

    if (seenIds.has(item.id)) return false;
    if (linkKey !== "#" && seenLinks.has(linkKey)) return false;
    if (seenTitles.has(titleKey)) return false;

    seenIds.add(item.id);
    if (linkKey !== "#") seenLinks.add(linkKey);
    seenTitles.add(titleKey);
    return true;
  });
}

function isSeafoodRelated(text: string): boolean {
  const lower = text.toLowerCase();
  return SEAFOOD_KEYWORDS.some((kw) => lower.includes(kw.trim().toLowerCase()));
}

function inferCategory(title: string, content: string): NewsCategory {
  const text = `${title} ${content}`.toLowerCase();
  if (/regulat|law|compliance|import rule|sanction|règlement|تنظيم/.test(text))
    return "Regulation";
  if (/disrupt|delay|strike|blockade|red sea|canal|storm|perturbation|اضطراب/.test(text))
    return "Disruption";
  if (/price|auction|cost|tariff|rate rise|rate fall|prix|سعر|価格/.test(text))
    return "Price Trend";
  return "Market Update";
}

function inferLanguages(
  title: string,
  content: string,
  feedLang: NewsLanguage
): NewsLanguage[] {
  const langs: NewsLanguage[] = [feedLang];
  if (/[àâäéèêëïîôùûüç]/i.test(`${title} ${content}`) && !langs.includes("FR"))
    langs.push("FR");
  if (/[\u0600-\u06FF]/.test(`${title} ${content}`) && !langs.includes("AR"))
    langs.push("AR");
  if (/[\u3040-\u309F\u30A0-\u30FF]/.test(`${title} ${content}`) && !langs.includes("JA"))
    langs.push("JA");
  if (/^[a-zA-Z0-9\s\-.,'":;!?()]+$/.test(title) && !langs.includes("EN"))
    langs.push("EN");
  return [...new Set(langs)];
}

function toIsoDate(pubDate: string): string {
  if (!pubDate) return new Date().toISOString();
  const d = new Date(pubDate);
  return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

async function summarizeWithClaude(
  title: string,
  content: string,
  sourceLang: NewsLanguage
): Promise<string | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 200,
        messages: [
          {
            role: "user",
            content: `Summarize this seafood trade news in 2 sentences for busy importers/exporters. Original language hint: ${sourceLang}. Be factual and concise.\n\nTitle: ${title}\n\nContent: ${content.slice(0, 1500)}`,
          },
        ],
      }),
    });

    if (!res.ok) return null;
    const data = (await res.json()) as {
      content: { type: string; text: string }[];
    };
    return data.content?.[0]?.text ?? null;
  } catch {
    return null;
  }
}

async function fetchSingleFeed(feed: RssFeed): Promise<NewsItem[]> {
  const items: NewsItem[] = [];
  try {
    const parsed = await fetchRssFeed(feed.url);
    for (const item of parsed.slice(0, 4)) {
      const title = item.title;
      const content = item.content;
      if (!title || !isSeafoodRelated(`${title} ${content}`)) continue;

      items.push({
        id: makeNewsId("rss", item.link, title),
        category: inferCategory(title, content),
        title,
        summary: content.slice(0, 220).trim() + (content.length > 220 ? "…" : ""),
        languages: inferLanguages(title, content, feed.defaultLanguage),
        sourceUrl: item.link || "#",
        sourceName: feed.name,
        publishedAt: toIsoDate(item.pubDate),
        aiSummarized: false,
      });
    }
  } catch {
    // feed unreachable
  }
  return items;
}

async function fetchGNews(): Promise<NewsItem[]> {
  const apiKey = process.env.GNEWS_API_KEY;
  if (!apiKey) return [];

  const items: NewsItem[] = [];

  await Promise.allSettled(
    GNEWS_QUERIES.map(async ({ q, lang, label }) => {
      try {
        const url = new URL("https://gnews.io/api/v4/search");
        url.searchParams.set("q", q);
        url.searchParams.set("lang", lang);
        url.searchParams.set("max", "3");
        url.searchParams.set("apikey", apiKey);

        const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
        if (!res.ok) return;
        const data = (await res.json()) as {
          articles: {
            title: string;
            description: string;
            url: string;
            publishedAt: string;
            source: { name: string };
          }[];
        };
        for (const article of data.articles ?? []) {
          if (!isSeafoodRelated(`${article.title} ${article.description}`)) continue;
          items.push({
            id: makeNewsId("gnews", article.url, article.title),
            category: inferCategory(article.title, article.description),
            title: article.title,
            summary: article.description?.slice(0, 220) ?? "",
            languages: [label],
            sourceUrl: article.url,
            sourceName: article.source?.name ?? "GNews",
            publishedAt: article.publishedAt,
            aiSummarized: false,
          });
        }
      } catch {
        // skip
      }
    })
  );

  return items;
}

async function enrichWithAiSummaries(items: NewsItem[]): Promise<NewsItem[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return items;

  const top = items.slice(0, 8);
  const enriched = await Promise.all(
    top.map(async (item) => {
      const aiSummary = await summarizeWithClaude(
        item.title,
        item.summary,
        item.languages[0] ?? "EN"
      );
      if (!aiSummary) return item;
      return { ...item, summary: aiSummary, aiSummarized: true };
    })
  );

  return [...enriched, ...items.slice(8)];
}

async function fetchFromRss(): Promise<NewsItem[]> {
  const results = await Promise.allSettled(
    RSS_FEEDS.map((feed) => fetchSingleFeed(feed))
  );

  const rssItems = results
    .filter((r): r is PromiseFulfilledResult<NewsItem[]> => r.status === "fulfilled")
    .flatMap((r) => r.value);

  const gnewsItems = await fetchGNews();
  const merged = [...rssItems, ...gnewsItems];
  const deduped = dedupeNewsItems(merged);

  deduped.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return enrichWithAiSummaries(deduped);
}

export async function getNewsFeed(): Promise<NewsItem[]> {
  const now = Date.now();
  if (cachedNews && now - cacheTimestamp < CACHE_TTL_MS) {
    return dedupeNewsItems(cachedNews);
  }

  const rssItems = await fetchFromRss();
  const combined = dedupeNewsItems(
    rssItems.length >= 3 ? rssItems.slice(0, 16) : [...rssItems, ...seedNews].slice(0, 16)
  );

  cachedNews = combined;
  cacheTimestamp = now;
  return combined;
}

export function countNewsToday(items: NewsItem[]): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const count = items.filter((item) => new Date(item.publishedAt) >= today).length;
  return count || items.length;
}

export function invalidateNewsCache(): void {
  cachedNews = null;
  cacheTimestamp = 0;
}
