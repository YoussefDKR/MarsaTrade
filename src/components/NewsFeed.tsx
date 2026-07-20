"use client";

import type { NewsItem } from "@/types";
import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";

const categoryColors: Record<string, string> = {
  Regulation: "bg-blue-100 text-blue-700",
  Disruption: "bg-red-100 text-red-700",
  "Market Update": "bg-emerald-100 text-emerald-700",
  "Price Trend": "bg-amber-100 text-amber-700",
};

type Props = {
  items: NewsItem[];
  variant?: "default" | "sidebar";
  className?: string;
};

export function NewsFeed({ items, variant = "default", className = "" }: Props) {
  const { t } = useLocale();
  const limit = variant === "sidebar" ? 8 : 4;
  const displayed = items.slice(0, limit);

  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${
        variant === "sidebar" ? "flex min-h-[720px] flex-col xl:min-h-0 xl:h-full" : ""
      } ${className}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-800">{t("dashboard.newsFeed")}</h2>
        <Link
          href="/news"
          className="text-xs font-medium text-navy-600 hover:underline"
        >
          {t("common.viewAll")}
        </Link>
      </div>

      {displayed.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
          {t("dashboard.newsLoading")}
        </div>
      ) : (
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto">
          {displayed.map((item) => (
            <article
              key={item.id}
              className="border-b border-slate-100 pb-4 last:border-0 last:pb-0"
            >
              <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
                    categoryColors[item.category] ?? "bg-slate-100 text-slate-600"
                  }`}
                >
                  {item.category}
                </span>
                {item.languages.map((lang) => (
                  <span
                    key={lang}
                    className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600"
                  >
                    {lang}
                  </span>
                ))}
                {item.aiSummarized && (
                  <span className="rounded bg-violet-100 px-1.5 py-0.5 text-[10px] font-medium text-violet-700">
                    {t("dashboard.aiSummary")}
                  </span>
                )}
              </div>
              <h3 className="text-sm font-semibold leading-snug text-slate-800">
                {item.title}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {item.summary}
              </p>
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1.5 inline-block text-xs font-medium text-navy-600 hover:underline"
              >
                {t("dashboard.readArticle")}
              </a>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
