import { getSessionUser } from "@/lib/auth";
import {
  createCheckoutSession,
  createPortalSession,
  mockUpgradeToPro,
  isStripeEnabled,
} from "@/lib/subscription";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ stripeEnabled: isStripeEnabled() });
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { action } = await request.json();
  const origin = request.headers.get("origin") ?? "http://localhost:3000";

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

  if (action === "mock-upgrade") {
    await mockUpgradeToPro(user.id);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
