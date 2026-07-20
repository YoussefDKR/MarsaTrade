import { getSessionUser } from "@/lib/auth";
import {
  createCheckoutSession,
  createPortalSession,
  subscribeMock,
  cancelMockSubscription,
  reactivateMockSubscription,
  getSubscriptionDetails,
  isStripeEnabled,
} from "@/lib/subscription";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stripeEnabled = isStripeEnabled();
  const subscription = await getSubscriptionDetails(user, stripeEnabled);

  return NextResponse.json({ subscription, stripeEnabled });
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { action } = await request.json();
  const origin = request.headers.get("origin") ?? request.nextUrl.origin;

  if (action === "checkout") {
    const result = await createCheckoutSession(user, origin);
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ url: result.url });
  }

  if (action === "portal") {
    const result = await createPortalSession(user, origin);
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ url: result.url });
  }

  if (action === "subscribe") {
    await subscribeMock(user.id);
    return NextResponse.json({ ok: true, message: "Subscribed to MarsaTrade Pro" });
  }

  if (action === "cancel") {
    await cancelMockSubscription(user.id);
    return NextResponse.json({
      ok: true,
      message: "Subscription will cancel at the end of your billing period",
    });
  }

  if (action === "reactivate") {
    await reactivateMockSubscription(user.id);
    return NextResponse.json({ ok: true, message: "Subscription reactivated" });
  }

  // legacy
  if (action === "mock-upgrade") {
    await subscribeMock(user.id);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
