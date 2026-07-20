"use client";

import { useState } from "react";
import { FileText, Download } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { useLocale } from "@/i18n/LocaleProvider";
import { useToast } from "@/components/ToastProvider";
import type { Species, FreightRoute } from "@/types";
import type { DashboardMetrics } from "@/types";

type Props = {
  species: Species[];
  freightRoutes: FreightRoute[];
  metrics: DashboardMetrics;
  lastUpdated: string;
};

function downloadCsv(filename: string, rows: string[][]) {
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function ReportsView({ species, freightRoutes, metrics, lastUpdated }: Props) {
  const { t } = useLocale();
  const { toast } = useToast();
  const [generating, setGenerating] = useState<string | null>(null);
  const today = new Date().toLocaleDateString();

  const reports = [
    {
      id: "weekly",
      titleKey: "pages.reportWeekly",
      descKey: "pages.reportWeeklyDesc",
      icon: FileText,
    },
    {
      id: "landed",
      titleKey: "pages.reportLanded",
      descKey: "pages.reportLandedDesc",
      icon: FileText,
    },
    {
      id: "freight",
      titleKey: "pages.reportFreight",
      descKey: "pages.reportFreightDesc",
      icon: FileText,
    },
    {
      id: "route",
      titleKey: "pages.reportRoute",
      descKey: "pages.reportRouteDesc",
      icon: FileText,
    },
  ];

  async function generate(id: string) {
    setGenerating(id);
    await new Promise((r) => setTimeout(r, 600));

    if (id === "weekly") {
      downloadCsv(`marsatrade-weekly-${today}.csv`, [
        ["Metric", "Value", "7d Change %"],
        ["Avg Landed Cost EUR/kg", String(metrics.avgLandedCost.value), String(metrics.avgLandedCost.change7d)],
        ["Freight Index", String(metrics.freightIndex.value), String(metrics.freightIndex.change7d)],
        ["Species Count", String(species.length), ""],
        ["Last Updated", lastUpdated, ""],
      ]);
    } else if (id === "landed") {
      downloadCsv(`marsatrade-landed-${today}.csv`, [
        ["Species", "FOB EUR/kg", "Current EUR/kg", "24h Change %"],
        ...species.map((s) => [s.displayName, String(s.fobPriceEur), String(s.currentPrice), String(s.change24h)]),
      ]);
    } else if (id === "freight") {
      downloadCsv(`marsatrade-freight-${today}.csv`, [
        ["Origin", "Destination", "Rate USD", "7d Change %", "Container"],
        ...freightRoutes.map((r) => [
          r.origin,
          r.destination,
          String(r.rateUsd),
          String(r.change7d),
          r.containerType,
        ]),
      ]);
    } else {
      const route = freightRoutes[0];
      downloadCsv(`marsatrade-route-${today}.csv`, [
        ["Route Analysis", `${route?.origin} → ${route?.destination}`],
        ["Rate USD", String(route?.rateUsd ?? "")],
        ["7d Change %", String(route?.change7d ?? "")],
        ["Note", "Run full analysis in Landed Cost Calculator on dashboard"],
      ]);
    }

    setGenerating(null);
    toast(t("pages.generated"), "success");
  }

  return (
    <>
      <PageHeader titleKey="pages.reportsTitle" descriptionKey="pages.reportsDesc" />
      <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
        {reports.map(({ id, titleKey, descKey, icon: Icon }) => (
          <div
            key={id}
            className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <Icon size={20} className="text-navy-600" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">{t(titleKey)}</h3>
            <p className="mt-2 flex-1 text-sm text-slate-500">{t(descKey)}</p>
            <p className="mt-3 text-[11px] text-slate-400">{t("pages.lastGen", { date: today })}</p>
            <button
              type="button"
              onClick={() => generate(id)}
              disabled={generating === id}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-navy-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 disabled:opacity-50"
            >
              <Download size={16} />
              {generating === id ? t("common.loading") : t("pages.generate")}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
