import { handleStripeWebhook } from "@/lib/subscription";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature") ?? "";

  const result = await handleStripeWebhook(body, signature);
  if (!result.received) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ received: true });
}
