"use client";

import { speciesColors } from "@/data/reference-data";
import { Info } from "lucide-react";
import type { Species } from "@/types";
import { useLocale } from "@/i18n/LocaleProvider";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Props = {
  species: Species[];
  lastUpdated: string;
};

export function PriceTrendsChart({ species, lastUpdated }: Props) {
  const { t, locale } = useLocale();

  if (species.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-800">{t("dashboard.priceTrends")}</h2>
        <p className="mt-4 text-sm text-slate-500">{t("dashboard.priceLoading")}</p>
      </div>
    );
  }

  const chartData = species[0]?.history.map((point, i) => {
    const row: Record<string, string | number> = { date: point.date };
    species.forEach((s) => {
      row[s.id] = s.history[i]?.price ?? 0;
    });
    return row;
  }) ?? [];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-slate-800">
            {t("dashboard.priceTrends")}
          </h2>
          <Info size={14} className="text-slate-400" />
        </div>
        <span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600">
          6M
        </span>
      </div>

      <div className="flex gap-6">
        <div className="w-44 shrink-0 space-y-3">
          {species.map((s) => (
            <div key={s.id} className="flex items-center gap-2">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: speciesColors[s.id] }}
              />
              <div>
                <p className="text-xs font-medium text-slate-700">{s.displayName}</p>
                <p className="text-xs text-slate-500">
                  €{s.currentPrice.toFixed(2)}{" "}
                  <span
                    className={
                      s.change24h >= 0 ? "text-emerald-600" : "text-red-500"
                    }
                  >
                    ({s.change24h >= 0 ? "+" : ""}
                    {s.change24h}%)
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="h-64 flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                tickFormatter={(v) => {
                  const [, month] = String(v).split("-");
                  const months =
                    locale === "fr"
                      ? [
                          "Jan", "Fév", "Mar", "Avr", "Mai", "Juin",
                          "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc",
                        ]
                      : [
                          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
                        ];
                  return months[parseInt(month, 10) - 1] ?? v;
                }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                domain={["auto", "auto"]}
                tickFormatter={(v) => `€${v}`}
              />
              <Tooltip
                formatter={(value: number) => [`€${value.toFixed(2)}`, ""]}
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "1px solid #e2e8f0",
                }}
              />
              {species.map((s) => (
                <Line
                  key={s.id}
                  type="monotone"
                  dataKey={s.id}
                  stroke={speciesColors[s.id]}
                  strokeWidth={2}
                  dot={false}
                  name={s.displayName}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <p className="mt-3 text-[10px] text-slate-400">
        {t("dashboard.updatedWeekly", { date: lastUpdated })}
      </p>
    </div>
  );
}
