/** Static dashboard preview for marketing homepage */
export function MarketingDashboardPreview() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-2xl shadow-black/40">
      <div className="flex min-h-[420px]">
        {/* Sidebar */}
        <aside className="hidden w-36 shrink-0 bg-navy-950 p-3 sm:block">
          <div className="mb-4 h-6 rounded bg-white/90" />
          <nav className="space-y-1.5">
            {["Dashboard", "Intelligence", "Prices", "Freight", "News"].map((item, i) => (
              <div
                key={item}
                className={`rounded px-2 py-1.5 text-[9px] ${
                  i === 0 ? "bg-navy-700 text-white" : "text-slate-500"
                }`}
              >
                {item}
              </div>
            ))}
          </nav>
          <div className="mt-6 rounded-lg bg-navy-800 p-2">
            <p className="text-[8px] font-semibold text-amber-400">MarsaTrade Pro</p>
            <p className="mt-1 text-[7px] text-slate-400">€29/month</p>
          </div>
        </aside>

        {/* Main */}
        <div className="min-w-0 flex-1 bg-slate-50 p-3">
          <p className="text-[10px] font-semibold text-slate-700">Welcome back</p>
          <div className="mt-2 grid grid-cols-2 gap-1.5 lg:grid-cols-4">
            {[
              { label: "Avg Landed Cost", val: "€4.62/kg", up: false },
              { label: "Freight Index", val: "2,350", up: true },
              { label: "Species", val: "5", up: null },
              { label: "News Today", val: "12", up: null },
            ].map((m) => (
              <div key={m.label} className="rounded-lg border border-slate-200 bg-white p-2">
                <p className="text-[7px] text-slate-400">{m.label}</p>
                <p className="text-[10px] font-bold text-slate-800">{m.val}</p>
              </div>
            ))}
          </div>

          <div className="mt-2 grid grid-cols-3 gap-1.5">
            <div className="col-span-2 rounded-lg border border-slate-200 bg-white p-2">
              <p className="text-[8px] font-medium text-slate-600">Price Trends</p>
              <div className="mt-2 flex h-16 items-end gap-0.5">
                {[40, 55, 48, 62, 58, 70, 65].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t bg-blue-500/70"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-2">
              <p className="text-[8px] font-medium text-slate-600">News</p>
              <div className="mt-1 space-y-1">
                {["EU regulation", "Red Sea routes", "Sardine exports"].map((t) => (
                  <p key={t} className="truncate text-[7px] text-slate-500">
                    {t}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-2 rounded-lg border border-slate-200 bg-white p-2">
            <p className="text-[8px] font-medium text-slate-600">Landed Cost Calculator</p>
            <div className="mt-1 flex gap-1">
              {["Tuna", "Agadir", "Rotterdam", "EUR"].map((t) => (
                <span
                  key={t}
                  className="rounded border border-slate-200 px-1 py-0.5 text-[6px] text-slate-500"
                >
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-2 flex justify-between">
              <span className="text-[8px] text-slate-500">Landed cost</span>
              <span className="text-[10px] font-bold text-blue-600">€4.50/kg</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
