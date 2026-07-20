import type { Currency, Incoterm } from "@/types";

export const INCOTERMS: Incoterm[] = ["FOB", "CIF", "CFR", "DAP"];
export const CURRENCIES: Currency[] = ["EUR", "USD", "MAD", "GBP"];
/** Currencies shown in the landed cost calculator */
export const CALCULATOR_CURRENCIES = ["EUR", "USD", "MAD"] as const;
export type CalculatorCurrency = (typeof CALCULATOR_CURRENCIES)[number];
