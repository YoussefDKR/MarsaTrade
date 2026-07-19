"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { SessionUser } from "@/types/auth";
import { formatBillingDate, getPlanLabel, PRO_PRICE_EUR } from "@/lib/subscription-utils";
import { hasActiveSubscription } from "@/lib/user-utils";
import { Crown, LogOut, CreditCard } from "lucide-react";

type Props = {
  user: SessionUser;
  stripeEnabled: boolean;
};

export function SettingsClient({ user, stripeEnabled }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const expiredRedirect = searchParams.get("expired") === "1";
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const active = hasActiveSubscription(user);

  async function handleSubscription(action: "checkout" | "portal" | "mock-upgrade") {
    setLoading(true);
    setMessage("");
    const res = await fetch("/api/subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    const data = await res.json();
    setLoading(false);

    if (data.url) {
      window.location.href = data.url;
      return;
    }
    if (data.ok) {
      setMessage("Upgraded to Pro! Refreshing…");
      router.refresh();
      return;
    }
    setMessage(data.error ?? "Action failed");
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const billingDate =
    user.plan === "trial"
      ? formatBillingDate(user.trialEndsAt)
      : formatBillingDate(user.billingEndsAt);

  return (
    <div className="mx-auto max-w-xl space-y-6 p-6">
      {expiredRedirect && !active && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Your subscription has expired. Upgrade below to regain access to the dashboard.
        </div>
      )}
      {message && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
          {message}
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-800">Account</h2>
        <div className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Name</span>
            <span className="font-medium">{user.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Email</span>
            <span className="font-medium">{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Company</span>
            <span className="font-medium">{user.company}</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <Crown size={18} className="text-amber-500" />
          <h2 className="text-sm font-semibold text-slate-800">Subscription</h2>
        </div>
        <div className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Plan</span>
            <span className={`font-medium ${active ? "text-emerald-600" : "text-red-500"}`}>
              {getPlanLabel(user.plan)} {active ? "" : "(expired)"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">
              {user.plan === "trial" ? "Trial ends" : "Next billing"}
            </span>
            <span className="font-medium">{billingDate}</span>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {user.plan !== "pro" && (
            <>
              {stripeEnabled ? (
                <button
                  onClick={() => handleSubscription("checkout")}
                  disabled={loading}
                  className="flex items-center gap-2 rounded-lg bg-navy-600 px-4 py-2 text-sm font-medium text-white hover:bg-navy-700 disabled:opacity-50"
                >
                  <CreditCard size={16} />
                  Upgrade to Pro — €{PRO_PRICE_EUR}/mo
                </button>
              ) : (
                <button
                  onClick={() => handleSubscription("mock-upgrade")}
                  disabled={loading}
                  className="flex items-center gap-2 rounded-lg bg-navy-600 px-4 py-2 text-sm font-medium text-white hover:bg-navy-700 disabled:opacity-50"
                >
                  <CreditCard size={16} />
                  Upgrade to Pro (demo)
                </button>
              )}
            </>
          )}
          {user.plan === "pro" && stripeEnabled && (
            <button
              onClick={() => handleSubscription("portal")}
              disabled={loading}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Manage billing
            </button>
          )}
        </div>
      </div>

      {user.role === "admin" && (
        <div className="rounded-xl border border-violet-200 bg-violet-50 p-6">
          <h2 className="text-sm font-semibold text-violet-800">Admin</h2>
          <p className="mt-1 text-sm text-violet-600">
            Update species prices and freight rates.
          </p>
          <a
            href="/admin"
            className="mt-3 inline-block rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
          >
            Open Data Admin →
          </a>
        </div>
      )}

      <button
        onClick={logout}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-red-500"
      >
        <LogOut size={16} />
        Sign out
      </button>
    </div>
  );
}
