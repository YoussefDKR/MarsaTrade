"use client";

import { PageHeader } from "@/components/PageHeader";
import { NewsFeed } from "@/components/NewsFeed";
import type { NewsItem } from "@/types";
import { useLocale } from "@/i18n/LocaleProvider";

type Props = {
  news: NewsItem[];
};

export function NewsPageView({ news }: Props) {
  const { t } = useLocale();

  return (
    <>
      <PageHeader titleKey="nav.news" descriptionKey="pages.newsDesc" />
      <div className="mx-auto max-w-3xl space-y-5 p-6">
        <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
          {t("pages.newsDesc")}
        </div>
        <NewsFeed items={news} />
      </div>
    </>
  );
}
