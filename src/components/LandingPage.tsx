import { LandingPageClient } from "@/components/LandingPageClient";
import type { ExchangeRates } from "@/types";

type Props = {
  rates: ExchangeRates | null;
};

export function LandingPage({ rates }: Props) {
  return <LandingPageClient rates={rates} />;
}
