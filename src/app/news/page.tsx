import { DashboardPage } from "@/components/DashboardPage";
import { NewsPageView } from "@/components/NewsPageView";
import { getNewsFeed } from "@/lib/news";

export default async function NewsPage() {
  const news = await getNewsFeed();

  return (
    <DashboardPage>
      <NewsPageView news={news} />
    </DashboardPage>
  );
}
