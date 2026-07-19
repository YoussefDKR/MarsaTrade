import { fetchExchangeRates } from "@/lib/currency";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const rates = await fetchExchangeRates("EUR");
    return NextResponse.json(rates);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch exchange rates", detail: String(error) },
      { status: 502 }
    );
  }
}
