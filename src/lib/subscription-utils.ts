import type { SessionUser } from "@/types/auth";

export const PRO_PRICE_EUR = 99;

export function formatBillingDate(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function getPlanLabel(plan: SessionUser["plan"]): string {
  switch (plan) {
    case "pro":
      return "Premium Plan";
    case "trial":
      return "Free Trial";
    default:
      return "No Plan";
  }
}
