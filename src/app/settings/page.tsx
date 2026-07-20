import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { DashboardShell } from "@/components/DashboardShell";
import { Header } from "@/components/Header";
import { SettingsClient } from "@/components/SettingsClient";
import {
  getSubscriptionDetails,
  isStripeEnabled,
} from "@/lib/subscription";

export default async function SettingsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const stripeEnabled = isStripeEnabled();
  const subscription = await getSubscriptionDetails(user, stripeEnabled);

  return (
    <DashboardShell user={user}>
      <Header user={user} />
      <Suspense fallback={<div className="p-6 text-sm text-slate-500">Loading…</div>}>
        <SettingsClient user={user} subscription={subscription} />
      </Suspense>
    </DashboardShell>
  );
}
