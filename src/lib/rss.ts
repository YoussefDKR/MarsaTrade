export type ParsedRssItem = {
  title: string;
  link: string;
  content: string;
  pubDate: string;
};

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractTag(block: string, tag: string): string {
  const cdata = new RegExp(
    `<${tag}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*</${tag}>`,
    "i"
  );
  const cdataMatch = block.match(cdata);
  if (cdataMatch) return decodeEntities(cdataMatch[1]);

  const plain = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i");
  const plainMatch = block.match(plain);
  return plainMatch ? decodeEntities(plainMatch[1]) : "";
}

function extractAtomLink(block: string): string {
  const hrefMatch = block.match(/<link[^>]+href=["']([^"']+)["']/i);
  if (hrefMatch) return hrefMatch[1];
  return extractTag(block, "link");
}

export function parseRssXml(xml: string): ParsedRssItem[] {
  const items: ParsedRssItem[] = [];

  const rssBlocks = [...xml.matchAll(/<item[\s>][\s\S]*?<\/item>/gi)].map((m) => m[0]);
  const atomBlocks = [...xml.matchAll(/<entry[\s>][\s\S]*?<\/entry>/gi)].map((m) => m[0]);
  const blocks = rssBlocks.length > 0 ? rssBlocks : atomBlocks;
  const isAtom = rssBlocks.length === 0 && atomBlocks.length > 0;

  for (const block of blocks) {
    const title = extractTag(block, "title");
    const link = isAtom ? extractAtomLink(block) : extractTag(block, "link");
    const content =
      extractTag(block, "content:encoded") ||
      extractTag(block, "description") ||
      extractTag(block, "summary") ||
      extractTag(block, "content");
    const pubDate =
      extractTag(block, "pubDate") ||
      extractTag(block, "published") ||
      extractTag(block, "updated");

    if (title) {
      items.push({ title, link, content, pubDate });
    }
  }

  return items;
}

export async function fetchRssFeed(feedUrl: string): Promise<ParsedRssItem[]> {
  const parsed = new URL(feedUrl);
  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("Invalid feed URL");
  }

  const res = await fetch(parsed.toString(), {
    next: { revalidate: 3600 },
    headers: {
      "User-Agent": "MarsaTrade/1.0 (Seafood Intelligence Dashboard)",
      Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml",
    },
  });

  if (!res.ok) {
    throw new Error(`Feed fetch failed: ${res.status}`);
  }

  const xml = await res.text();
  return parseRssXml(xml);
}
