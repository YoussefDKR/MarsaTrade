"use client";

import { PageHeader } from "@/components/PageHeader";
import { PriceTrendsChart } from "@/components/PriceTrendsChart";
import type { Species } from "@/types";
import { useLocale } from "@/i18n/LocaleProvider";

type Props = {
  species: Species[];
  lastUpdated: string;
};

export function PricesView({ species, lastUpdated }: Props) {
  const { t } = useLocale();

  return (
    <>
      <PageHeader titleKey="nav.prices" descriptionKey="pages.pricesDesc" />
      <div className="space-y-5 p-6">
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {t("pages.pricesDesc")} {t("pages.pricesUpdated", { date: lastUpdated })}
        </div>
        <PriceTrendsChart species={species} lastUpdated={lastUpdated} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {species.map((s) => (
            <div
              key={s.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <p className="text-xs text-slate-500">{s.displayName}</p>
              <p className="mt-1 text-xl font-bold">€{s.currentPrice.toFixed(2)}/kg</p>
              <p className={`text-xs ${s.change24h >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                {s.change24h >= 0 ? "+" : ""}
                {s.change24h}% (24h)
              </p>
              <p className="mt-2 text-[10px] text-slate-400">
                {t("pages.fob")}: €{s.fobPriceEur}/kg
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
