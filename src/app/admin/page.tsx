"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/DashboardShell";
import { Header } from "@/components/Header";
import type { Species, FreightRoute } from "@/types";
import type { SessionUser } from "@/types/auth";
import { Loader2, Save } from "lucide-react";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [species, setSpecies] = useState<Species[]>([]);
  const [freight, setFreight] = useState<FreightRoute[]>([]);
  const [tab, setTab] = useState<"species" | "freight">("species");
  const [lastUpdated, setLastUpdated] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/auth/me").then((r) => r.json()),
      fetch("/api/admin/market").then((r) => r.json()),
    ]).then(([auth, market]) => {
      if (!auth.user || auth.user.role !== "admin") {
        router.push("/dashboard");
        return;
      }
      setUser(auth.user);
      setSpecies(market.species ?? []);
      setFreight(market.freightRoutes ?? []);
      setLastUpdated(market.lastUpdated ?? "");
    });
  }, [router]);

  async function save() {
    setSaving(true);
    setMessage("");
    const res = await fetch("/api/admin/market", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: tab,
        data: tab === "species" ? species : freight,
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (res.ok) {
      setLastUpdated(data.lastUpdated);
      setMessage("Saved successfully. Dashboard will reflect new data.");
    } else {
      setMessage(data.error ?? "Save failed");
    }
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin text-navy-600" />
      </div>
    );
  }

  return (
    <DashboardShell user={user}>
      <Header user={user} />
      <div className="space-y-5 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Data Admin</h2>
            <p className="text-sm text-slate-500">
              Update weekly compiled prices and freight rates. Last saved: {lastUpdated}
            </p>
          </div>
          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-navy-600 px-4 py-2 text-sm font-medium text-white hover:bg-navy-700 disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save {tab === "species" ? "Species" : "Freight"}
          </button>
        </div>

        {message && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {message}
          </div>
        )}

        <div className="flex gap-2">
          {(["species", "freight"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-4 py-2 text-sm font-medium capitalize ${
                tab === t
                  ? "bg-navy-600 text-white"
                  : "bg-white text-slate-600 border border-slate-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "species" ? (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50 text-left text-xs text-slate-500">
                  <th className="px-4 py-3">Species</th>
                  <th className="px-4 py-3">Price €/kg</th>
                  <th className="px-4 py-3">24h %</th>
                  <th className="px-4 py-3">FOB €/kg</th>
                  <th className="px-4 py-3">Duty %</th>
                  <th className="px-4 py-3">VAT %</th>
                </tr>
              </thead>
              <tbody>
                {species.map((s, i) => (
                  <tr key={s.id} className="border-b border-slate-50">
                    <td className="px-4 py-3 font-medium">{s.displayName}</td>
                    {(["currentPrice", "change24h", "fobPriceEur", "dutyRate", "vatRate"] as const).map(
                      (field) => (
                        <td key={field} className="px-4 py-3">
                          <input
                            type="number"
                            step="0.001"
                            value={
                              field === "dutyRate" || field === "vatRate"
                                ? (s[field] * 100).toFixed(1)
                                : s[field]
                            }
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              const updated = [...species];
                              if (field === "dutyRate" || field === "vatRate") {
                                updated[i] = { ...s, [field]: val / 100 };
                              } else {
                                updated[i] = { ...s, [field]: val };
                              }
                              setSpecies(updated);
                            }}
                            className="w-24 rounded border border-slate-200 px-2 py-1 text-sm"
                          />
                        </td>
                      )
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50 text-left text-xs text-slate-500">
                  <th className="px-4 py-3">Route</th>
                  <th className="px-4 py-3">Rate USD</th>
                  <th className="px-4 py-3">7d Change %</th>
                </tr>
              </thead>
              <tbody>
                {freight.map((r, i) => (
                  <tr key={r.id} className="border-b border-slate-50">
                    <td className="px-4 py-3 font-medium">
                      {r.origin} → {r.destination}
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={r.rateUsd}
                        onChange={(e) => {
                          const updated = [...freight];
                          updated[i] = { ...r, rateUsd: parseFloat(e.target.value) };
                          setFreight(updated);
                        }}
                        className="w-28 rounded border border-slate-200 px-2 py-1 text-sm"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        step="0.1"
                        value={r.change7d}
                        onChange={(e) => {
                          const updated = [...freight];
                          updated[i] = { ...r, change7d: parseFloat(e.target.value) };
                          setFreight(updated);
                        }}
                        className="w-24 rounded border border-slate-200 px-2 py-1 text-sm"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
