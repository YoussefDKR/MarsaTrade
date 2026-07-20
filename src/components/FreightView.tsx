"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import type { FreightRoute } from "@/types";
import { useLocale } from "@/i18n/LocaleProvider";

type Props = {
  routes: FreightRoute[];
};

export function FreightView({ routes }: Props) {
  const { t } = useLocale();

  return (
    <>
      <PageHeader titleKey="nav.freight" descriptionKey="pages.freightDesc" />
      <div className="space-y-5 p-6">
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {t("pages.freightDesc")}
        </div>
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs text-slate-500">
                <th className="px-5 py-3 font-medium">{t("pages.route")}</th>
                <th className="px-5 py-3 font-medium">{t("pages.container")}</th>
                <th className="px-5 py-3 font-medium">{t("pages.rateUsd")}</th>
                <th className="px-5 py-3 font-medium">{t("pages.change7d")}</th>
                <th className="px-5 py-3 font-medium">{t("pages.lastUpdated")}</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((route) => {
                const up = route.change7d >= 0;
                return (
                  <tr key={route.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="px-5 py-4 font-medium text-slate-800">
                      {route.origin} → {route.destination}
                    </td>
                    <td className="px-5 py-4 text-slate-600">{route.containerType}</td>
                    <td className="px-5 py-4 font-bold text-slate-800">
                      ${route.rateUsd.toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-medium ${
                          up ? "text-red-500" : "text-emerald-600"
                        }`}
                      >
                        {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {Math.abs(route.change7d)}%
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-400">{route.lastUpdated}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
