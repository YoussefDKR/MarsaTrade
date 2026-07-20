import { redirect } from "next/navigation";
import { LandingPage } from "@/components/LandingPage";
import { getSessionUser } from "@/lib/auth";
import { fetchExchangeRates } from "@/lib/currency";

export default async function HomePage() {
  const user = await getSessionUser();
  if (user) redirect("/dashboard");

  const ratesResult = await fetchExchangeRates("EUR").catch(() => null);

  return <LandingPage rates={ratesResult} />;
}
