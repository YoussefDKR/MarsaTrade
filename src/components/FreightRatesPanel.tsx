"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import Link from "next/link";
import type { FreightRoute } from "@/types";

function MiniSparkline({ data, positive }: { data: number[]; positive: boolean }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 60;
      const y = 20 - ((v - min) / range) * 16;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={60} height={24}>
      <polyline
        fill="none"
        stroke={positive ? "#ef4444" : "#10b981"}
        strokeWidth="1.5"
        points={points}
      />
    </svg>
  );
}

type Props = {
  routes: FreightRoute[];
};

export function FreightRatesPanel({ routes }: Props) {
  const displayed = routes.slice(0, 4);

  if (displayed.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-800">
          Freight Rates by Route (USD / 40ft)
        </h2>
        <p className="mt-4 text-sm text-slate-500">Freight data is loading…</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-800">
          Freight Rates by Route (USD / 40ft)
        </h2>
        <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
          USD
        </span>
      </div>

      <div className="space-y-4">
        {displayed.map((route) => {
          const up = route.change7d >= 0;
          return (
            <div key={route.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-700">
                  {route.origin} → {route.destination}
                </p>
                <div className="mt-0.5 flex items-center gap-2">
                  <span className="text-base font-bold text-slate-800">
                    ${route.rateUsd.toLocaleString()}
                  </span>
                  <span
                    className={`flex items-center gap-0.5 text-xs font-medium ${
                      up ? "text-red-500" : "text-emerald-600"
                    }`}
                  >
                    {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                    {Math.abs(route.change7d)}%
                  </span>
                </div>
              </div>
              <MiniSparkline data={route.history} positive={up} />
            </div>
          );
        })}
      </div>

      <Link
        href="/freight"
        className="mt-4 block text-xs font-medium text-navy-600 hover:underline"
      >
        View all routes →
      </Link>

      <p className="mt-2 text-[10px] text-slate-400">
        Compiled weekly · Not real-time spot rates
      </p>
    </div>
  );
}
