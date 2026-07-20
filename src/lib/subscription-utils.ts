import type { SessionUser, SubscriptionPlan } from "@/types/auth";

export const PRO_PRICE_EUR = 29;

export const PRO_FEATURES = [
  "Full dashboard & landed cost calculator",
  "Species price trends & freight rates",
  "Curated multilingual news feed",
  "Market intelligence & reports",
  "Priority email support",
];

import type { Locale } from "@/i18n/messages";

export function formatBillingDate(iso?: string, locale: Locale = "en"): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function getPlanLabel(plan: SubscriptionPlan): string {
  switch (plan) {
    case "pro":
      return "MarsaTrade Pro";
    case "trial":
      return "Free trial";
    default:
      return "No active plan";
  }
}

export function getSubscriptionStatusLabel(user: SessionUser, active: boolean): string {
  if (user.plan === "pro" && user.cancelAtPeriodEnd && active) {
    return "Cancels at period end";
  }
  if (user.plan === "pro" && !active) {
    return "Expired";
  }
  if (user.plan === "trial" && !active) {
    return "Trial expired";
  }
  if (active) {
    return "Active";
  }
  return "Inactive";
}

export type SubscriptionDetails = {
  plan: SubscriptionPlan;
  active: boolean;
  statusLabel: string;
  priceEur: number;
  stripeEnabled: boolean;
  hasStripeCustomer: boolean;
  cancelAtPeriodEnd: boolean;
  trialEndsAt?: string;
  billingEndsAt?: string;
  periodEndLabel: string;
  features: string[];
};

export function buildSubscriptionDetails(
  user: SessionUser,
  active: boolean,
  stripeEnabled: boolean,
  hasStripeCustomer: boolean
): SubscriptionDetails {
  return {
    plan: user.plan,
    active,
    statusLabel: getSubscriptionStatusLabel(user, active),
    priceEur: PRO_PRICE_EUR,
    stripeEnabled,
    hasStripeCustomer,
    cancelAtPeriodEnd: Boolean(user.cancelAtPeriodEnd),
    trialEndsAt: user.trialEndsAt,
    billingEndsAt: user.billingEndsAt,
    periodEndLabel:
      user.plan === "trial"
        ? "Trial ends"
        : user.cancelAtPeriodEnd
          ? "Access until"
          : "Next billing date",
    features: PRO_FEATURES,
  };
}
