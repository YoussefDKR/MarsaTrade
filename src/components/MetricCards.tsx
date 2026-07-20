"use client";

import { TrendingDown, TrendingUp, Fish, Newspaper } from "lucide-react";
import type { DashboardMetrics } from "@/types";
import { useLocale } from "@/i18n/LocaleProvider";

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 32;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={w} height={h} className="opacity-80">
      <polyline fill="none" stroke={color} strokeWidth="2" points={points} />
    </svg>
  );
}

type Props = {
  metrics: DashboardMetrics;
  newsCount?: number;
};

export function MetricCards({ metrics, newsCount }: Props) {
  const { t } = useLocale();

  const cards = [
    {
      label: t("metrics.avgLandedCost"),
      value: `€${metrics.avgLandedCost.value.toFixed(2)}`,
      unit: t("common.perKg"),
      change: metrics.avgLandedCost.change7d,
      sparkline: metrics.avgLandedCost.sparkline,
      sparkColor: "#2563eb",
      icon: null,
    },
    {
      label: t("metrics.freightIndex"),
      value: metrics.freightIndex.value.toLocaleString(),
      unit: "",
      change: metrics.freightIndex.change7d,
      sparkline: metrics.freightIndex.sparkline,
      sparkColor: "#8b5cf6",
      icon: null,
    },
    {
      label: t("metrics.topSpecies"),
      value: String(metrics.watchlistCount),
      unit: ` ${t("common.inWatchlist")}`,
      change: null,
      sparkline: null,
      sparkColor: "",
      icon: <Fish size={20} className="text-emerald-500" />,
    },
    {
      label: t("metrics.aiNews"),
      value: String(newsCount ?? metrics.newsToday),
      unit: ` ${t("common.newToday")}`,
      change: null,
      sparkline: null,
      sparkColor: "",
      icon: <Newspaper size={20} className="text-amber-600" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
        >
          <p className="text-xs text-slate-500">{card.label}</p>
          <div className="mt-2 flex items-end justify-between">
            <div>
              <span className="text-2xl font-bold text-slate-800">{card.value}</span>
              {card.unit && <span className="text-sm text-slate-500">{card.unit}</span>}
              {card.change !== null && (
                <div
                  className={`mt-1 flex items-center gap-1 text-xs font-medium ${
                    card.change < 0 ? "text-emerald-600" : "text-red-500"
                  }`}
                >
                  {card.change < 0 ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
                  {Math.abs(card.change)}% {t("common.vsLast7Days")}
                </div>
              )}
            </div>
            {card.sparkline ? (
              <Sparkline data={card.sparkline} color={card.sparkColor} />
            ) : (
              card.icon
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
