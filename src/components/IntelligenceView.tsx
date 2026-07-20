"use client";

import { MetricCards } from "@/components/MetricCards";
import { PageHeader } from "@/components/PageHeader";
import type { DashboardMetrics } from "@/types";
import type { IntelItem } from "@/lib/intelligence-signals";
import { useLocale } from "@/i18n/LocaleProvider";

type Props = {
  metrics: DashboardMetrics;
  newsCount: number;
  signals: IntelItem[];
  alerts: IntelItem[];
};

function translateItem(
  t: (key: string, vars?: Record<string, string | number>) => string,
  item: IntelItem
) {
  const vars = { ...item.vars };
  if (vars?.direction === "up") vars.direction = t("pages.dirUp");
  if (vars?.direction === "down") vars.direction = t("pages.dirDown");
  return t(item.key, vars);
}

export function IntelligenceView({ metrics, newsCount, signals, alerts }: Props) {
  const { t } = useLocale();

  return (
    <>
      <PageHeader titleKey="nav.intelligence" descriptionKey="pages.intelligenceDesc" />
      <div className="space-y-5 p-6">
        <MetricCards metrics={metrics} newsCount={newsCount} />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-800">{t("pages.marketSignals")}</h3>
            <ul className="mt-3 space-y-2.5 text-sm text-slate-600">
              {signals.map((s) => (
                <li key={s.key + JSON.stringify(s.vars)} className="flex gap-2">
                  <span className="text-navy-600">•</span>
                  {translateItem(t, s)}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-800">{t("pages.watchlistAlerts")}</h3>
            <ul className="mt-3 space-y-2.5 text-sm text-slate-600">
              {alerts.map((a) => (
                <li key={a.key + JSON.stringify(a.vars)} className="flex gap-2">
                  <span className="text-amber-500">•</span>
                  {translateItem(t, a)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
