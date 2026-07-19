import type { Currency, ExchangeRates } from "@/types";

const FRANKFURTER_BASE = "https://api.frankfurter.app";

const SUPPORTED: Currency[] = ["EUR", "USD", "MAD", "GBP"];

export async function fetchExchangeRates(
  base: Currency = "EUR"
): Promise<ExchangeRates> {
  const symbols = SUPPORTED.filter((c) => c !== base).join(",");
  const res = await fetch(
    `${FRANKFURTER_BASE}/latest?from=${base}&to=${symbols}`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) {
    throw new Error(`Frankfurter API error: ${res.status}`);
  }

  const data = (await res.json()) as {
    base: string;
    date: string;
    rates: Record<string, number>;
  };

  return {
    base: data.base,
    date: data.date,
    rates: { [base]: 1, ...data.rates },
  };
}

export function convertAmount(
  amount: number,
  from: Currency,
  to: Currency,
  rates: ExchangeRates
): number {
  if (from === to) return amount;

  const allRates = { ...rates.rates, [rates.base]: 1 };
  const inBase = from === rates.base ? amount : amount / (allRates[from] ?? 1);
  return to === rates.base ? inBase : inBase * (allRates[to] ?? 1);
}

export function formatCurrency(amount: number, currency: Currency): string {
  const symbols: Record<Currency, string> = {
    EUR: "€",
    USD: "$",
    MAD: "MAD ",
    GBP: "£",
  };
  const symbol = symbols[currency];
  if (currency === "MAD") {
    return `${symbol}${amount.toFixed(2)}`;
  }
  return `${symbol}${amount.toFixed(2)}`;
}
