import Stripe from "stripe";
import { getUserById, getUserByStripeCustomerId, updateUserStripe } from "@/lib/store";
import type { SessionUser } from "@/types/auth";

export { PRO_PRICE_EUR } from "@/lib/subscription-utils";

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export function isStripeEnabled(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_ID);
}

export async function createCheckoutSession(
  user: SessionUser,
  origin: string
): Promise<{ url: string } | { error: string }> {
  const stripe = getStripe();
  const priceId = process.env.STRIPE_PRICE_ID;

  if (!stripe || !priceId) {
    return { error: "Stripe is not configured. Use mock upgrade in settings." };
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

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/settings?subscribed=1`,
    cancel_url: `${origin}/settings?cancelled=1`,
    metadata: { userId: user.id },
  });

  if (!session.url) return { error: "Failed to create checkout session" };
  return { url: session.url };
}

export async function createPortalSession(
  user: SessionUser,
  origin: string
): Promise<{ url: string } | { error: string }> {
  const stripe = getStripe();
  if (!stripe) return { error: "Stripe is not configured" };

  const dbUser = await getUserById(user.id);
  if (!dbUser?.stripeCustomerId) {
    return { error: "No active Stripe subscription found" };
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: dbUser.stripeCustomerId,
    return_url: `${origin}/settings`,
  });

  return { url: session.url };
}

export async function mockUpgradeToPro(userId: string): Promise<void> {
  const billingEnd = new Date();
  billingEnd.setMonth(billingEnd.getMonth() + 1);
  await updateUserStripe(userId, {
    plan: "pro",
    billingEndsAt: billingEnd.toISOString(),
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
    if (userId) {
      const billingEnd = new Date();
      billingEnd.setMonth(billingEnd.getMonth() + 1);
      await updateUserStripe(userId, {
        plan: "pro",
        stripeSubscriptionId:
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id,
        billingEndsAt: billingEnd.toISOString(),
      });
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
    const user = await getUserByStripeCustomerId(customerId);
    if (user) {
      await updateUserStripe(user.id, { plan: "none", stripeSubscriptionId: undefined });
    }
  }

  return { received: true };
}
