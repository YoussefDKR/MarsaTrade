import { DashboardPage } from "@/components/DashboardPage";
import { PriceTrendsChart } from "@/components/PriceTrendsChart";
import { getSpecies, getLastUpdated } from "@/data/market-data";

export default async function PricesPage() {
  const [species, lastUpdated] = await Promise.all([getSpecies(), getLastUpdated()]);

  return (
    <DashboardPage>
      <div className="space-y-5 p-6">
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Species prices are compiled weekly from FAO reports and trade publications — not live market feeds.
          Last update: {lastUpdated}.
        </div>
        <PriceTrendsChart species={species} lastUpdated={lastUpdated} />
        <div className="grid grid-cols-5 gap-4">
          {species.map((s) => (
            <div
              key={s.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <p className="text-xs text-slate-500">{s.displayName}</p>
              <p className="mt-1 text-xl font-bold">€{s.currentPrice.toFixed(2)}/kg</p>
              <p
                className={`text-xs ${s.change24h >= 0 ? "text-emerald-600" : "text-red-500"}`}
              >
                {s.change24h >= 0 ? "+" : ""}
                {s.change24h}% (24h)
              </p>
              <p className="mt-2 text-[10px] text-slate-400">FOB: €{s.fobPriceEur}/kg</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardPage>
  );
}
