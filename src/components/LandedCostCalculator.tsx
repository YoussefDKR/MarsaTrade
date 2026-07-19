"use client";

import { useCallback, useEffect, useState } from "react";
import { origins } from "@/data/reference-data";
import { CURRENCIES, INCOTERMS } from "@/lib/constants";
import { formatCurrency } from "@/lib/currency";
import type {
  Currency,
  Incoterm,
  LandedCostBreakdown,
  Species,
  SpeciesId,
} from "@/types";
import { Loader2 } from "lucide-react";

type SelectProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
};

function SelectField({ label, value, onChange, options }: SelectProps) {
  return (
    <div>
      <label className="mb-1 block text-xs text-slate-500">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

type Props = {
  species: Species[];
};

export function LandedCostCalculator({ species }: Props) {
  const [speciesId, setSpeciesId] = useState<SpeciesId>("tuna-yellowfin");
  const [originId, setOriginId] = useState("agadir");
  const [destinationId, setDestinationId] = useState("rotterdam");
  const [incoterm, setIncoterm] = useState<Incoterm>("CIF");
  const [currency, setCurrency] = useState<Currency>("EUR");
  const [breakdown, setBreakdown] = useState<LandedCostBreakdown | null>(null);
  const [ratesDate, setRatesDate] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const calculate = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/landed-cost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          speciesId,
          originId,
          destinationId,
          incoterm,
          currency,
        }),
      });
      const data = await res.json();
      if (data.breakdown) {
        setBreakdown(data.breakdown);
        setRatesDate(data.ratesDate ?? "");
      }
    } finally {
      setLoading(false);
    }
  }, [speciesId, originId, destinationId, incoterm, currency]);

  useEffect(() => {
    calculate();
  }, [calculate]);

  const rows = breakdown
    ? [
        { label: "FOB Price", value: breakdown.fob, detail: breakdown.details.fob },
        {
          label: "Freight (40ft Reefer)",
          value: breakdown.freight,
          detail: breakdown.details.freight,
        },
        {
          label: "Insurance (1.2%)",
          value: breakdown.insurance,
          detail: breakdown.details.insurance,
        },
        {
          label: "Customs Duties",
          value: breakdown.duties,
          detail: breakdown.details.duties,
        },
        { label: "VAT", value: breakdown.vat, detail: breakdown.details.vat },
      ]
    : [];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold text-slate-800">
        Landed Cost Calculator
      </h2>

      <div className="grid grid-cols-5 gap-3">
        <SelectField
          label="Species"
          value={speciesId}
          onChange={(v) => setSpeciesId(v as SpeciesId)}
          options={species.map((s) => ({
            value: s.id,
            label: s.displayName,
          }))}
        />
        <SelectField
          label="Origin"
          value={originId}
          onChange={setOriginId}
          options={origins.map((o) => ({
            value: o.id,
            label: `${o.name}, ${o.country}`,
          }))}
        />
        <SelectField
          label="Destination"
          value={destinationId}
          onChange={setDestinationId}
          options={[
            { value: "rotterdam", label: "Rotterdam, Netherlands" },
            { value: "marseille", label: "Marseille, France" },
            { value: "dubai", label: "Dubai, UAE" },
            { value: "barcelona", label: "Barcelona, Spain" },
            { value: "london", label: "London, United Kingdom" },
          ]}
        />
        <SelectField
          label="Incoterm"
          value={incoterm}
          onChange={(v) => setIncoterm(v as Incoterm)}
          options={INCOTERMS.map((i) => ({ value: i, label: i }))}
        />
        <SelectField
          label="Currency"
          value={currency}
          onChange={(v) => setCurrency(v as Currency)}
          options={CURRENCIES.map((c) => ({ value: c, label: c }))}
        />
      </div>

      <div className="mt-5 flex gap-6">
        <div className="flex-1">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs text-slate-500">
                <th className="pb-2 font-medium">Component</th>
                <th className="pb-2 font-medium">Amount</th>
                <th className="pb-2 font-medium">Details</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-slate-400">
                    <Loader2 className="mx-auto animate-spin" size={20} />
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.label} className="border-b border-slate-50">
                    <td className="py-2.5 text-slate-700">{row.label}</td>
                    <td className="py-2.5 font-semibold text-slate-800">
                      {formatCurrency(row.value, currency)}
                    </td>
                    <td className="py-2.5 text-xs text-slate-400">{row.detail}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {breakdown && !loading && (
          <div className="w-56 shrink-0 rounded-xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">Final Landed Cost</p>
            <p className="mt-1 text-2xl font-bold text-slate-800">
              {formatCurrency(breakdown.total, currency)}
              <span className="text-sm font-normal text-slate-500"> / kg</span>
            </p>
            <div className="mt-3 border-t border-slate-200 pt-3">
              <p className="text-xs text-slate-500">Estimated Margin</p>
              <p
                className={`text-lg font-bold ${
                  breakdown.margin >= 0 ? "text-emerald-600" : "text-red-500"
                }`}
              >
                {formatCurrency(breakdown.margin, currency)}
                <span className="text-xs font-normal"> / kg</span>
              </p>
              <p className="text-xs text-slate-400">
                ({breakdown.marginPercent.toFixed(1)}%)
              </p>
            </div>
          </div>
        )}
      </div>

      <p className="mt-3 text-[10px] text-slate-400">
        FX rates live via ECB (Frankfurter){ratesDate ? ` · ${ratesDate}` : ""}.
        FOB & freight from weekly compiled data.
      </p>
    </div>
  );
}
