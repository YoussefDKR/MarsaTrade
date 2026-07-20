import Stripe from "stripe";
import {
  getUserById,
  getUserByStripeCustomerId,
  updateUserStripe,
} from "@/lib/store";
import type { SessionUser } from "@/types/auth";
import {
  buildSubscriptionDetails,
} from "@/lib/subscription-utils";
import { hasActiveSubscription } from "@/lib/user-utils";

export { PRO_PRICE_EUR } from "@/lib/subscription-utils";

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export function isStripeEnabled(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_ID);
}

function getAppOrigin(requestOrigin: string | null, fallback = "http://localhost:3000"): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL ??
    requestOrigin ??
    fallback
  ).replace(/\/$/, "");
}

function nextBillingDate(from = new Date()): string {
  const end = new Date(from);
  end.setMonth(end.getMonth() + 1);
  return end.toISOString();
}

export async function getSubscriptionDetails(user: SessionUser, stripeEnabled: boolean) {
  const dbUser = await getUserById(user.id);
  const active = hasActiveSubscription(user);

  return buildSubscriptionDetails(
    user,
    active,
    stripeEnabled,
    Boolean(dbUser?.stripeCustomerId)
  );
}

export async function createCheckoutSession(
  user: SessionUser,
  origin: string
): Promise<{ url: string } | { error: string }> {
  const stripe = getStripe();
  const priceId = process.env.STRIPE_PRICE_ID;

  if (!stripe || !priceId) {
    return { error: "Card payments are not configured yet. Use Subscribe below." };
  }

  const dbUser = await getUserById(user.id);
  if (!dbUser) return { error: "User not found" };

  let customerId = dbUser.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
      metadata: { userId: user.id, company: user.company },
    });
    customerId = customer.id;
    await updateUserStripe(user.id, { stripeCustomerId: customerId });
  }

  const appOrigin = getAppOrigin(origin);

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appOrigin}/settings?subscribed=1`,
    cancel_url: `${appOrigin}/settings?cancelled=1`,
    metadata: { userId: user.id },
    subscription_data: {
      metadata: { userId: user.id },
    },
  });

  if (!session.url) return { error: "Failed to create checkout session" };
  return { url: session.url };
}

export async function createPortalSession(
  user: SessionUser,
  origin: string
): Promise<{ url: string } | { error: string }> {
  const stripe = getStripe();
  if (!stripe) return { error: "Billing portal is not configured" };

  const dbUser = await getUserById(user.id);
  if (!dbUser?.stripeCustomerId) {
    return { error: "No billing account found. Subscribe first." };
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: dbUser.stripeCustomerId,
    return_url: `${getAppOrigin(origin)}/settings`,
  });

  return { url: session.url };
}

export async function subscribeMock(userId: string): Promise<void> {
  await updateUserStripe(userId, {
    plan: "pro",
    billingEndsAt: nextBillingDate(),
    cancelAtPeriodEnd: false,
    stripeSubscriptionId: undefined,
  });
}

export async function cancelMockSubscription(userId: string): Promise<void> {
  await updateUserStripe(userId, { cancelAtPeriodEnd: true });
}

export async function reactivateMockSubscription(userId: string): Promise<void> {
  const user = await getUserById(userId);
  if (!user) return;

  const billingEndsAt =
    user.billingEndsAt && new Date(user.billingEndsAt) > new Date()
      ? user.billingEndsAt
      : nextBillingDate();

  await updateUserStripe(userId, {
    plan: "pro",
    billingEndsAt,
    cancelAtPeriodEnd: false,
  });
}

/** @deprecated use subscribeMock */
export async function mockUpgradeToPro(userId: string): Promise<void> {
  await subscribeMock(userId);
}

async function syncStripeSubscription(
  userId: string,
  subscription: Stripe.Subscription
): Promise<void> {
  const periodEndUnix =
    "current_period_end" in subscription
      ? Number((subscription as Stripe.Subscription & { current_period_end: number }).current_period_end)
      : Math.floor(Date.now() / 1000) + 30 * 24 * 3600;
  const periodEnd = new Date(periodEndUnix * 1000);
  const active = ["active", "trialing"].includes(subscription.status);

  await updateUserStripe(userId, {
    plan: active ? "pro" : "none",
    stripeSubscriptionId: subscription.id,
    billingEndsAt: periodEnd.toISOString(),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
  });
}

export async function handleStripeWebhook(
  body: string,
  signature: string
): Promise<{ received: boolean; error?: string }> {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !webhookSecret) {
    return { received: false, error: "Stripe webhook not configured" };
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    return { received: false, error: `Webhook error: ${err}` };
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    if (userId && session.subscription) {
      const subId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription.id;
      const subscription = await stripe.subscriptions.retrieve(subId);
      await syncStripeSubscription(userId, subscription);
    }
  }

  if (
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    const sub = event.data.object as Stripe.Subscription;
    const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
    const user = await getUserByStripeCustomerId(customerId);
    if (!user) return { received: true };

    if (event.type === "customer.subscription.deleted") {
      await updateUserStripe(user.id, {
        plan: "none",
        stripeSubscriptionId: undefined,
        cancelAtPeriodEnd: false,
      });
    } else {
      await syncStripeSubscription(user.id, sub);
    }
  }

  if (event.type === "invoice.paid") {
    const invoice = event.data.object as Stripe.Invoice;
    const customerId =
      typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;
    if (!customerId) return { received: true };

    const user = await getUserByStripeCustomerId(customerId);
    if (!user) return { received: true };

    const invoiceSub = (invoice as Stripe.Invoice & {
      subscription?: string | { id: string } | null;
    }).subscription;
    const subId =
      typeof invoiceSub === "string" ? invoiceSub : invoiceSub?.id;
    if (subId) {
      const subscription = await stripe.subscriptions.retrieve(subId);
      await syncStripeSubscription(user.id, subscription);
    }
  }

  return { received: true };
}
