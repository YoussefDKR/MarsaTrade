"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { SessionUser } from "@/types/auth";
import type { SubscriptionDetails } from "@/lib/subscription-utils";
import { formatBillingDate, PRO_PRICE_EUR } from "@/lib/subscription-utils";
import { hasActiveSubscription } from "@/lib/user-utils";
import {
  Crown,
  LogOut,
  CreditCard,
  User,
  Lock,
  Check,
  AlertCircle,
  Globe,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLocale } from "@/i18n/LocaleProvider";
import { useToast } from "@/components/ToastProvider";

type Props = {
  user: SessionUser;
  subscription: SubscriptionDetails;
};

type Tab = "profile" | "security" | "billing" | "preferences";

const FEATURE_KEYS = [
  "subscription.feature1",
  "subscription.feature2",
  "subscription.feature3",
  "subscription.feature4",
  "subscription.feature5",
] as const;

export function SettingsClient({ user, subscription }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, locale } = useLocale();
  const { toast } = useToast();

  const expiredRedirect = searchParams.get("expired") === "1";
  const subscribed = searchParams.get("subscribed") === "1";
  const cancelled = searchParams.get("cancelled") === "1";

  const [tab, setTab] = useState<Tab>("profile");
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash === "billing") setTab("billing");
    else if (hash === "security") setTab("security");
    else if (hash === "preferences") setTab("preferences");
  }, []);

  function statusLabel() {
    if (user.plan === "pro" && user.cancelAtPeriodEnd && active) return t("settings.statusCancels");
    if (user.plan === "pro" && !active) return t("settings.statusExpired");
    if (user.plan === "trial" && !active) return t("settings.statusTrialExpired");
    if (active) return t("settings.statusActive");
    return t("settings.statusInactive");
  }

  function periodLabel() {
    if (user.plan === "trial") return t("settings.trialEnds");
    if (user.cancelAtPeriodEnd) return t("settings.accessUntil");
    return t("settings.nextBilling");
  }

  async function runSubscription(action: string) {
    setLoading(true);
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
      toast(t("settings.updated"), "success");
      router.refresh();
      return;
    }
    setError(data.error ?? t("settings.actionFailed"));
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/settings/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? t("settings.actionFailed"));
      return;
    }
    toast(t("settings.profileUpdated"), "success");
    router.refresh();
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError(t("settings.passwordMismatch"));
      return;
    }
    setLoading(true);
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
      setError(data.error ?? t("settings.actionFailed"));
      return;
    }
    setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    toast(t("settings.passwordUpdated"), "success");
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  function subscribeAction() {
    if (subscription.stripeEnabled) return runSubscription("checkout");
    return runSubscription("subscribe");
  }

  const tabs: { id: Tab; label: string; icon: typeof User }[] = [
    { id: "profile", label: t("settings.profile"), icon: User },
    { id: "security", label: t("settings.security"), icon: Lock },
    { id: "billing", label: t("settings.billing"), icon: Crown },
    { id: "preferences", label: t("settings.preferences"), icon: Globe },
  ];

  return (
    <>
      <PageHeader titleKey="settings.title" descriptionKey="settings.subtitle" />
      <div className="mx-auto max-w-3xl space-y-6 p-6">
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`inline-flex items-center gap-2 rounded-t-lg px-4 py-2.5 text-sm font-medium transition ${
                tab === id
                  ? "border-b-2 border-navy-600 text-navy-600"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {expiredRedirect && !active && (
          <div className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <AlertCircle size={18} className="shrink-0" />
            {t("settings.expiredBanner")}
          </div>
        )}
        {subscribed && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {t("settings.subscribedBanner")}
          </div>
        )}
        {cancelled && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            {t("settings.cancelledBanner")}
          </div>
        )}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {tab === "profile" && (
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <form onSubmit={saveProfile} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  {t("auth.name")}
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
                  {t("auth.company")}
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
                  {t("auth.email")}
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
                {t("settings.saveProfile")}
              </button>
            </form>
          </section>
        )}

        {tab === "security" && (
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <form onSubmit={changePassword} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  {t("settings.currentPassword")}
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
                  {t("settings.newPassword")}
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
                  {t("settings.confirmPassword")}
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
                {t("settings.changePassword")}
              </button>
            </form>
          </section>
        )}

        {tab === "billing" && (
          <section id="billing" className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {user.plan === "pro"
                      ? t("sidebar.planPro")
                      : user.plan === "trial"
                        ? t("sidebar.planTrial")
                        : t("sidebar.planNone")}
                  </p>
                  <p
                    className={`mt-1 text-xs font-medium ${
                      active ? "text-emerald-600" : "text-red-500"
                    }`}
                  >
                    {statusLabel()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-800">
                    €{PRO_PRICE_EUR}
                    <span className="text-sm font-normal text-slate-500">
                      /{t("common.month")}
                    </span>
                  </p>
                  {user.plan !== "none" && periodDate && (
                    <p className="mt-1 text-xs text-slate-500">
                      {periodLabel()}: {formatBillingDate(periodDate, locale)}
                    </p>
                  )}
                </div>
              </div>
              <ul className="mt-4 space-y-1.5">
                {FEATURE_KEYS.map((key) => (
                  <li key={key} className="flex items-center gap-2 text-xs text-slate-600">
                    <Check size={14} className="text-emerald-500" />
                    {t(key)}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {(!active || user.plan === "trial" || user.plan === "none") && (
                <button
                  type="button"
                  onClick={subscribeAction}
                  disabled={loading}
                  className="flex items-center gap-2 rounded-lg bg-navy-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 disabled:opacity-50"
                >
                  <CreditCard size={16} />
                  {t("settings.subscribeBtn", { price: PRO_PRICE_EUR })}
                </button>
              )}
              {active && user.plan === "pro" && !subscription.cancelAtPeriodEnd && (
                <>
                  {subscription.stripeEnabled && subscription.hasStripeCustomer ? (
                    <button
                      type="button"
                      onClick={() => runSubscription("portal")}
                      disabled={loading}
                      className="flex items-center gap-2 rounded-lg bg-navy-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 disabled:opacity-50"
                    >
                      <CreditCard size={16} />
                      {t("settings.manageSub")}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => runSubscription("cancel")}
                      disabled={loading}
                      className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                    >
                      {t("settings.cancelSub")}
                    </button>
                  )}
                </>
              )}
              {active && user.plan === "pro" && subscription.cancelAtPeriodEnd && (
                <button
                  type="button"
                  onClick={() => runSubscription("reactivate")}
                  disabled={loading}
                  className="flex items-center gap-2 rounded-lg bg-navy-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 disabled:opacity-50"
                >
                  {t("settings.reactivate")}
                </button>
              )}
              {active && user.plan === "trial" && (
                <button
                  type="button"
                  onClick={subscribeAction}
                  disabled={loading}
                  className="rounded-lg border border-navy-200 px-4 py-2.5 text-sm font-medium text-navy-700 hover:bg-navy-50 disabled:opacity-50"
                >
                  {t("settings.upgradeTrial")}
                </button>
              )}
            </div>
            <p className="mt-4 text-xs text-slate-500">
              {subscription.stripeEnabled
                ? t("settings.billingStripe")
                : t("settings.billingMock")}
            </p>
          </section>
        )}

        {tab === "preferences" && (
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-800">{t("settings.language")}</h3>
            <p className="mt-1 text-sm text-slate-500">{t("settings.languageDesc")}</p>
            <div className="mt-4">
              <LanguageSwitcher variant="light" />
            </div>
          </section>
        )}

        {user.role === "admin" && (
          <section className="rounded-xl border border-violet-200 bg-violet-50 p-6">
            <h2 className="text-sm font-semibold text-violet-800">{t("settings.adminTitle")}</h2>
            <p className="mt-1 text-sm text-violet-600">{t("settings.adminDesc")}</p>
            <a
              href="/admin"
              className="mt-3 inline-block rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
            >
              {t("settings.openAdmin")}
            </a>
          </section>
        )}

        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-red-500"
        >
          <LogOut size={16} />
          {t("common.signOut")}
        </button>
      </div>
    </>
  );
}
