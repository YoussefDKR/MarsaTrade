import { DashboardPage } from "@/components/DashboardPage";
import { getFreightRoutes } from "@/data/market-data";
import { TrendingDown, TrendingUp } from "lucide-react";

export default async function FreightPage() {
  const freightRoutes = await getFreightRoutes();

  return (
    <DashboardPage>
      <div className="space-y-5 p-6">
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Freight rates are manually compiled weekly from carrier indices and trade contacts — labeled as periodically updated, not real-time spot.
        </div>
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs text-slate-500">
                <th className="px-5 py-3 font-medium">Route</th>
                <th className="px-5 py-3 font-medium">Container</th>
                <th className="px-5 py-3 font-medium">Rate (USD)</th>
                <th className="px-5 py-3 font-medium">7d Change</th>
                <th className="px-5 py-3 font-medium">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {freightRoutes.map((route) => {
                const up = route.change7d >= 0;
                return (
                  <tr key={route.id} className="border-b border-slate-50">
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
                    <td className="px-5 py-4 text-xs text-slate-400">
                      {route.lastUpdated}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardPage>
  );
}
