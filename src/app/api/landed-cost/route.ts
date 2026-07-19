import { fetchExchangeRates } from "@/lib/currency";
import { calculateLandedCost } from "@/lib/landed-cost";
import type { Currency, Incoterm, SpeciesId } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { speciesId, originId, destinationId, incoterm, currency } = body as {
      speciesId: SpeciesId;
      originId: string;
      destinationId: string;
      incoterm: Incoterm;
      currency: Currency;
    };

    const rates = await fetchExchangeRates("EUR");
    const result = await calculateLandedCost(
      { speciesId, originId, destinationId, incoterm, currency },
      rates
    );

    if (!result) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    return NextResponse.json({ breakdown: result, ratesDate: rates.date });
  } catch (error) {
    return NextResponse.json(
      { error: "Calculation failed", detail: String(error) },
      { status: 500 }
    );
  }
}
