"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { SessionUser } from "@/types/auth";
import type { SubscriptionDetails } from "@/lib/subscription-utils";
import {
  formatBillingDate,
  getPlanLabel,
  PRO_FEATURES,
} from "@/lib/subscription-utils";
import { hasActiveSubscription } from "@/lib/user-utils";
import {
  Crown,
  LogOut,
  CreditCard,
  User,
  Lock,
  Check,
  AlertCircle,
} from "lucide-react";

type Props = {
  user: SessionUser;
  subscription: SubscriptionDetails;
};

export function SettingsClient({ user, subscription }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const expiredRedirect = searchParams.get("expired") === "1";
  const subscribed = searchParams.get("subscribed") === "1";
  const cancelled = searchParams.get("cancelled") === "1";

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [profile, setProfile] = useState({
    name: user.name,
    company: user.company,
    email: user.email,
  });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const active = hasActiveSubscription(user);
  const periodDate =
    user.plan === "trial" ? user.trialEndsAt : user.billingEndsAt;

  async function runSubscription(action: string) {
    setLoading(true);
    setMessage("");
    setError("");
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
      setMessage(data.message ?? "Updated successfully");
      router.refresh();
      return;
    }
    setError(data.error ?? "Action failed");
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    const res = await fetch("/api/settings/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Failed to save profile");
      return;
    }
    setMessage("Profile updated");
    router.refresh();
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    setLoading(true);
    setMessage("");
    setError("");
    const res = await fetch("/api/settings/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Failed to change password");
      return;
    }
    setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setMessage("Password changed successfully");
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  function subscribeAction() {
    if (subscription.stripeEnabled) {
      return runSubscription("checkout");
    }
    return runSubscription("subscribe");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <div>
        <h1 className="text-lg font-semibold text-slate-800">Settings</h1>
        <p className="text-sm text-slate-500">
          Manage your account, security, and subscription.
        </p>
      </div>

      {expiredRedirect && !active && (
        <div className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <AlertCircle size={18} className="shrink-0" />
          Your access has expired. Subscribe below to restore full dashboard access.
        </div>
      )}
      {subscribed && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Welcome to MarsaTrade Pro! Your subscription is active.
        </div>
      )}
      {cancelled && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          Checkout was cancelled. You can subscribe anytime from this page.
        </div>
      )}
      {message && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {message}
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Profile */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <User size={18} className="text-navy-600" />
          <h2 className="text-sm font-semibold text-slate-800">Profile</h2>
        </div>
        <form onSubmit={saveProfile} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Full name
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Company
            </label>
            <input
              type="text"
              value={profile.company}
              onChange={(e) => setProfile({ ...profile, company: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Email
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-navy-600 px-4 py-2 text-sm font-medium text-white hover:bg-navy-700 disabled:opacity-50"
          >
            Save profile
          </button>
        </form>
      </section>

      {/* Security */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Lock size={18} className="text-navy-600" />
          <h2 className="text-sm font-semibold text-slate-800">Security</h2>
        </div>
        <form onSubmit={changePassword} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Current password
            </label>
            <input
              type="password"
              value={passwords.currentPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, currentPassword: e.target.value })
              }
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              New password
            </label>
            <input
              type="password"
              value={passwords.newPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, newPassword: e.target.value })
              }
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600"
              minLength={8}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Confirm new password
            </label>
            <input
              type="password"
              value={passwords.confirmPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, confirmPassword: e.target.value })
              }
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600"
              minLength={8}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Change password
          </button>
        </form>
      </section>

      {/* Subscription */}
      <section id="billing" className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Crown size={18} className="text-amber-500" />
          <h2 className="text-sm font-semibold text-slate-800">
            Subscription & billing
          </h2>
        </div>

        <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-800">
                {getPlanLabel(user.plan)}
              </p>
              <p
                className={`mt-1 text-xs font-medium ${
                  active ? "text-emerald-600" : "text-red-500"
                }`}
              >
                {subscription.statusLabel}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-slate-800">
                €{subscription.priceEur}
                <span className="text-sm font-normal text-slate-500">/month</span>
              </p>
              {user.plan !== "none" && periodDate && (
                <p className="mt-1 text-xs text-slate-500">
                  {subscription.periodEndLabel}: {formatBillingDate(periodDate)}
                </p>
              )}
            </div>
          </div>

          <ul className="mt-4 space-y-1.5">
            {PRO_FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-xs text-slate-600">
                <Check size={14} className="text-emerald-500" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {(!active || user.plan === "trial" || user.plan === "none") && (
            <button
              onClick={subscribeAction}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-navy-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 disabled:opacity-50"
            >
              <CreditCard size={16} />
              Subscribe — €{subscription.priceEur}/month
            </button>
          )}

          {active && user.plan === "pro" && !subscription.cancelAtPeriodEnd && (
            <>
              {subscription.stripeEnabled && subscription.hasStripeCustomer ? (
                <button
                  onClick={() => runSubscription("portal")}
                  disabled={loading}
                  className="flex items-center gap-2 rounded-lg bg-navy-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 disabled:opacity-50"
                >
                  <CreditCard size={16} />
                  Manage subscription
                </button>
              ) : (
                <button
                  onClick={() => runSubscription("cancel")}
                  disabled={loading}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel subscription
                </button>
              )}
            </>
          )}

          {active && user.plan === "pro" && subscription.cancelAtPeriodEnd && (
            <button
              onClick={() => runSubscription("reactivate")}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-navy-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 disabled:opacity-50"
            >
              Reactivate subscription
            </button>
          )}

          {active && user.plan === "trial" && (
            <button
              onClick={subscribeAction}
              disabled={loading}
              className="rounded-lg border border-navy-200 px-4 py-2.5 text-sm font-medium text-navy-700 hover:bg-navy-50 disabled:opacity-50"
            >
              Upgrade before trial ends
            </button>
          )}
        </div>

        <p className="mt-4 text-xs text-slate-500">
          {subscription.stripeEnabled
            ? "Payments are processed securely by Stripe. Update your card or download invoices from the billing portal."
            : "Billing is managed in-app. Connect Stripe (STRIPE_SECRET_KEY + STRIPE_PRICE_ID) to accept card payments at €29/month."}
        </p>
      </section>

      {user.role === "admin" && (
        <section className="rounded-xl border border-violet-200 bg-violet-50 p-6">
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
        </section>
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
