import "server-only";
import { getDestinationById, getSpeciesById } from "@/data/market-data";
import { estimateFreightPerKg, getFreightRate } from "@/data/freight-data";
import { convertAmount } from "@/lib/currency";
import type {
  ExchangeRates,
  LandedCostBreakdown,
  LandedCostInput,
} from "@/types";

const INSURANCE_RATE = 0.012;
const KG_PER_CONTAINER = 20000;

export async function calculateLandedCost(
  input: LandedCostInput,
  rates: ExchangeRates
): Promise<LandedCostBreakdown | null> {
  const species = await getSpeciesById(input.speciesId);
  const destination = getDestinationById(input.destinationId);
  if (!species || !destination) return null;

  const route = await getFreightRate(input.originId, input.destinationId);
  const freightUsdPerKg = route
    ? estimateFreightPerKg(route, KG_PER_CONTAINER)
    : 0.12;

  const fobEur = species.fobPriceEur;
  const freightEur = freightUsdPerKg * (rates.rates.USD ?? 1.08);
  let insuranceEur = 0;
  let dutiesEur = 0;
  let vatEur = 0;

  insuranceEur = (fobEur + freightEur) * INSURANCE_RATE;
  dutiesEur =
    (fobEur + freightEur + insuranceEur) *
    species.dutyRate *
    destination.dutyMultiplier;
  vatEur = (fobEur + freightEur + insuranceEur + dutiesEur) * species.vatRate;

  const totalEur = fobEur + freightEur + insuranceEur + dutiesEur + vatEur;
  const marketPriceEur = species.currentPrice;
  const marginEur = marketPriceEur - totalEur;
  const marginPercent = totalEur > 0 ? (marginEur / totalEur) * 100 : 0;

  const toCurrency = (eur: number) =>
    convertAmount(eur, "EUR", input.currency, rates);

  return {
    fob: toCurrency(fobEur),
    freight: toCurrency(freightEur),
    insurance: toCurrency(insuranceEur),
    duties: toCurrency(dutiesEur),
    vat: toCurrency(vatEur),
    total: toCurrency(totalEur),
    margin: toCurrency(marginEur),
    marginPercent,
    currency: input.currency,
    details: {
      fob: "Price at origin",
      freight: "Sea freight cost (40ft reefer, weekly rate)",
      insurance: `Marine insurance (${(INSURANCE_RATE * 100).toFixed(1)}%)`,
      duties: `Import duty (${(species.dutyRate * 100).toFixed(1)}%)`,
      vat: `Value added tax (${(species.vatRate * 100).toFixed(0)}%)`,
    },
  };
}
