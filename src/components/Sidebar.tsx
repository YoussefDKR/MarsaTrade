"use client";

import {
  LayoutDashboard,
  TrendingUp,
  Ship,
  Newspaper,
  FileText,
  Settings,
  Crown,
  BarChart3,
  Shield,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MarsaTradeMark } from "@/components/MarsaTradeLogo";
import type { SessionUser, SubscriptionPlan } from "@/types/auth";
import { formatBillingDate } from "@/lib/subscription-utils";
import { useLocale } from "@/i18n/LocaleProvider";
import { useNav } from "@/context/NavContext";

const navKeys = [
  { href: "/dashboard", key: "nav.dashboard", icon: LayoutDashboard },
  { href: "/intelligence", key: "nav.intelligence", icon: BarChart3 },
  { href: "/prices", key: "nav.prices", icon: TrendingUp },
  { href: "/freight", key: "nav.freight", icon: Ship },
  { href: "/news", key: "nav.news", icon: Newspaper },
  { href: "/reports", key: "nav.reports", icon: FileText },
  { href: "/settings", key: "nav.settings", icon: Settings },
] as const;

function planLabel(plan: SubscriptionPlan, t: (key: string) => string) {
  switch (plan) {
    case "pro":
      return t("sidebar.planPro");
    case "trial":
      return t("sidebar.planTrial");
    default:
      return t("sidebar.planNone");
  }
}

type Props = {
  user: SessionUser;
};

export function Sidebar({ user }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { t, locale } = useLocale();
  const { mobileOpen, setMobileOpen } = useNav();

  const billingDate =
    user.plan === "trial"
      ? formatBillingDate(user.trialEndsAt, locale)
      : formatBillingDate(user.billingEndsAt, locale);

  function navClick() {
    setMobileOpen(false);
  }

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-60 flex-col bg-navy-950 text-white transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4">
          <MarsaTradeMark />
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1 text-slate-400 hover:text-white lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="mt-2 flex-1 space-y-0.5 overflow-y-auto px-3">
          {navKeys.map(({ href, key, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={navClick}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-navy-700 text-white"
                    : "text-slate-400 hover:bg-navy-800 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {t(key)}
              </Link>
            );
          })}
          {user.role === "admin" && (
            <Link
              href="/admin"
              onClick={navClick}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                pathname === "/admin"
                  ? "bg-navy-700 text-white"
                  : "text-slate-400 hover:bg-navy-800 hover:text-white"
              }`}
            >
              <Shield size={18} />
              {t("nav.admin")}
            </Link>
          )}
        </nav>

        <div className="mx-3 mb-5 rounded-xl bg-navy-800 p-4">
          <div className="mb-2 flex items-center gap-2">
            <Crown size={16} className="text-amber-500" />
            <span className="text-xs font-semibold">{t("sidebar.pro")}</span>
          </div>
          <p className="text-[11px] text-slate-400">{planLabel(user.plan, t)}</p>
          <p className="mt-1 text-[11px] text-slate-500">
            {user.plan === "trial" ? t("sidebar.trialEnds") : t("sidebar.nextBilling")}:{" "}
            {billingDate}
          </p>
          <button
            type="button"
            onClick={() => {
              navClick();
              router.push("/settings#billing");
            }}
            className="mt-3 w-full rounded-lg bg-navy-600 py-2 text-xs font-medium transition hover:bg-blue-600"
          >
            {t("sidebar.manageSub")}
          </button>
        </div>
      </aside>
    </>
  );
}
