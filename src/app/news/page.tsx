import { DashboardPage } from "@/components/DashboardPage";
import { NewsFeed } from "@/components/NewsFeed";
import { getNewsFeed } from "@/lib/news";

export default async function NewsPage() {
  const news = await getNewsFeed();

  return (
    <DashboardPage>
      <div className="mx-auto max-w-3xl space-y-5 p-6">
        <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
          News is aggregated from 10+ RSS feeds (EN/FR/AR/JA) plus optional GNews API,
          filtered for seafood relevance, and summarized via Claude when configured.
        </div>
        <NewsFeed items={news} />
      </div>
    </DashboardPage>
  );
}
