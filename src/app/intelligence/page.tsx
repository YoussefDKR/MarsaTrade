import { DashboardPage } from "@/components/DashboardPage";
import { MetricCards } from "@/components/MetricCards";
import { computeDashboardMetrics } from "@/lib/metrics";
import { countNewsToday, getNewsFeed } from "@/lib/news";

export default async function IntelligencePage() {
  const [metrics, news] = await Promise.all([
    computeDashboardMetrics(),
    getNewsFeed(),
  ]);

  return (
    <DashboardPage>
      <div className="space-y-5 p-6">
        <p className="text-sm text-slate-600">
          Cross-market overview combining landed cost trends, freight index movement, and breaking news impact.
        </p>
        <MetricCards metrics={metrics} newsCount={countNewsToday(news)} />
        <div className="grid grid-cols-2 gap-5">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-800">Market Signals</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>• Average species prices down 4.2% — margin opportunity on EU routes</li>
              <li>• Freight index up 6.7% — factor into Q3 landed cost forecasts</li>
              <li>• Red Sea disruption may add 10–14 days to Asia–Europe lanes</li>
              <li>• Moroccan sardine export volumes up 18% — watch FOB pressure</li>
            </ul>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-800">Watchlist Alerts</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>• Tuna (Yellowfin): below 6-month average — buy signal</li>
              <li>• Octopus: near peak — monitor Moroccan landings</li>
              <li>• Agadir→Rotterdam freight: +5.1% this week</li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardPage>
  );
}
